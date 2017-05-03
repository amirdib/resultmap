var startCoord = [48.856578, 2.351828]
var map = L.map('map').setView(startCoord, 12);

var streetLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

var circonscriptionStyle = {
    weight: 2,
    fillOpacity: 0
};
var circonscriptionsLayer = L.geoJson(circos, {style:circonscriptionStyle}).addTo(map);
