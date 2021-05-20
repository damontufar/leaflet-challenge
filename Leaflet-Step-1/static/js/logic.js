// Store our API endpoint as queryUrl
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

function chooseColor(depth) {

}

d3.json(queryUrl).then(function(data) {
    createFeatures(data.features);
});

//Create GeoJSON layer and add it to the map

let createFeatures = earthquakesData => {
    
    let onEachFeature = (feature, layer) => {
        layer.bindPopup(`<h3> ${feature.properties.place} </h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}<br> Depth: ${feature.geometry.coordinates[2]}`)
    }
    //Function to define color of circles by depth value
    function chooseColor(depth) {
        switch (true) {
        case (depth<=10):
            return "green";
        case (depth>10 && depth<30):
            return "lightgreen";
        case (depth>30 && depth<50):
            return "yellow";
        case (depth>50 && depth<70):
            return "orange";
        case (depth>70 && depth<90):
            return "red";
        case (depth>90):
            return "darkred";
        default:
            return "white";
        }
    }

    let earthquakes = L.geoJSON(earthquakesData, {
        pointToLayer: function (feature, latlng) {
            let geojsonMarkerOptions = {
                stroke: false,
                color: "black",
                fillOpacity:0.75,
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                radius: feature.properties.mag*2.5
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature : onEachFeature
    });
    createMap(earthquakes);
    
}

let createMap = (earthquakes) => {
    //Define satellite map, grayscale and outdoors
    let satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    let light =  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    let outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });

    // Define baseMap object to hold layers
    let baseMaps = {
        "Satellite Map" : satellite,
        "Light Map" : light,
        "Outdoor Map": outdoors
    }

    // Create overlay object to hold the overlay layer
    let overlayMaps = {
        Eartquakes : earthquakes
    };

    //Create the map giving the layers to display
    let myMap = L.map("map", {
        center: [33.274776, -31.875771],
        zoom: 3.4,
        layers: [satellite, earthquakes]

    });
    
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map

    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

};






