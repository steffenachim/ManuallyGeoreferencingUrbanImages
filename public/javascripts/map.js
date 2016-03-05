var map;
//- Init Map view
$( document ).ready(function() {
    map = L.map('map').setView([51.97014, 7.596930], 15);

// Create layers
    var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '',
        maxZoom: 18
    });
    Esri_WorldImagery.addTo(map);
    var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 19,
    });
    osm.addTo(map);

    var baseMaps = {
        "Esri_WorldImagery": Esri_WorldImagery,
        "OSM": osm,
    };
    L.control.layers(baseMaps).addTo(map);

    window.setTimeout(function () {
        map.invalidateSize();
    }, 100);
})