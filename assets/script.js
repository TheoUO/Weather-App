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
});



