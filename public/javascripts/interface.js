var activeObject; // selected detailed object
var tmpUploadMarker;
var tmpUploadView;

//- Simple Show/Hide functions for main views
function HideAll() {
    $("#general").hide();
    $("#uploadDialog").hide();
    $("#detailViewA").hide();
    $("#setPointsA").hide();

    if(tmpUploadMarker!=null) map.removeLayer(tmpUploadMarker);
    if(tmpUploadView!=null) tmpUploadView.Clear();
    if(calcedMarker!=null) map.removeLayer(calcedMarker);
    if(calcedView!=null) calcedView.Clear();

    // Disable Click Canvas
    SetClickAbleImage(false);
    // Reset map
    $("#mapCell").css("width","100%");
    $("#imgCell").css("width","0%");
    window.setTimeout(function () {map.invalidateSize();}, 100);
}
var currentView="";
function ShowDefaultView() {
    HideAll();
    $("#general").show();
    $("#topTable").css("height","calc(100% - 50px)");
    currentView="general";
    UpdateAllMarkers();
    window.setTimeout(function () {
        map.invalidateSize();
    }, 200);
}

function ShowUploadDialog() {
    activeObject=null;
    $("#saveNewImgLink").hide();
    HideAll();
    $("#topTable").css("height","calc(100% - 120px)");
    $("#uploadDialog").show();
    currentView="uploadDialog";
}




var calcedMarker;
var calcedView;
function ShowDetailViewA() {

    markers.clearLayers();
    curMarkers.clearLayers();

    if(activeObject==null) {
        alert("No image selected");
    } else {
        HideAll();
        $("#topTable").css("height","calc(100% - 120px)");
        $("#detailViewA").show();
        currentView="detailViewA";
        SetImageView(50);


        //Create ref points table and show them
        var lineContent="";
        if(activeObject.hasOwnProperty("refPoints")) {
            for (i = 0; i < activeObject.refPoints.length; i++) {
                var curRefPoint=activeObject.refPoints[i];
                lineContent += "<tr>" +
                    "<th><span style='color:"+TranslateNumToColor(i)+"'>Point "+i+"</span></th>" +
                    "<th><a href='#' onclick='EditRefPoint("+i+")'>Edit</a> - " +
                    "<a href='#' onclick='RemoveRefPoint("+i+")'>Remove</a></th>" +
                    "</tr>";

                // Draw on img
                DrawNewPoint(curRefPoint.img_Coordinates.split(" ")[0],curRefPoint.img_Coordinates.split(" ")[1], TranslateNumToColor(i));

                // Draw on map
                var icon = L.MakiMarkers.icon({icon: i, color: TranslateNumToColor(i), size: "m"});
                curMarkers.addLayer(L.marker([curRefPoint.geo_Coordinates.split(" ")[0], curRefPoint.geo_Coordinates.split(" ")[1]], {icon: icon}));

            }
            $("#referenceTable").html(lineContent);
        }
        curMarkers.addTo(map);

        // Set datas
        if(CalcGeoCoords()!="") $("#calced_geo_coords").html(CalcGeoCoords().split(" ")[0].substring(0,6)+" "+CalcGeoCoords().split(" ")[1].substring(0,6));
            else $("#calced_geo_coords").html("");
        $("#calced_orientation").html(CalcOrientation());

        $("#given_geo_coords").html(activeObject.gps_coordinates.split(" ")[0].substring(0,6)+" "+
            activeObject.gps_coordinates.split(" ")[1].substring(0,6));
        if(activeObject.gps_coordinates!="") {
            // Draw marker
            var icon = L.MakiMarkers.icon({icon: "v", color: "#828282", size: "s"});
            if(tmpUploadMarker!=null)map.removeLayer(tmpUploadMarker);
            tmpUploadMarker=L.marker([activeObject.gps_coordinates.split(" ")[0], activeObject.gps_coordinates.split(" ")[1]],{icon: icon});
            tmpUploadMarker.addTo(map);

            // Draw view field
            if(activeObject.gps_imgdirection!="" && activeObject.focal_length!=""  && activeObject.sensor_width!="") {
                tmpUploadView=DrawViewField(activeObject.gps_coordinates, activeObject.gps_imgdirection,
                                                    CalcViewAngle(activeObject.focal_length, activeObject.sensor_width));
            }

            map.panTo(new L.LatLng(activeObject.gps_coordinates.split(" ")[0], activeObject.gps_coordinates.split(" ")[1]));
            map.setZoom(20);
            window.setTimeout(function () {map.invalidateSize();}, 200);
        }
        $("#given_orientation").html(activeObject.gps_imgdirection);

        // Calculate delta values
        var delta_coords="";
        if(CalcGeoCoords()!="" && activeObject.gps_coordinates!="")
        {
            delta_coords=Math.abs(activeObject.gps_coordinates.split(" ")[0]-CalcGeoCoords().split(" ")[0])+
                Math.abs(activeObject.gps_coordinates.split(" ")[1]-CalcGeoCoords().split(" ")[1]);
        }
        var delta_orientation="";
        if(CalcOrientation()!="" && activeObject.gps_imgdirection!="")
        {
            delta_orientation=Math.abs(activeObject.gps_imgdirection.split(" ")[0]-CalcOrientation().split(" ")[0]);
        }
        $("#delta_geo_coords").html(delta_coords);
        $("#delta_orientation").html(delta_orientation);

        // Draw Calculation vectors
        if( CalcGeoCoords()!="" ) {
            var icon = L.MakiMarkers.icon({icon: "C", color: "#6078BA", size: "xl"});
            if(calcedMarker!=null)map.removeLayer(calcedMarker);
            calcedMarker=L.marker([CalcGeoCoords().split(" ")[0], CalcGeoCoords().split(" ")[1]],{icon: icon});
            calcedMarker.addTo(map);

            if(CalcOrientation()!="" && activeObject.focal_length!="" && activeObject.sensor_width!="") {
                calcedView=DrawViewField(CalcGeoCoords(), CalcOrientation(),
                    CalcViewAngle(activeObject.focal_length, activeObject.sensor_width));
            }
        }
    }
}

// Remove a ref point
function RemoveRefPoint(index) {
    activeObject.refPoints.splice(index, 1);
    SaveActiveObject();
    ShowDetailViewA();
}

// Edit a ref point
function EditRefPoint(index) {
    settetGeoCoord=activeObject.refPoints[index].geo_Coordinates;
    settetImgCoord=activeObject.refPoints[index].img_Coordinates;
    selectedPoint=index;
    AddPointModeA(false);
}

// Set active Obj and show DetailView
function ClickPopupSelect(index) {
    activeObject=markerDatas[index];
    ShowDetailViewA();
}
