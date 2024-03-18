const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route to get list of uploaded images
app.get('/images', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error getting images');
    }
    res.json(files);
  });
});

// Route to upload an image
app.post('/upload', upload.single('image'), (req, res) => {
  res.send('Image uploaded successfully');
});

// Route to delete an image
app.delete('/delete/:imageName', (req, res) => {
  const imagePath = path.join(__dirname, 'uploads', req.params.imageName);
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting image');
    }
    res.send('Image deleted successfully');
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});