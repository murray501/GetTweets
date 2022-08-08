import express from 'express';
import next from 'next';
import { search, tweets, users, following, follower, searchSpace, 
    liked_tweets, liking_users, retweeted_by, usersbyname, lookup_tweets, lookup_spaces } from './components/requests.js';

const app = express();

app.use(express.json());

app.post('/search', async (req, res) => {
    const query = req.body.query;
    const next_token = req.body.next_token;
    const max_results = req.body.max_results;
    const result = await search(query, next_token, max_results);
    return res.json(result);
});

app.post('/space', async (req, res) => {
    const query = req.body.query;
    const next_token = req.body.next_token;
    const max_results = req.body.max_results;
    const result = await searchSpace(query, next_token, max_results);
    return res.json(result);
});

app.post('/tweets', async (req, res) => {
    const id = req.body.id;
    const next_token = req.body.next_token;
    const max_results = req.body.max_results;
    const isExclude = req.body.isExclude
    const result = await tweets(id, next_token, max_results, isExclude);
    return res.json(result);
});

app.post('/liked_tweets', async (req, res) => {
    const id = req.body.id;
    const next_token = req.body.next_token;
    const max_results = req.body.max_results;
    const result = await liked_tweets(id, next_token, max_results);
    return res.json(result);
});

app.post('/lookup_tweets', async (req, res) => {
    const ids = req.body.ids;
    const result = await lookup_tweets(ids);
    return res.json(result);
});

app.post('/lookup_spaces', async (req, res) => {
    const ids = req.body.ids;
    const result = await lookup_spaces(ids);
    return res.json(result);
});

app.post('/liking_users', async (req, res) => {
    const id = req.body.id;
    const next_token = req.body.next_token;
    const max_results = req.body.max_results;
    const result = await liking_users(id, next_token, max_results);
    return res.json(result);
});

app.post('/retweeted_by', async (req, res) => {
    const id = req.body.id;
    const next_token = req.body.next_token;
    const max_results = req.body.max_results;
    const result = await retweeted_by(id, next_token, max_results);
    return res.json(result);
});

app.post('/following', async (req, res) => {
    const id = req.body.id;
    const next_token = req.body.next_token;
    const max_results = req.body.max_results;
    const result = await following(id, next_token, max_results);
    return res.json(result);
});

app.post('/follower', async (req, res) => {
    const id = req.body.id;
    const next_token = req.body.next_token;
    const max_results = req.body.max_results;
    const result = await follower(id, next_token, max_results);
    return res.json(result);
});

app.post('/users', async (req, res) => {
    const ids = req.body.ids;
    const result = await users(ids);
    return res.json(result);
});

app.post('/usersbyname', async (req, res) => {
    const usernames = req.body.usernames;
    const result = await usersbyname(usernames);
    return res.json(result);
});

app.listen(3000);

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });

nextApp.prepare().then(
    () => app.get('*', nextApp.getRequestHandler()),
    err => {
        console.log(err)
        process.exit(1)
    }
)