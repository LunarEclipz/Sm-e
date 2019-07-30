const multer = require('multer');
const path = require('path');

// Set The Storage Engine
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, './public/uploads/');
	},
	filename: (req, file, callback) => {
		callback(null, Date.now() + path.extname(file.originalname));
	}
});

// Init Upload
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1000000
	},
	fileFilter: (req, file, callback) => {
		checkFileType(file, callback);
	}
}).single('petPicUpload');

// Check File Type
function checkFileType(file, callback) {
	// Allowed file extensions
	const filetypes = /jpeg|jpg|png|gif/;
	// Check ext
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	// Check mime
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return callback(null, true);
	} else {
		callback({message: 'Images Only'});
	}
}

module.exports = upload;