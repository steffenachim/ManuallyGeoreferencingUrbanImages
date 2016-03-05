// Add a new point
var selectedPoint=-1;
var settetImgCoord="";
var settetGeoCoord="";
function AddPointModeA(findSelectedPoint) {
    $("#detailViewA").hide();
    $("#setPointsA").show();
    $("#topTable").css("height","calc(100% - 50px)");
    currentView="AddPointModeA";
    if(findSelectedPoint) {
        selectedPoint=0;
        if(activeObject.hasOwnProperty("refPoints")) {
            for (i = 0; i < activeObject.refPoints.length; i++) {
                selectedPoint=i+1;
            }
        }
    }
    UpdateSetPointAViewDatas();
}

// Set displayed datas
function UpdateSetPointAViewDatas() {
    $("#setPointA_imgCoordinate").html(settetImgCoord);
    $("#setPointA_geoCoordinate").html(settetGeoCoord);
    if(settetImgCoord!="" && settetGeoCoord!="") {
        $("#setPointA_Continue").show();
    } else {
        $("#setPointA_Continue").hide();
    }
}

// Save settet point
function SaveSetPointADatas() {
    var createdRefPoint=
    {
        img_Coordinates: "",
        geo_Coordinates: ""
    }
    createdRefPoint.img_Coordinates=settetImgCoord;
    createdRefPoint.geo_Coordinates=settetGeoCoord;

    if(activeObject.hasOwnProperty("refPoints")==false) {
        activeObject["refPoints"]=[createdRefPoint];
    } else if(activeObject.refPoints.length<=selectedPoint) {
        activeObject.refPoints.push(createdRefPoint);
    } else {
        activeObject.refPoints[selectedPoint]=createdRefPoint;
    }
    //SaveObject(activeObject);
    SaveActiveObject();
    QuitAddPointModeA();
}

//Save current object
function SaveActiveObject() {
    $.post("/SaveObject",{datajson: JSON.stringify(activeObject), profile: getCookie("profile")},
        function( data ) { }
    )
}

// Quit this mode
function QuitAddPointModeA() {
    selectedPoint=-1;
    ShowDetailViewA();
}

