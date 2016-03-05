$( document ).ready(function() {// Submit Uploadform


// AddPointModeA: Change image marker
    $(function () {
        $("#imgFullViewCan").click(function (e) {
            // Register
            if (selectedPoint >= 0) {
                RedrawPoints(selectedPoint);

                var myimage = document.getElementById("imgFullView");
                var offset = $(this).offset();
                var relativeX = (e.pageX - offset.left);
                var relativeY = (e.pageY - offset.top);

                var absoluteX = Math.floor(relativeX * (myimage.naturalWidth / myimage.width));
                var absoluteY = Math.floor(relativeY * (myimage.naturalHeight / myimage.height));

                DrawNewPoint(absoluteX, absoluteY, TranslateNumToColor(selectedPoint));
                settetImgCoord = absoluteX + " " + absoluteY;
                UpdateSetPointAViewDatas();
            }
        });
    });

    // AddPointModeA: Change position of marker
    var tmpMarker = L.marker();
    map.on('click', function (e) {
        map.removeLayer(tmpMarker)
        if (selectedPoint >= 0) {
            RedrawMarkers(selectedPoint);
            var icon = L.MakiMarkers.icon({icon: "rocket", color: TranslateNumToColor(selectedPoint), size: "m"});
            tmpMarker = L.marker([e.latlng.lat, e.latlng.lng], {icon: icon});
            tmpMarker.addTo(map);
            settetGeoCoord = e.latlng.lat + " " + e.latlng.lng;
            UpdateSetPointAViewDatas();
        }
    });

    // Change validation datas
    $("#ud_gps_coords").change(function() { UpdatetUploadGeoPosition();})
    $("#ud_gps_orientation").change(function() { UpdatetUploadGeoPosition();})
})


// Redraw points when window size changed
window.onresize = function(event) {
    if(currentView=="detailViewA" || currentView=="AddPointModeA") {
        SetClickAbleImage(true);
        RedrawPoints();
    }
};