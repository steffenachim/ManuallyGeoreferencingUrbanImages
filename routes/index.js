var express = require('express');
var router = express.Router();
var fs = require('fs');


/* GET home page. */
router.get('/*', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


var multer  =   require('multer');
var app         =   express();
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});


var upload = multer({ storage : storage}).single('image');
/* Post (image upload). */
router.post('/*', function(req, res, next) {
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }

        res.end("File is uploaded"+res.req.file.filename);
    });
});
module.exports = router;
