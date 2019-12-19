
// --------------------------------------------------
// | DATABASE STUFF |
// --------------------------------------------------
console.log("im in the JS file!")

function loadJsonData() {
  console.log("im in the loadData function!")

  d3.json(`/data_json`).then((data) => {

    console.log("im in the json data to do area!")
    
  });
}

function loadCsvData(){

  // d3.csv("/data_csv", function(data) {
  //   console.log(data['name']);
  // });

}


// --------------------------------------------------
// | MAP STUFF |
// --------------------------------------------------
var myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 13
});


L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);


loadJsonData();
loadCsvData();


// --------------------------------------------------
// | HTML FORM STUFF |
// --------------------------------------------------
$("#my_form").submit(function(e) {

  e.preventDefault();
  
  var categories = document.getElementById('cat_id').value;
  var weightA = document.getElementById('weight_a_id').value;
  var weightB = document.getElementById('weight_b_id').value;
  var mapType = $('#map_type_id label.active input').val()
  
  console.log(categories);
  console.log(weightA);
  console.log(weightB);
  console.log(mapType);

});

// --------------------------------------------------
// | PLOTTING STUFF |
// --------------------------------------------------
var trace1 = {
  x: ["beer", "wine", "martini", "margarita",
    "ice tea", "rum & coke", "mai tai", "gin & tonic"],
  y: [22.7, 17.1, 9.9, 8.7, 7.2, 6.1, 6.0, 4.6],
  type: "bar"
};

var data = [trace1];

var layout = {
  title: "'Bar' Chart"
};

Plotly.newPlot("plot", data, layout);