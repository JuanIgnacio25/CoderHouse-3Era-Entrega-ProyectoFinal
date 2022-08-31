const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
      const fileName = file.fieldname + '-' + Date.now()
      cb(null, fileName)
    }
  });
  
  const upload = multer({storage: storage});

  module.exports = upload;