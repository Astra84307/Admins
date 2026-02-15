const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = 7700;

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!fs.existsSync('images')) fs.mkdirSync('images');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'images'),
    filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
});
const upload = multer({ storage });

// Endpoint to add post
app.post('/addPost', upload.single('image'), (req, res) => {
    const { title, description, download } = req.body;
    const image = 'images/' + req.file.filename;
    
    let posts = [];
    if (fs.existsSync('posts.json')) {
        posts = JSON.parse(fs.readFileSync('posts.json'));
    }
    
    posts.push({ title, description, download, image });
    fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));
    res.json({ success: true });
});

// Endpoint to fetch posts
app.get('/posts.json', (req, res) => {
    if (fs.existsSync('posts.json')) {
        res.json(JSON.parse(fs.readFileSync('posts.json')));
    } else {
        res.json([]);
    }
});

app.listen(PORT, () => console.log(`Admin Panel running at http://localhost:${PORT}`));
