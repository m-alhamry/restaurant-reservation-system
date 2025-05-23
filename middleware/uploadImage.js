const multer = require('multer'); // multer for file uploads

// Configure Multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

module.exports = {
    upload,
}