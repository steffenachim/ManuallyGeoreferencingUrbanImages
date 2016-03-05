//- Work with the uploaded image. Show and analyze
function UploadedImage(data) {
    //alert(data);
    var obj = jQuery.parseJSON(data);
    $("#uploadedImage").attr("src","uploads/"+obj.filename);
    $("#saveNewImgLink").show();
    $("#ud_gps_coords").val(obj.gps_coordinates);
    $("#ud_gps_orientation").val(obj.gps_imgdirection);
    $("#ud_focal_length").val(obj.focal_length);
    $("#ud_sensor_width").val(obj.sensor_width);

    activeObject=obj;
    UpdatetUploadGeoPosition();

}

// Updatet parameters, redraw visualization
function UpdatetUploadGeoPosition() {

    if(tmpUploadMarker!=null) map.removeLayer(tmpUploadMarker)

    if($("#ud_gps_coords").val().indexOf(" ")>-1) {
        var icon = L.MakiMarkers.icon({icon: "v", color: "#828282", size: "s"});
        tmpUploadMarker = L.marker([$("#ud_gps_coords").val().split(" ")[0], $("#ud_gps_coords").val().split(" ")[1]], {icon: icon});
        tmpUploadMarker.addTo(map);

        map.panTo(new L.LatLng($("#ud_gps_coords").val().split(" ")[0],
            $("#ud_gps_coords").val().split(" ")[1]));
        map.setZoom(18);
        map.invalidateSize();
        if($("#ud_gps_orientation").val().length>0 && $("#ud_sensor_width").val().length>0 && $("#ud_focal_length").val().length>0) {
            tmpUploadView=DrawViewField($("#ud_gps_coords").val(), $("#ud_gps_orientation").val(),
                CalcViewAngle($("#ud_focal_length").val(), $("#ud_sensor_width").val()));
        }
    }
}

// Submit the upload form when uploadfield changed
function SubmitUploadForm(input) {
    $('#uploadForm').ajaxSubmit({
        dataType: 'text',
        success: UploadedImage
    });
    return false;
}