var startCoord = [48.856578, 2.351828]
var map = L.map('map').setView(startCoord, 12);

var streetLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);
var baseMap = {
    "Carte": streetLayer
};

var circonscriptionStyle = {
    weight: 2,
    fillOpacity: 0
};
var circonscriptionsLayer = L.geoJson(circos, {style:circonscriptionStyle});
var overlayMap = {
    "Circonscriptions": circonscriptionsLayer
};


L.control.layers(baseMap, overlayMap).addTo(map);
