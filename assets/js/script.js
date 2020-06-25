var searchFormEl = document.querySelector("#city-search-submit");
var cityInputEl = document.querySelector("#city-input");
var previousSearchesEl = document.querySelector("#previous-searches");

var getWeather = function (cityName) {
    // format api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=8fc9d3841b8ffcc0fce5fb6a16a654cc"

    // make request to url
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
            })
        } else {
            alert("Error: " + response.statusText);
        }
    })
}

var formSubmitHandler = function (event) {
    event.preventDefault();
    
    var requestedCity = cityInputEl.value.trim();
    if (requestedCity) {
        // add city to previously searched cities
        var previousCityListItem = document.createElement("li");
        previousCityListItem.className = "nav-item";
        previousCityListItem.innerHTML="<a class='nav-link' href='#'><span data-feather='file'></span>" + requestedCity + "</a>";

        previousSearchesEl.appendChild(previousCityListItem);
        
        // push through to get weather function
        getWeather(requestedCity);
        cityInputEl.value = "";
    } else {
        alert("Please enter valid city.");
    }
}

searchFormEl.addEventListener("click", formSubmitHandler);