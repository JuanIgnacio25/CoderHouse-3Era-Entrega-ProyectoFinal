const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: (req, file, cb) => {
      const fileName = req.body.username + '.jpeg' 
      cb(null, fileName)
    }
  });
  
  const upload = multer({storage: storage});

  module.exports = upload;