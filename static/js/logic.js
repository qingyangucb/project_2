// Create the tile layer that will be the background of our map
var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY 
});


var layers = {
  Chinese: new L.LayerGroup(),
  Mexican: new L.LayerGroup(),
  Italian: new L.LayerGroup(),
  Greek: new L.LayerGroup(),
  French: new L.LayerGroup(),
  Japanese: new L.LayerGroup(),
  Thai: new L.LayerGroup(),
  Spanish: new L.LayerGroup(),
  Indian: new L.LayerGroup(),
  American: new L.LayerGroup(),
};

// Create the map with our layers
var map = L.map("map", {
  center: [37.754135, -122.447331],
  zoom: 12,
  layers: [
  layers.Chinese,
  layers.Mexican,
  layers.Italian,
  layers.Greek,
  layers.French,
  layers.Japanese,
  layers.Thai,
  layers.Spanish,
  layers.Indian,
  layers.American
  ]
});

streetMap.addTo(map);

var overlays = {
  "Chinese": layers.Chinese,
  "Mexican": layers.Mexican,
  "Italian": layers.Italian,
  "Greek": layers.Greek,
  "French": layers.French,
  "Japanese": layers.Japanese,
  "Thai": layers.Thai,
  "Spanish": layers.Spanish,
  "Indian": layers.Indian,
  "American": layers.American
};

var layer_control = L.control.layers(null, overlays).addTo(map);

var url = '/data_json'

d3.json(url).then(function(results) {
  var responses = results.data;
  for (var i = 0; i < responses.length; i++) {

    var response = responses[i];
    var category = response.categories;

    var newMarker = L.marker([response.latitude, response.longitude], {
      icon: getIcon(response)
    });
    
    newMarker.addTo(layers[category]);

    newMarker.bindPopup(response.name + "<br> rating: " + response.rating + "<br>Address :" + response.location);
  }

});



function first(restaurant) {
  var Icon = L.icon({
    iconUrl: `static/img/first.png`,
    iconSize:     [120, 120], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
  });
  return Icon;
}

function second(restaurant) {
  var Icon = L.icon({
    iconUrl: `static/img/second.png`,
    iconSize:     [100, 100], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
  });
  return Icon;
}

function third(restaurant) {
  var Icon = L.icon({
    iconUrl: `static/img/third.png`,
    iconSize:     [80, 80], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
  });
  return Icon;
}

function getIconScaled(restaurant, ratio) {
  var Icon = L.icon({
    iconUrl: `static/img/${restaurant.categories}.png`,
    iconSize:     [(restaurant.ratings-ratio*1.2)*15/ratio, (restaurant.ratings-ratio*1.2)*15/ratio], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
  });
  return Icon;
}

function getIcon(restaurant) {
  var Icon = L.icon({
    iconUrl: `static/img/${restaurant.categories}.png`,
    iconSize:     [(restaurant.rating-1.2)*15, (restaurant.rating-1.2).rating*15], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
  });
  return Icon;
}



