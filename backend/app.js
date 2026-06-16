import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import passport from 'passport'
import './auth/github.js';
import { Strategy as JwtStrategy} from 'passport-jwt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import { pool } from './db.js';

const allowedOrigins = [
  "http://localhost:5173",
  "https://blog.vercel.app",
  /\.vercel\.app$/,
  "https://wangyanran.com"
];


dotenv.config();

const app = express();
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser clients
    if (allowedOrigins.some(o => 
      (o instanceof RegExp ? o.test(origin) : o === origin)
    )) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})

/**
 * JWT setup
 */
app.use(cookieParser());
var opts = {
  jwtFromRequest: (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['accessToken'];
    }
    return token;
  },
  secretOrKey: process.env.JWT_SECRET,
  algorithms: ['HS256']
};

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
  try{
    const res = await pool.query('SELECT * FROM users WHERE github_id = $1', [jwt_payload.github_id]);
    const user = res.rows[0] || null;
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}))


/**
 * Health check for render
 */
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

/**
 * Auth routes
 */
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: `https://wangyanran.com/`, session: false }),
  function(req, res) {
    // Successful authentication, redirect home.
    const userInfo = req.user;
    const token = jwt.sign(
      {
        github_id: userInfo.github_id,
        username: userInfo.username,
        role: userInfo.role,
        avatar: userInfo.avatar
      },
      process.env.JWT_SECRET,
      {expiresIn: '30m'}
    );

    // refresh token
    const refreshToken = jwt.sign(
      {
        github_id: userInfo.github_id,
        username: userInfo.username,
        role: userInfo.role,
        avatar: userInfo.avatar
      },
      process.env.JWT_REFRESH_SECRET,
      {expiresIn: '7d'}
    );

    // set cookies
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30*60*1000
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/token/refresh', //Fixme: fix path
      maxAge: 7*24*60*60*1000
    })
    res.redirect(`https://wangyanran.com/`); // back to home page with token
});

// refresh token
app.get('/token/refresh', async(req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: "No refresh token" });
    
    // verify token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async(err, payload) => {
      if (err) return res.status(403).json({ error: "Invalid refresh token" });
      const result = await pool.query('SELECT * FROM users WHERE github_id = $1', [
        payload.github_id
      ]);
      const userInfo = result.rows[0];
      if (!user) return res.status(404).json({ error: "User not found" });
      
      // issue new access token
      const newAccessToken = jwt.sign(
        {
          github_id: userInfo.github_id,
          username: userInfo.username,
          role: userInfo.role,
          avatar: userInfo.avatar
        },
        process.env.JWT_SECRET,
        { expiresIn: '30m' }
      );
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 60 * 1000
      });
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
})

// check log in status
app.get('/logged', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.json({
        loggedIn: false,
        role: 'guest'
      });
    }

    return res.json({
      loggedIn: true,
      github_id: user.github_id,
      username: user.username,
      role: user.role,
      avatar: user.avatar
    });
  })(req, res, next);
});


/**
 * Article Routes
 */
async function getDbId(db, field, value) {
  const dbId = await pool.query(`SELECT id FROM ${db} WHERE ${field} = $1`, [value]);
  return dbId.rows[0]?.id;
}
app.post('/article/create', async function(req, res) {
  try {
    const { title, content, userId, createdAt, categoryName } = req.body;
    const categoryId = await getDbId('categories', 'name', categoryName);

    const result = await pool.query(`
      INSERT INTO articles (title, body, user_id, created_at, category_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [title, content, userId, createdAt, categoryId]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

app.get('/article/:articleId', async function(req, res) {
  try{
    const articleId = req.params.articleId;
    // fixme: update view strict mode double call?
    await pool.query(`UPDATE articles SET views = views + 1 WHERE id = $1`, [articleId]);
    const result = await pool.query(`
      SELECT * FROM articles WHERE id = $1
    `, [articleId]);
    res.json(result.rows[0]);
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to retrieve the article' });
  }
})

// find category
async function findCategoryId(categoryName) {
  const result = await pool.query(
    'SELECT id FROM categories WHERE LOWER(name) = LOWER($1)',
    [categoryName]
  );
  return result.rows[0].id;
}

app.put('/article/:articleId', async function(req, res) {
  try{
    const articleId = req.params.articleId
    const {title, content, categoryName} = req.body;
    const categoryId = await findCategoryId(categoryName);
    const result = await pool.query(`
      UPDATE articles SET title = $1, body = $2, category_id = $3 WHERE id = $4
      RETURNING *
    `, [title, content, categoryId, articleId]);
    res.json(result.rows[0]);
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to update the article' });
  }
})

app.delete('/article/:articleId', async (req, res) => {
  try{
    const articleId = req.params.articleId;
    const result = await pool.query(`DELETE FROM articles WHERE id = $1`, [articleId]);
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to delete the article' });
  }
})


/**
 * Directory Routes
 */
app.get('/:categoryId/directory', async function(req, res) {
  try{
    const categoryId = req.params.categoryId;
    const result = await pool.query(`
      SELECT id, title FROM articles WHERE category_id = $1 ORDER BY id ASC
    `, [categoryId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve the directory' });
  }
})

/**
 * Category Route
 */
app.get('/categories', async function(req, res) {
  try{
    const result = await pool.query(`SELECT * FROM categories`);
    res.json(result.rows);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve the categories' });
  }
})

/**
 * Category With Directories Route
 */
app.get('/categories/directories', async function(req, res) {
  try{
    const result = await pool.query(`
      SELECT c.id, c.name, c.description,
        COALESCE(
          json_agg(json_build_object('id', a.id, 'title', a.title) ORDER BY a.id ASC)
          FILTER (WHERE a.id IS NOT NULL), '[]'
        ) AS articles
      FROM categories c
      LEFT JOIN articles a ON a.category_id = c.id
      GROUP BY c.id
    `);
    res.json(result.rows);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve the categories' });
  }
})

/**
 * Search Route
 */
app.get('/search', async function(req, res) {
  const query = req.query.q;
  const ilikeQuery = `%${query}%`;
  try{
    // fuzzy matching
    const result = await pool.query (`SELECT id, title, 
      CASE WHEN position($1 in body) > 0 THEN SUBSTRING(body FROM POSITION($1 in body) - 20 FOR 100) 
      else SUBSTRING(body FROM 1 FOR 100) 
      END AS snippet 
      FROM articles WHERE title ILIKE $2 or body ILIKE $2;`, [query, ilikeQuery])
      res.json(result.rows);
  }catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search' });
  }
})

/**
 * View Count Route
 */
app.post('/view/increment', async function(req, res) {
  const articleId = req.params.articleId;
  const curView = await pool.query (`SELECT view FROM articles WHERE id = $1`, [articleId]);
})

/**
 * Article Translate Route
 */
app.post('/translate', async function(req, res) {
  const { text, target_lang } = req.body;
  try {
    const params = new URLSearchParams();
    params.append("text", text);
    params.append("target_lang", target_lang);
    const deeplRes = await fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST",
        headers: {
            "Authorization": `DeepL-Auth-Key ${process.env.DEEPL_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
    });
    const raw = await deeplRes.text();
    let data;
    try {
        data = JSON.parse(raw);
    } catch (e) {
        console.error("DeepL returned invalid response:", raw);
        return res.status(500).json({ error: "DeepL returned non-JSON." });
    }
    if (!data.translations) {
        return res.status(400).json({ error: data.message || "DeepL error" });
    }
    return res.json({ translated_text: data.translations[0].text });

  } catch (err) {
      console.error("DeepL proxy error:", err);
      return res.status(500).json({ error: "Translation failed in backend." });
  }
})