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

    newMarker.bindPopup(response.name + "<br> rating: " + response.rating);
  }

});



function getIcon(restaurant) {
  var Icon = L.icon({
    iconUrl: `static/img/${restaurant.categories}.png`,
    iconSize:     [(restaurant.rating-1.5)*15, (restaurant.rating-1.5).rating*15], // size of the icon
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
  console.log(categories);
  console.log(categories[0]);
  console.log(categories[1]);
  var weight_a = document.getElementById('weight_a_id').value;
  if (weight_a == '') {weight_a = 1};
  // console.log(weight_a);
  var weight_b = document.getElementById('weight_b_id').value;
  if (weight_b == '') {weight_b = 0};
  // console.log(weight_b);
  var regular_or_heat = document.getElementById('regular_or_heat_id').value;
  if (regular_or_heat == '') {regular_or_heat = 'regular'};
  // console.log(regular_or_heat);



  var new_layers=[];
  for (var i = 0; i < categories.length; i++) {
    new_layers[categories[i]] = new L.LayerGroup();
  }
  console.log(new_layers);

  var weighted_ratings = [];
  var url = '/data_json'

  d3.json(url).then(function(results) {
    var responses = results.data;
    // for (var j = 0; j < categories.length; j++) {
      for (var i = 0; i < responses.length; i++) {

        if (categories.includes(responses[i].categories)) {
          var response = responses[i];
          var category = response.categories;
          // console.log(category);
          response.rating = response.rating * weight_a - weight_b;
          var newMarker = L.marker([response.latitude, response.longitude], {
            icon: getIcon(response)
          });

          newMarker.addTo(new_layers[category]);

          newMarker.bindPopup(response.name + "<br> rating: " + response.rating);
        }
      }
    // }
  });

  var new_layer_control = L.control.layers(null, new_layers).addTo(map);
  // var map = L.map("map", {
  //   center: [37.754135, -122.447331],
  //   zoom: 12,

  // });


}