// Store API endpoint as queryUrl

let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

// Perform a GET request to the query URL

d3.json(queryUrl).then(function(data){
    createFeatures(data.features);
})

//Create GeoJSON layer and add it to the map


let createFeatures = earthquakesData => {
    let onEachFeature = (feature, layer) => {
        layer.bindPopUp(`<h3> ${feature.properties.place} </h3><hr><p>${new Date(feature.properties.time)}</p>`)
    }
    let earthquakes = L.geoJSON(earthquakesData, {
        onEachFeature: onEachFeature
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
        id: "mapbox://styles/mapbox/satellite-v9",
        accessToken: API_KEY
    });

    let light =  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox://styles/mapbox/light-v10",
        accessToken: API_KEY
    });

    let outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox://styles/mapbox/outdoors-v11",
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

    let myMap = L.map("mapid", {
        center: [36.204824, 138.252924],
        zoom:10,
        layers: [satellite, light, outdoors]
    });
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map

    L.control.layers(baseMaps, overlayMaps, {
        collapsed:false
    }).addTo(myMap);

}


