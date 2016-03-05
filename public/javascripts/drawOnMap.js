
// Draw and create a specific object for a view field
function DrawViewField(origin, orientation, anglewidth) {
    var pointA = new L.LatLng(origin.split(" ")[0], origin.split(" ")[1]);
    var polygonpoints=[];
    polygonpoints.push([pointA.lat, pointA.lng]);
    var speed=.0015;
    var lineLeft, lineRight;

    for(i=0; i<2; i++) {
        var angle;
        if(i==0) angle=(parseFloat(orientation)+anglewidth/2);
        if(i==1) angle=(parseFloat(orientation)-anglewidth/2);

        var pointB = new L.LatLng(parseFloat(origin.split(" ")[0])+( Math.cos(angle* Math.PI / 180) * speed),
            parseFloat(origin.split(" ")[1])+(Math.sin(angle* Math.PI / 180)*1.45 * speed) );
        polygonpoints.push([pointB.lat, pointB.lng]);

        var pointList = [pointA, pointB];

        var poly = new L.Polyline(pointList, {
            color: 'red',
            weight: 5,
            opacity: 0.2,
            smoothFactor: 1
        });
        poly.addTo(map);
        if(i==0) lineLeft=poly;
        if(i==1) lineRight=poly;

    }

    // Generate polygon
    var polygon = L.polygon([polygonpoints
    ], {
        opacity: .1,
        fillOpacity:.1
    }).addTo(map);

    var viewVisualization=
    {
        lineLeft: lineLeft,
        lineRight: lineRight,
        area: polygon,
        Clear: function () {
            map.removeLayer(lineLeft);
            map.removeLayer(lineRight);
            map.removeLayer(polygon);
        }
    }

    return viewVisualization;
}

//-Clear old markers, and load new from datas
var markers = L.layerGroup();
var markerDatas;
var curMarkers = L.layerGroup();
function UpdateAllMarkers() {
    markers.clearLayers();
    curMarkers.clearLayers();

    // Send data request
    $.post("/GetAllMarkers",{profile: getCookie("profile")}, function( data ) {
        markerDatas = $.parseJSON(data);
        for (var i = 0; i < markerDatas.length; i++) {
            var popupHtml="<img src='uploads/"+markerDatas[i].filename+"' width='200px' height='120px'>" +
                "<br><div align='center'><a href='#fullview' onclick='ClickPopupSelect("+i+")'>Full view</a></div>";

            markers.addLayer(L.marker([markerDatas[i].gps_coordinates.split(" ")[0], markerDatas[i].gps_coordinates.split(" ")[1]],
                {rotationAngle: markerDatas[i].gps_imgdirection}).bindPopup(popupHtml))

            // Pan to last added
            if(i==markerDatas.length-1) {
                map.panTo(new L.LatLng(markerDatas[i].gps_coordinates.split(" ")[0],
                    markerDatas[i].gps_coordinates.split(" ")[1]));
                map.setZoom(18);
            }
            // DrawViewField(markerDatas[i].gps_coordinates,markerDatas[i].gps_imgdirection, CalcViewAngle(markerDatas[i].focal_length, markerDatas[i].sensor_width) );
        }
        markers.addTo(map);
    });
}


// Clear and reset labels
function RedrawMarkers(excludeIndex) {
    curMarkers.clearLayers();

    for(i=0; i<activeObject.refPoints.length; i++) {
        if(i!=excludeIndex) {
            var icon = L.MakiMarkers.icon({icon: i, color: TranslateNumToColor(i), size: "m"});
            curMarkers.addLayer(L.marker([activeObject.refPoints[i].geo_Coordinates.split(" ")[0],
                activeObject.refPoints[i].geo_Coordinates.split(" ")[1]], {icon: icon}) );
        }
    }
}