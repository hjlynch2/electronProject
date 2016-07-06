// Require forecast module
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
				document.getElementById("weatherHeader").innerHTML = city + ", " + state;
		 	}
		});

		forecast.get([lat, long], function(err, weather) {
		  	if(err) return console.dir(err);

		  	//current div
		  	document.getElementById("c_summary").innerHTML = "It is currently " + weather.currently.summary;
		  	document.getElementById("c_temp").innerHTML = weather.currently.temperature + " degrees Fahrenheit";
		  	document.getElementById("c_humidity").innerHTML = Math.floor(weather.currently.humidity * 100) + "% humidity";

		  	//hourly div
		  	for(var hour_it = 0; hour_it < 12; hour_it++) { //display 12 hours
		  		console.log(hour_it);
		  		var hourInsert = "<li>";
		  		hourData = weather.hourly.data[hour_it];

		  		var hour = getHour(hourData.time);
		  		hourInsert += "<div class=\"time\">" + hour +"</div>";

		  		var actualTemp = hourData.temperature;
		  		hourInsert += "<div class=\"smallField\">" + actualTemp +" degrees</div>";

		  		var feelsLike = hourData.apparentTemperature;
		  		hourInsert += "<div class=\"smallField\">Feels like " + feelsLike + " degrees</div>";

		  		var rain = hourData.precipProbability;
		  		hourInsert += "<div class=\"smallField\">" + ((rain * 100) | 0) + "% chance of rain</div>";

		  		hourInsert += "</li>";
		  		$(hourInsert).appendTo("#h_list");
		  	}

		  	//daily div
		  	
		  	console.log(weather);
		});
	}
}

loadWeather();

window.onload = function() {
	var cDiv = document.getElementById('currently');
	var hDiv = document.getElementById('hourly');
	var dDiv = document.getElementById('daily');

	$("#c").addClass("active");

	document.getElementById('c').onclick = function() {
		$(".active").removeClass("active");
	    if (cDiv.style.display !== 'none') {
	        cDiv.style.display = 'none';
	    }
	    else {
	    	$("#c").addClass("active");
	        cDiv.style.display = 'block';
	        hDiv.style.display = 'none';
	        dDiv.style.display = 'none';
	    }
	};

	document.getElementById('h').onclick = function() {
		$(".active").removeClass("active");
	    if (hDiv.style.display !== 'none') {
	        hDiv.style.display = 'none';
	    }
	    else {
	    	$("#h").addClass("active");
	        hDiv.style.display = 'block';
	        cDiv.style.display = 'none';
	        dDiv.style.display = 'none';
	    }
	};

	document.getElementById('d').onclick = function() {
		$(".active").removeClass("active");
	    if (dDiv.style.display !== 'none') {
	        dDiv.style.display = 'none';
	    }
	    else {
	    	$("#d").addClass("active");
	        dDiv.style.display = 'block';
	        hDiv.style.display = 'none';
	        cDiv.style.display = 'none';
	    }
	};
}

setInterval(function() {
	loadWeather();
}, 300000); //every 5 minutes it updates

function getHour(timestamp) {
	var date = new Date(timestamp*1000);
	var hours = date.getHours();
	var ampm  = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12;
	var strHour = hours + ':00 ' +  ampm;
	return strHour;
}