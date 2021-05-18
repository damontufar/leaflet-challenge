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

    createImageBitmap(earthquakes);
}

let createMap = (earthquakes) => {
    //Define satellite map, grayscale and outdoors
}