function plotNew() {

  map.removeLayer(layers.Chinese);
  map.removeLayer(layers.Indian);
  map.removeLayer(layers.Mexican);
  map.removeLayer(layers.French);
  map.removeLayer(layers.American);
  map.removeLayer(layers.Greek);
  map.removeLayer(layers.Thai);
  map.removeLayer(layers.Japanese);
  map.removeLayer(layers.Spanish);
  map.removeLayer(layers.Italian);
  map.removeControl(layer_control)

  var categories = document.getElementById('categories_id').value;
  categories = categories.split(', ');
  if (categories == '') {categories = ['Chinese', 'Indian', 'Mexican', 'French', 'American', 'Greek', 'Thai', 'Japanese', 'Spanish', 'Italian']};
  var weight_a = document.getElementById('weight_a_id').value;
  if (weight_a == '') {weight_a = 1};
  var weight_b = document.getElementById('weight_b_id').value;
  if (weight_b == '') {weight_b = 0};
  var regular_or_heat = document.getElementById('regular_or_heat_id').value;
  if (regular_or_heat == '') {regular_or_heat = 'regular'};

  var new_layers= [];
  for (var i = 0; i < categories.length; i++) {
    new_layers[categories[i]] = new L.LayerGroup();
  }

  var heat_layer = [];

  var weighted_ratings = [];
  var ratio = 0;
  var a = 0;
  var b = 0;
  var c = 0;
  var url = '/data_json'

  d3.json(url).then(function(results) {
    var responses = results.data;

    for (var i = 0; i < responses.length; i++) {
      if (categories.includes(responses[i].categories)) {
        var category = responses[i].categories;
        responses[i].ratings = responses[i].rating * weight_a - responses[i].price.length * weight_b;
        if (responses[i].ratings <= 0) {responses[i].ratings = 0;}
          // console.log(responses[i].ratings);
          if (responses[i].ratings >= responses[c].ratings && responses[i].ratings >= responses[b].ratings && responses[i].ratings > responses[a].ratings) {a=i;}
          else if (responses[i].ratings >= responses[c].ratings && responses[i].ratings >= responses[b].ratings) {b=i;}
          else if (responses[i].ratings >= responses[c].ratings) {c=i;}
          // console.log(`${i}'th iteration: ${responses[i].rating}`);
          // console.log(`${i}'th iteration a: ${responses[a].rating}`);
          // console.log(`${i}'th iteration b: ${responses[b].rating}`);
          // console.log(`${i}'th iteration c: ${responses[c].rating}`);
          // console.log('--------------');
        }
      }

      ratio = responses[a].ratings / responses[a].rating;

      if (regular_or_heat == 'regular') {
        for (var i = 0; i < responses.length; i++) {
          if (categories.includes(responses[i].categories)) {
            var category = responses[i].categories;
            var newMarker = L.marker([responses[i].latitude, responses[i].longitude], {
              icon: getIconScaled(responses[i], ratio)
            });
            newMarker.addTo(new_layers[category]);
            newMarker.bindPopup(responses[i].name + "<br> rating: " + responses[i].ratings  + "<br>Address :" + responses[i].location);
          }
        }

        var newMarker = L.marker([responses[a].latitude, responses[a].longitude], {
          icon: first(responses[a])
        });
        newMarker.addTo(new_layers[category]);
        newMarker.bindPopup("First Place: " + responses[a].name + "<br>rating: " + responses[a].ratings + "<br>Type: " + responses[a].categories + "<br>Address :" + responses[a].location);

        var newMarker = L.marker([responses[b].latitude, responses[b].longitude], {
          icon: second(responses[b])
        });
        newMarker.addTo(new_layers[category]);
        newMarker.bindPopup("Second Place: " + responses[b].name + "<br>rating: " + responses[b].ratings + "<br>Type: " + responses[b].categories + "<br>Address :" + responses[b].location);

        var newMarker = L.marker([responses[c].latitude, responses[c].longitude], {
          icon: third(responses[c])
        });
        newMarker.addTo(new_layers[category]);
        newMarker.bindPopup("Third Place: " + responses[c].name + "<br>rating: " + responses[c].ratings + "<br>Type: " + responses[c].categories + "<br>Address :" + responses[c].location);
        var new_layer_control = L.control.layers(null, new_layers).addTo(map);    
      }

      else if (regular_or_heat == 'heat') {
        for (var i = 0; i < responses.length; i++) {
          if (categories.includes(responses[i].categories)) {
            var category = responses[i].categories;
            responses[i].ratings = responses[i].rating * weight_a - responses[i].price.length * weight_b;

            heat_layer.push([responses[i].latitude, responses[i].longitude, responses[i].ratings/1.5]);
          }
        }
        var heat = L.heatLayer(heat_layer, {
          radius: 35,
          blur: 5
        }).addTo(map); 
      }
    })
}  
