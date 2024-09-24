const multer = require('multer');

// Configure memory storage to store the image as a buffer
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = upload;
