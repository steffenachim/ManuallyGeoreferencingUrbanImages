var express = require('express');
var router = express.Router();
var fs = require('fs-extra');


/* GET home page. */
router.get('/*', function(req, res, next) {
  res.render('index', { title: 'Manual georeferencing methods - Example implementation' });
});

// Settings for uploading image
var multer  =   require('multer');
var app         =   express();
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/uploads');   // Upload folder
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now()+".JPG"); // Filename generation
    }
});
var upload = multer({ storage : storage}).single('image');
var ExifImage = require('exif').ExifImage;


// Post (image upload)
router.post('/UploadImage', function(req, res, next) {
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }

        // Read exif datas
        var gps_coords="";
        var gps_imgdirection="";
        var focal="";
        try {
            new ExifImage({ image : 'public/uploads/'+res.req.file.filename }, function (error, exifData) {
                if (error)
                    console.log('Error: '+error.message);
                else
                {
                    if(exifData.hasOwnProperty("gps")) {
                        if(exifData["gps"].hasOwnProperty("GPSLatitude") && exifData["gps"].hasOwnProperty("GPSLongitude")) {
                            var lati=exifData["gps"]["GPSLatitude"];
                            var longi=exifData["gps"]["GPSLongitude"];
                            focal=exifData["exif"]["FocalLength"];
                            var latiint=parseFloat(parseFloat(lati[0])+(parseFloat(lati[1])/60)+(parseFloat(lati[2])/3600));
                            var longiint=parseFloat(parseFloat(longi[0])+(parseFloat(longi[1])/60)+(parseFloat(longi[2])/3600));
                            gps_coords=latiint+" "+longiint;
                            gps_coords=gps_coords;//.replace(",",".").replace(",",".");
                        }

                        if(exifData["gps"].hasOwnProperty("GPSImgDirection")) {
                            gps_imgdirection=exifData["gps"]["GPSImgDirection"];
                        }
                    }

                    // Create output array
                    var output = { "filename": res.req.file.filename, "gps_coordinates": gps_coords, "gps_imgdirection": gps_imgdirection ,
                        "focal_length": focal, "sensor_width": "6.17", "refPoints": []};



                    console.log('OUTPUT: '+JSON.stringify(output));
                    res.end(JSON.stringify(output));
                }
            });
        } catch (error) {
            res.end('Error: ' + error.message);
            var output = { "filename": error.message};

            res.end(JSON.stringify(output));
        }

    });
});



// Save an object
router.post('/SaveObject', function(req, res, next) {
    SaveObject(req.body.datajson, req.body.profile);
    res.end("Success");
});
// Save Object to filename.txt
function SaveObject(jsonDataStr, profilename) {
    fs.writeFile("./db/"+profilename+"_"+JSON.parse(jsonDataStr).filename.replace(".JPG",".txt"), jsonDataStr , function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

}



// Returns all markers for given profile
router.post('/GetAllMarkers', function(req, res, next) {
    var files = fs.readdirSync('./db/');
    var allStr='[';
    for (var i in files) {
        if(files[i].indexOf(req.body.profile+"_")>-1) {
            var newcontent=newcontent=fs.readFileSync("./db/"+files[i], "utf8");
            if(newcontent.length>5) {
                if(allStr.length>4) allStr+=",";
                allStr+= newcontent;

            }
        }
    }
    allStr+="]";
    allStr= allStr.replace(",,",",");
    res.end(allStr);
});




// Set profile request
// Clear or generate files from 'template_' profile
router.post('/SetProfile', function(req, res, next) {
    var thereAreFiles=false;
    var files = fs.readdirSync('./db/');
    for (var i in files) {
        if(files[i].indexOf(req.body.profile+"_")>-1) thereAreFiles=true;
    }

    if(req.body.clear=="true") {
        // Delete existing ones
        if(thereAreFiles) {
            var files = fs.readdirSync('./db/');
            for (var i in files) {
                if(files[i].indexOf(req.body.profile+"_")>-1) {
                    fs.unlinkSync("./db/"+files[i]);
                }
            }
        }
    } else {
        // Copy 'template' files
        if(thereAreFiles==false) {
            var files = fs.readdirSync('./db/');
            for (var i in files) {
                if(files[i].indexOf("template_")>-1) {
                    fs.copySync("./db/"+files[i], "./db/"+req.body.profile+"_"+files[i].replace("template_",""));
                }
            }
        }
    }

    res.end("Success");
});

module.exports = router;
