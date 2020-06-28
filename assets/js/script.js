var searchFormEl = document.querySelector("#city-search-submit");
var cityInputEl = document.querySelector("#city-input");
var previousSearchesEl = document.querySelector("#previous-searches");
var cityNameEl = document.querySelector("#city-name");
var todayTempEl = document.querySelector("#temp");
var todayHumidEl = document.querySelector("#humid");
var todayWindEl = document.querySelector("#wind");
var todayUVEl = document.querySelector("#uv");


// fetch api call for today's weather
var getTodaysWeather = function (cityName) {
    // format api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=8fc9d3841b8ffcc0fce5fb6a16a654cc"

    // make request to url
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayTodaysWeather(data, cityName);
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

        document.querySelector(".all-stats").classList.remove("hide");
        
        // push through to get weather function
        getTodaysWeather(requestedCity);
        // push through to get five day forecast function
        getWeeklyWeather(requestedCity);
        cityInputEl.value = "";
    } else {
        alert("Please enter valid city.");
    }
}

var displayTodaysWeather = function (info, city) {

    // clear old content
    document.querySelectorAll(".today").textContent="";

    // add city to top of page
    cityNameEl.textContent = city + " (" + moment().format("L") + ") ";

    // create weather icon
    var weatherIconEl = document.createElement("i")
    weatherIconEl.className = "owi owi-" + info.weather[0].icon
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

    // get UV Index for today
    var uv = getUVIndex(info.coord.lon, info.coord.lat);
    console.log(uv);
    todayUVEl.textContent = uv;
    
    // add background color based on UV index
    if (uv > 5) {
        todayUVEl.className = "bg-danger"
    } else if (uv < 3) {
        todayUVEl.className = "bg-success"
    } else {
        todayUVEl.className = "bg-warning"
    }
    
}

var getUVIndex = function (lon, lat) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=8fc9d3841b8ffcc0fce5fb6a16a654cc&lat=" + lat +"&lon=" + lon;
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var uv = data.value;
                console.log(uv);
                return uv;
            })
        } else {
            alert("There was a problem with your request.");
        }
    })
}

var getWeeklyWeather = function (cityName) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=8fc9d3841b8ffcc0fce5fb6a16a654cc"

    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayWeeklyWeather(cityName, data);
            })
        } else {
            alert("There was a problem with your request.");
        }
    })
}

var displayWeeklyWeather = function () {

}

searchFormEl.addEventListener("click", formSubmitHandler);