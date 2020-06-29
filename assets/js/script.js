var searchFormEl = document.querySelector("#city-search-submit");
var cityInputEl = document.querySelector("#city-input");
var previousSearchesEl = document.querySelector("#previous-searches");
var cityNameEl = document.querySelector("#city-name");
var todayTempEl = document.querySelector("#temp");
var todayHumidEl = document.querySelector("#humid");
var todayWindEl = document.querySelector("#wind");
var todayUVEl = document.querySelector("#uv");

// create array to store cities that have been searched
var previouslySearchedCities = [];

// once city is searched, perform this function
var formSubmitHandler = function (event) {
    event.preventDefault();
    
    // get the city that was searched
    var requestedCity = cityInputEl.value.trim();
    if (requestedCity) {
        // add city to previously searched cities
        previousCityListItem = document.createElement("li");
        previousCityListItem.className = "nav-item";
        previousCityListItem.innerHTML="<a class='nav-link border' href='#'><span data-feather='file'></span>" + requestedCity + "</a>";

        previousSearchesEl.appendChild(previousCityListItem); 

        // reveal hidden elements on page
        document.querySelector(".all-stats").classList.remove("hide");

        // add city to previously Searched Cities Array
        previouslySearchedCities.push(requestedCity);

        // save to localStorage
        localStorage.setItem("previousCities", JSON.stringify(previouslySearchedCities));
        
        // push through to get weather function
        getWeather(requestedCity);
        // clear search field
        cityInputEl.value = "";
    } else {
        // if no city or misspelled city is searched
        alert("Please enter valid city.");
    }
}

// fetch api call for today's weather
var getWeather = function (cityName) {
    // format api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=8fc9d3841b8ffcc0fce5fb6a16a654cc"

    // make request to url
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // send data to function that will display elements on page
                displayTodaysWeather(data, cityName);
                // get UV Index for today
                getUVIndex(data.coord.lon, data.coord.lat);
                // send data to function that will display weekly weather to page
                getWeeklyWeather(data.coord.lon, data.coord.lat);
            })
        } else {
            // if api unsuccessful
            alert("Error: " + response.statusText);
        }
    })
}

var displayTodaysWeather = function (info, city) {
    // clear out any old content
    document.querySelectorAll(".today").textContent="";

    // add city to top of page
    cityNameEl.textContent = city + " (" + moment().format("L") + ") ";

    // create weather icon & add to page
    var weatherIconEl = document.createElement("img")
    weatherIconEl.setAttribute("src", "http://openweathermap.org/img/w/" + info.weather[0].icon + ".png")
    cityNameEl.appendChild(weatherIconEl);

    // format temp 
    var temp = info.main.temp
    var fixedTemp = temp.toFixed(1);
    todayTempEl.innerHTML = fixedTemp + "&deg; F";

    // get humidity
    todayHumidEl.textContent = info.main.humidity + "%";
    
    // format wind speed
    var windSpeed = info.wind.speed;
    var fixedWindSpeed = windSpeed.toFixed(1);
    todayWindEl.textContent = fixedWindSpeed + " MPH";
}

var getUVIndex = function (lon, lat) {
    // new fetch call to get uv index for the day
    var apiUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=8fc9d3841b8ffcc0fce5fb6a16a654cc&lat=" + lat +"&lon=" + lon;
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // save uv value to variable and add to page
                var uv = data.value;
                todayUVEl.textContent = uv;
                // add background color based on UV index
                if (uv > 5 ) {
                    todayUVEl.className = "bg-danger p-2 rounded"
                } else if (uv < 3) {
                    todayUVEl.className = "bg-success p-2 rounded"
                } else {
                    todayUVEl.className = "bg-warning p-2 rounded"
                }
                return uv;
            })
        } else {
            // if api unsuccessful
            alert("There was a problem with your request.");
        }
    })
}

var getWeeklyWeather = function (lon, lat) {

    // new fetch call to get weekly weather data
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=8fc9d3841b8ffcc0fce5fb6a16a654cc"

    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // send data to function that will display info to page
                displayWeeklyWeather(data);
            })
        } else {
            // if api unsuccessful
            alert("There was a problem with your request.");
        }
    })
}

var displayWeeklyWeather = function (info) {
    // clear out any previous content
    document.querySelectorAll(".card-header").textContent="";
    document.querySelectorAll(".card-text span").textContent="";

    // loop through data to get temp and humidity for each date, start at 1 to skip today's date, end at 5 to only get 5 days
    for (var i=1; i < 6; i++) {
        // get date
        var date = moment().add(i, 'd').format('L');

        // add weather icon
        var icon = info.daily[i].weather[0].icon

        // get temp and humidity
        var temp = info.daily[i].temp.day;
        var fixedTemp = temp.toFixed(1);
        var humidity = info.daily[i].humidity;

        // display all info
        document.querySelector(".day-" + i).textContent = date;
        
        var weatherIconEl = document.createElement("img")
        weatherIconEl.setAttribute("src", "http://openweathermap.org/img/w/" + icon + ".png")
        document.querySelector(".day-" + i + "-icon").innerHTML="";
        document.querySelector(".day-" + i + "-icon").appendChild(weatherIconEl);

        document.querySelector(".temp-day-" + [i]).innerHTML = fixedTemp + "&deg; F";
        document.querySelector(".humid-day-" + [i]).textContent = humidity + "%";
    }
}

// if previously searched city is clicked, run this function
var previousCityLoad = function (event) {
    // remove hide class if it is still there
    document.querySelector(".all-stats").classList.remove("hide");
    // get city name
    var city = event.target.textContent;
    // send to first function
    getWeather(city);
}

// load previously searched cities to page
var loadLocalStorage = function () {
    // get the previously saved cities
    var previousCities = JSON.parse(localStorage.getItem('previousCities'));
    // if no previous cities, add nothing
    if (previousCities === null) {
        return;
        // if cities have previously been searched, loop through each one add li element to page
    } else {
        for (var i = 0; i < previousCities.length; i++) {
            // add city to previously searched cities
        previousCityListItem = document.createElement("li");
        previousCityListItem.className = "nav-item";
        previousCityListItem.innerHTML="<a class='nav-link border' href='#'><span data-feather='file'></span>" + previousCities[i] + "</a>";

        previousSearchesEl.appendChild(previousCityListItem); 
        }
    }
}

// to run on page load
loadLocalStorage();

searchFormEl.addEventListener("click", formSubmitHandler);
previousSearchesEl.addEventListener("click", previousCityLoad);