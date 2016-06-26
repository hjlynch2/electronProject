// Require the module 
var Forecast = require('forecast');
 
// Initialize
var forecast_key = ""; //insert key here
var forecast = new Forecast({
  service: 'forecast.io',
  key: forecast_key,
  units: 'f', // Only the first letter is parsed 
  cache: true,      // Cache API requests? 
  ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/ 
    minutes: 27,
    seconds: 45
    }
});

function loadWeather(){
	navigator.geolocation.getCurrentPosition(get_weather);
	function get_weather(position) {
		var lat = position.coords.latitude;
		var long = position.coords.longitude;
		var API_KEY = ""; //insert your api key here

		var geocodingAPI = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=" + API_KEY;

		//get city name
		$.getJSON(geocodingAPI, function (json) {
			if (json.status == "OK") {
			    var result = json.results[0];
			    var city = result.address_components[2].short_name;
			    var state = result.address_components[5].long_name;
				document.getElementById("weatherHeader").innerHTML = "Displaying weather for " + city + ", " + state;
		 	}
		});

		forecast.get([lat, long], function(err, weather) {
		  	if(err) return console.dir(err);
		  	document.getElementById("summary").innerHTML = "It is currently " + weather.currently.summary;
		  	document.getElementById("temp").innerHTML = weather.currently.temperature + " degrees Fahrenheit";
		  	document.getElementById("humidity").innerHTML = weather.currently.humidity + "% humidity";
		});
	}
}

loadWeather();

setInterval(function() {
	loadWeather();
}, 300000); //every 5 minutes it updates