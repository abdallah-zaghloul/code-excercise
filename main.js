// require node_modules
const express = require('express'),
    mysql = require('mysql'),
    multer = require('multer'),
    fs = require("fs"),
    path = require('path'),
    csrf = require('csurf'),
    Jimp = require('jimp'),
    {v4: uuidv4} = require('uuid'),

// App Routing Using Express
    app = express(),
    upload = multer({dest: 'uploads/'}),
    csrfProtection = csrf({cookie: true}),

// MySQL database connection
    db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'code_exercise',
    });

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware to parse form submissions
app.use(express.urlencoded({extended: true}));
app.get('/', csrfProtection, (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Middleware for CSRF protection
app.use(csrfProtection);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Form submission route
app.post('/submit', upload.single('user_image'), (req, res) => {
    const {first_name, last_name} = req.body,
          image = req.file;

    // Validate uploaded file
    if (!image) {
        return res.status(400).send('No image file selected');
    }

    if (image.size > 2 * 1024 * 1024) {
        return res.status(400).send('File size exceeds the limit');
    }
    if (!image.mimetype.startsWith('image/')) {
        return res.status(400).send('Invalid file format. Please select an image file');
    }

    // Generate a unique filename for the uploaded image
    const filename = `${uuidv4()}${path.extname(image.originalname)}`;

    // Move the uploaded file to a permanent location
    const destination = path.join(__dirname, 'public', 'uploads', filename);
    fs.rename(image.path, destination, (err) => {
        if (err) {
            console.error('Error moving the uploaded file: ', err);
            return res.status(500).send('Internal server error');
        }

        // Save the user data to the database
        const sql = 'INSERT INTO users (first_name, last_name, image_path) VALUES (?, ?, ?)';
        const values = [first_name, last_name, destination];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error saving user data to the database: ', err);
                return res.status(500).send('Internal server error');
            }

            res.send('Form submitted successfully');
        });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});