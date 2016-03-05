// Save a new uploaded image
function SaveNewImage(activeObject) {
    if(activeObject==null) {

    } else {
        $("#saveNewImgLink").hide();
        // Add infos
        var selectedRefMethod=$('input[name=refMethod]:checked').val();
        if(activeObject.hasOwnProperty("refMethod")==false) {
            activeObject["refMethod"]=selectedRefMethod;
        } else {
            activeObject.refMethod=selectedRefMethod;
        }
        activeObject.gps_coordinates=$("#ud_gps_coords").val();
        activeObject.gps_imgdirection=$("#ud_gps_orientation").val();
        activeObject.sensor_width=$("#ud_sensor_width").val();
        activeObject.focal_length=$("#ud_focal_length").val();

        $.post("/SaveObject",{datajson: JSON.stringify(activeObject), profile: getCookie("profile")}, function( data )
            {
                ShowDetailViewA();
            }
        )

    }
}

// Calc the view angles
function CalcViewAngle(focal_length, sensor_width) {
    return (2*Math.atan(sensor_width/(2*focal_length)))* 180/Math.PI;
}

// Calc degree to radiant
Number.prototype.toRad = function() {
    return this * Math.PI / 180;
}


// Translate int to colors for the dots
function TranslateNumToColor(index) {
    if(index==0) return "#76DFDF";
    if(index==1) return "#B6F690";
    if(index==2) return "#FFC596";
    if(index==3) return "#F992AA";
    if(index==4) return "#FFE29B";
    return "#ADE0D9";
}



// Calc the geo coordinates from given points
function CalcGeoCoords() {
    return "";
}

// Calc the orientation from given points
function CalcOrientation() {
    return "";
}

// Set the partition of the img and map view at detail view
function SetImageView(procentImage) {
    $("#imgCell").css("width",procentImage+"%");
    $("#mapCell").css("width",parseFloat(100-procentImage)+"%");
    $("#imgFullView").attr("src","uploads/"+activeObject.filename);
    SetClickAbleImage(true);
    RedrawPoints();
    window.setTimeout(function () {map.invalidateSize();}, 200);
}