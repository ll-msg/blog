import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import passport from 'passport'
import './auth/github.js';
import { Strategy as JwtStrategy} from 'passport-jwt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import { pool } from './db.js';


dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
})); //TODO: change to real frontend path
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
 * Auth routes
 */
app.get('/auth/github', passport.authenticate('github'));

//FIXME: not redirect directly?

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: 'http://localhost:5173/', session: false }),
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
      sameSite: 'strict',
      maxAge: 30*60*1000
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/token/refresh', //Fixme: fix path
      maxAge: 7*24*60*60*1000
    })
    res.redirect(`http://localhost:5173/`); // back to home page with token
});

// check log in status
app.get('/logged', 
  passport.authenticate('jwt', {session: false}),
  function(req, res) {
    res.json({
      github_id: req.user.github_id,
      username: req.user.username,
      role: req.user.role,
      avatar: req.user.avatar
    });
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
    const result = await pool.query(`
      SELECT * FROM articles WHERE id = $1
    `, [articleId]);
    res.json(result.rows[0]);
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to retrieve the article' });
  }
})

//TODO: allow category update
app.put('/article/:articleId', async function(req, res) {
  try{
    const articleId = req.params.articleId
    const {title, content} = req.body;
    const result = await pool.query(`
      UPDATE articles SET title = $1, body = $2 WHERE id = $3
      RETURNING *
    `, [title, content, articleId]);
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
      SELECT id, title FROM articles WHERE category_id = $1
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
