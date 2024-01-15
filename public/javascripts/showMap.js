locationiq.key = mapToken;
const parsedCafe = JSON.parse(cafe);
//Define the map and configure the map's theme
var map = new maplibregl.Map({
    container: 'showMap',
    style: locationiq.getLayer("Streets"),
    zoom: 12,
    center: parsedCafe.geometry.coordinates,
});

var el2 = document.createElement('div');
el2.className = 'marker';
el2.style.backgroundImage = 'url(https://tiles.locationiq.com/static/images/marker50px.png)';
el2.style.width = '50px';
el2.style.height = '50px';

// add marker to map

new maplibregl.Marker(el2)
    .setLngLat(parsedCafe.geometry.coordinates)
    .setPopup(
        new maplibregl.Popup({offset:25})
            .setHTML(
                `<h3>${parsedCafe.title}</h3><p>${parsedCafe.location}</p>`
            )
    )
    .addTo(map);