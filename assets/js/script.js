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

// fetch api call for today's weather
var getWeather = function (cityName) {
    // format api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=8fc9d3841b8ffcc0fce5fb6a16a654cc"

    // make request to url
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayTodaysWeather(data, cityName);
                // get UV Index for today
                getUVIndex(data.coord.lon, data.coord.lat);

                getWeeklyWeather(data.coord.lon, data.coord.lat);
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
        previousCityListItem = document.createElement("li");
        previousCityListItem.className = "nav-item";
        previousCityListItem.innerHTML="<a class='nav-link border' href='#'><span data-feather='file'></span>" + requestedCity + "</a>";

        previousSearchesEl.appendChild(previousCityListItem); 

        document.querySelector(".all-stats").classList.remove("hide");

        // add city to previously Searched Cities Array
        previouslySearchedCities.push(requestedCity);

        // save to localStorage
        localStorage.setItem("previousCities", JSON.stringify(previouslySearchedCities));
        
        // push through to get weather function
        getWeather(requestedCity);
        // push through to get five day forecast function
        cityInputEl.value = "";
    } else {
        alert("Please enter valid city.");
    }
}

var previousCityLoad = function (event) {

    // remove hide class if it is still there
    document.querySelector(".all-stats").classList.remove("hide");

    
    var city = event.target.textContent;
    getWeather(city);
}

var displayTodaysWeather = function (info, city) {

    // clear old content
    document.querySelectorAll(".today").textContent="";

    // add city to top of page
    cityNameEl.textContent = city + " (" + moment().format("L") + ") ";

    // create weather icon
    var weatherIconEl = document.createElement("img")
    weatherIconEl.setAttribute("src", "http://openweathermap.org/img/w/" + info.weather[0].icon + ".png")
    cityNameEl.appendChild(weatherIconEl);

    // input info from data into webpage
    // format temp 
    var temp = info.main.temp
    var fixedTemp = temp.toFixed(1);
    todayTempEl.innerHTML = fixedTemp + "&deg; F";

    todayHumidEl.textContent = info.main.humidity + "%";
    
    // format wind speed
    var windSpeed = info.wind.speed;
    var fixedWindSpeed = windSpeed.toFixed(1);
    todayWindEl.textContent = fixedWindSpeed + " MPH";
}

var getUVIndex = function (lon, lat) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=8fc9d3841b8ffcc0fce5fb6a16a654cc&lat=" + lat +"&lon=" + lon;
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
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
            alert("There was a problem with your request.");
        }
    })
}

var getWeeklyWeather = function (lon, lat) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=8fc9d3841b8ffcc0fce5fb6a16a654cc"

    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayWeeklyWeather(data);
            })
        } else {
            alert("There was a problem with your request.");
        }
    })
}

var displayWeeklyWeather = function (info) {
    // clear out any previous content
    document.querySelectorAll(".card-header").textContent="";
    document.querySelectorAll(".card-text span").textContent="";

    // loop through data to get temp and humidity for each date
    for (var i=1; i < 6; i++) {
        // get date
        var date = moment().add(i, 'd').format('L');

        // add new icon
        var icon = info.daily[i].weather[0].icon

        // get temp and humidity
        var temp = info.daily[i].temp.day;
        var fixedTemp = temp.toFixed(1);
        var humidity = info.daily[i].humidity;

        // display info
        document.querySelector(".day-" + i).textContent = date;
        
        var weatherIconEl = document.createElement("img")
        weatherIconEl.setAttribute("src", "http://openweathermap.org/img/w/" + icon + ".png")
        document.querySelector(".day-" + i + "-icon").innerHTML="";
        document.querySelector(".day-" + i + "-icon").appendChild(weatherIconEl);

        document.querySelector(".temp-day-" + [i]).innerHTML = fixedTemp + "&deg; F";
        document.querySelector(".humid-day-" + [i]).textContent = humidity + "%";
    }
}

var loadLocalStorage = function () {
    var previousCities = JSON.parse(localStorage.getItem('previousCities'));
    console.log(previousCities);
    if (previousCities === null) {
        return;
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

loadLocalStorage();

searchFormEl.addEventListener("click", formSubmitHandler);
previousSearchesEl.addEventListener("click", previousCityLoad);