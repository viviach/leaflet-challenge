
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log (data)

  function markerSize(magnitude) {
    return magnitude *5;
  }
  var EarthquakeMarkers = [];
  // var markers=L.layerGroup();
  // Loop through locations and create city and state markers
  for (var i = 0; i < data.features.length; i++) {
    // Setting the marker radius for the state by passing population into the markerSize function
      EarthquakeMarkers.push(
        L.circleMarker([data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]], {
          stroke: false,
          fillOpacity: 0.75,
          color: "red",
          fillColor: "red",
          radius: markerSize(data.features[i].properties.mag)
        })
     );
    }
    // console.log(markers)
  
    console.log(EarthquakeMarkers)
    var markers = L.layerGroup(EarthquakeMarkers);

    var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: 'satellite-v9',
      accessToken: API_KEY
      });
    
      var outmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "outdoors-v11",
        accessToken: API_KEY
      });
    
      var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
      });
  
      // Define a baseMaps object to hold our base layers
      var baseMaps = {
        "Sateliite": satmap,
        "Outdoors": outmap,
        "Light Map" : lightmap
      };
  
      // Create overlay object to hold our overlay layer
      var overlayMaps = {
        markers: markers 
      };
    
      // Create our map, giving it the streetmap and earthquakes layers to display on load
      var myMap = L.map("mapid", {
        center: [0,0],
        zoom: 3,
        layers: [outmap, markers]
      });
    markers.addTo(myMap)
      // Create a layer control
      // Pass in our baseMaps and overlayMaps
      // Add the layer control to the map
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
});

