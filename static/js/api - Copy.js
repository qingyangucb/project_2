var myMap = L.map("map", {
	center: [37.7749, -122.4194],
	zoom: 13
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
	attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
	maxZoom: 18,
	id: "mapbox.streets",
	accessToken: API_KEY
}).addTo(myMap);



url = "data/Chinese_data.json";

function makeMarkers(url) {

	var markers = []
	d3.json(url, function(data) {

		var response = data.businesses;
		console.log(response);

		for (var i = 0; i < response.length; i++) {
			console.log(response[i].categories[0]);
			var location = response[i].coordinates;

			if (location) {

				var marker= L.marker([location.latitude, location.longitude]);
				markers.push(marker);
			}
		}

	});
	return marker;
}