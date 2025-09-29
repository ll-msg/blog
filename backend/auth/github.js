import dotenv from 'dotenv'
import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { query } from '../db.js';

dotenv.config();

const superUserId = process.env.SUPER_USER_ID || [];

passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    async function(accessToken, refreshToken, profile, cb) {
        try {
            const role = (superUserId === profile.id) ? 'admin' : 'user';
            const avatar = profile.photos?.[0]?.value || null;

            const queryResult = await query(`
                INSERT INTO users (username, role, github_id, avatar) 
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (github_id) DO UPDATE SET username = $1, role = $2, avatar = $4
                RETURNING *
            `, [profile.username, role, profile.id, avatar]);
            
            const user = queryResult.rows[0];
            return cb(null, user);
        } catch (err) {
            console.error('Github connection error:', err);
            return cb(err, null);
        }
    }   
));

passport.serializeUser((user, cb) => {
  cb(null, user.github_id)
})

passport.deserializeUser(async function(github_id, cb) {
    try {
        // find user
        const res = await pool.query('SELECT * FROM users WHERE github_id = $1', [github_id]);
        const user = res.rows[0] || null;
        cb(null, user);
    } catch {
        cb(err, null);
    }
})
