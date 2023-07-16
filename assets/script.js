var apiKey = 'd050d56a0954c851361f30476577b0f9';
var city = "Los Angeles"

//assign a variable to get the current date
var currentDate = moment().format('dddd, MMMM DD YYYY');

var listOfCity = [];
//searched items will be stored and saved in the local storage
$('.search').on("click", function (event) {
	event.preventDefault();
	city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
	if (city === "") {
		return;
	};
	listOfCity.push(city);

	localStorage.setItem('city', JSON.stringify(listOfCity));
	fiveForecastEl.empty();
	getHistory();
	getWeatherToday();
});

//list of buttons are created below the input form 
var listCityEl = $('.list-city');
function getHistory() {
	listCityEl.empty();

	for (let i = 0; i < listOfCity.length; i++) {

		var rowEl = $('<row>');
		var btnEl = $('<button>').text(`${listOfCity[i]}`)

		rowEl.addClass('row');
		btnEl.addClass('btn btn-outline-secondary listBtn');
		btnEl.attr('type', 'button');

		listCityEl.prepend(rowEl);
		rowEl.append(btnEl);
	} if (!city) {
		return;
	}
	//clicking on the list of buttons allows a search of that content to start
	$('.listBtn').on("click", function (event) {
		event.preventDefault();
		city = $(this).text();
		fiveForecastEl.empty();
		getWeatherToday();
	});
};

//select the div that hold the cards.
var TodayBody = $('.BodyToday')
//The weather is pulled into the cards
function getWeatherToday() {
	var getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

	$(TodayBody).empty();

	$.ajax({
		url: getUrlCurrent,
		method: 'GET',
	}).then(function (response) {
		$('.CityName').text(response.name);
		$('.TodayDate').text(currentDate);
		//Icons
		$('.img-icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
		// Temperature
		var pEl = $('<p>').text(`Temperature: ${response.main.temp} °F`);
		TodayBody.append(pEl);
		//Humidity
		var pElHumid = $('<p>').text(`Humidity: ${response.main.humidity} %`);
		TodayBody.append(pElHumid);
		//Wind Speed
		var pElWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
		TodayBody.append(pElWind);
		
		var cityLon = response.coord.lon;
		var cityLat = response.coord.lat;

		var getUrlUvi = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly,daily,minutely&appid=${apiKey}`;

		$.ajax({
			url: getUrlUvi,
			method: 'GET',
		}).then(function (response) {
			var pElUvi = $('<p>').text(`UV Index: `);
			var uviSpan = $('<span>').text(response.current.uvi);
			var uvi = response.current.uvi;
			pElUvi.append(uviSpan);
			TodayBody.append(pElUvi);
			
			if (uvi >= 0 && uvi <= 2) {
				uviSpan.attr('class', 'green');
			} else if (uvi > 2 && uvi <= 5) {
				uviSpan.attr("class", "yellow")
			} else if (uvi > 5 && uvi <= 7) {
				uviSpan.attr("class", "orange")
			} else if (uvi > 7 && uvi <= 10) {
				uviSpan.attr("class", "red")
			} else {
				uviSpan.attr("class", "purple")
			}
		});
	});
	getFiveDayForecast();
};

var fiveForecastEl = $('.fiveForecast');

function getFiveDayForecast() {
	var getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

	$.ajax({
		url: getUrlFiveDay,
		method: 'GET',
	}).then(function (response) {
		var fiveDayArray = response.list;
		var myWeather = [];
		//Object to select myweather properties
		$.each(fiveDayArray, function (index, value) {
			testObj = {
				currentDate: value.dt_txt.split(' ')[0],
				time: value.dt_txt.split(' ')[1],
				temp: value.main.temp,
				icon: value.weather[0].icon,
				humidity: value.main.humidity
			}

			if (value.dt_txt.split(' ')[1] === "12:00:00") {
				myWeather.push(testObj);
			}
		})
		//Place the cards on the screen
		for (let i = 0; i < myWeather.length; i++) {

			var divElCard = $('<div>');
			divElCard.attr('class', 'card text-white bg-primary mb-3 cardOne');
			divElCard.attr('style', 'max-width: 200px;');
			fiveForecastEl.append(divElCard);

			var divElHeader = $('<div>');
			divElHeader.attr('class', 'card-header')
			var m = moment(`${myWeather[i].currentDate}`).format('MM-DD-YYYY');
			divElHeader.text(m);
			divElCard.append(divElHeader)

			var divElBody = $('<div>');
			divElBody.attr('class', 'card-body');
			divElCard.append(divElBody);

			var divElIcon = $('<img>');
			divElIcon.attr('class', 'icons');
			divElIcon.attr('src', `https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			//Temp
			var pElTemp = $('<p>').text(`Temperature: ${myWeather[i].temp} °F`);
			divElBody.append(pElTemp);
			var pElWind = $('<p>').text(`Wind Speed: ${myWeather.wind} MPH`);
			divElBody.append(pElWind);
			var pElHumid = $('<p>').text(`Humidity: ${myWeather[i].humidity} %`);
			divElBody.append(pElHumid);
		}
	});
};

//local storage to preserve search history
function initLoad() {

	var cityListStorage = JSON.parse(localStorage.getItem('city'));

	if (cityListStorage !== null) {
		listOfCity = cityListStorage
	}
	getHistory();
	getWeatherToday();
};

initLoad();

