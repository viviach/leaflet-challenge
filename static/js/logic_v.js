
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log (data);
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(plates){
    createFeatures(data.features, plates);
  }
  )

  
});


function createFeatures(earthquakeData, platesdata) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function popup(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + feature.properties.mag + "</p>");
    };

    function styleMarker(features){
      return {
        stroke: false,
        weight: 1,
        color: "white",
        opacity: 0.7,
        fillColor: depthcolor(features.geometry.coordinates[2]),
        fillOpacity: 0.7,
        radius: magsize(features.properties.mag)
      }
    }
  
    function depthcolor(depth){
      if (depth>90){
        return "red"
      }
      else if (depth >70) {
        return "tomato"
      }
      else if (depth>50){
        return "orange"
      }
      else if (depth>30){
        return "yellow"
      }
      else if (depth>10){
        return "yellowgreen"
      }
      else {
      return "green"
      }
    }

    function magsize(magnitude){
      if (magnitude==0){
        return 1
      }
      else {
        return magnitude*3
      }
    }
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(feature,coord){
        return L.circleMarker(coord);
      },
      style: styleMarker,
      onEachFeature: popup
    });

    var plates= L.geoJSON(platesdata,{
      color: "blue",
      weight: 2
    })
  
    //Sending our earthquakes layer to the createMap function
    createMap(earthquakes, plates);
}

function createMap(earthquakes, plates) {

    // Define streetmap and darkmap layers
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
      Earthquakes: earthquakes,
      Plates: plates
      
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("mapid", {
      center: [0,0],
      zoom: 3,
      layers: [satmap, earthquakes, plates]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
};