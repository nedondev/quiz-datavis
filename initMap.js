function initMap() {
  var map = L.map('mapid').setView([LAT, LON], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

  return map
}

function addMarker(lat, lon) {
  L.marker([LAT, LON]).addTo(map)
    .bindPopup('Data collected from here.')
    .openPopup();
}
function redrawMarker(LAT, LON) {
  
}


