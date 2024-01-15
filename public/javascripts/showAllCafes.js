locationiq.key = mapToken;
const allCafes = JSON.parse(cafes);

 //Define the map and configure the map's theme
 var map = new maplibregl.Map({
     container: 'mainMap',
     style: locationiq.getLayer("Streets"),
     zoom: 8,
     center: [72.8777,19.0760]
 });

 //Add markers from geojson. This list can be generated dynamically with an AJAX call as well.
 var geojson = {
     type: "FeatureCollection",
     features: [],
 };



 for (let i in allCafes){
    const obj = { type: "Feature",
              properties: {
                message: allCafes[i].title,
                iconSize: [50, 50]
              },
              geometry: {
                type: "Point",
                coordinates: allCafes[i].geometry.coordinates,
              }
            }
    geojson.features.push(obj);
 }
//  console.log(geojson);

 //Add markers to map
 //https://www.mapbox.com/mapbox-gl-js/api#marker
 geojson.features.forEach(function(marker) {
     // create a DOM element for the marker
     var el = document.createElement('div');
     el.className = 'marker';
     el.style.backgroundImage = 'url(https://tiles.locationiq.com/static/images/marker50px.png)';
     el.style.width = '50px';
     el.style.height = '50px';

     //Instead of this click listener, we can attach a popup / infowindow to this marker (see next section)
     el.addEventListener('click', function() {
         window.alert(marker.properties.message);
     });

     // add marker to map
     new maplibregl.Marker(el)
         .setLngLat(marker.geometry.coordinates)
         .addTo(map);
 });


 var nav = new maplibregl.NavigationControl();
            map.addControl(nav, 'top-right');


            //Add a 'full screen' button to the map
            map.addControl(new maplibregl.FullscreenControl());
            
            //Add a Scale to the map
            map.addControl(new maplibregl.ScaleControl({
                maxWidth: 80,
                unit: 'metric' //imperial for miles
            }));

            //Add Geolocation control to the map (will only render when page is opened over HTTPS)
            map.addControl(new maplibregl.GeolocateControl({    
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true
            }));
