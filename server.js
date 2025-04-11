const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { nanoid } = require('nanoid');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use('/file', express.static('uploads'));

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const id = nanoid(6);
    const ext = path.extname(file.originalname);
    const filename = `${id}${ext}`;
    cb(null, filename);
    req.generatedId = id;
    req.fileExt = ext;
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ code: req.generatedId });
});

app.get('/download/:code', (req, res) => {
  const files = fs.readdirSync('./uploads');
  const match = files.find(f => f.startsWith(req.params.code));
  if (match) {
    res.download(`./uploads/${match}`);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

