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
	});
};
