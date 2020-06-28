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
                // get UV Index for today
                var uv = getUVIndex(data.coord.lon, data.coord.lat);
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
        var previousCityListItem = document.createElement("li");
        previousCityListItem.className = "nav-item";
        previousCityListItem.innerHTML="<a class='nav-link' href='#'><span data-feather='file'></span>" + requestedCity + "</a>";

        previousSearchesEl.appendChild(previousCityListItem);

        document.querySelector(".all-stats").classList.remove("hide");
        
        // push through to get weather function
        getTodaysWeather(requestedCity);
        // push through to get five day forecast function
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

    
    
    // add background color based on UV index
    if (uv > 5 ) {
        todayUVEl.className = "bg-danger p-2 rounded"
    } else if (uv < 3) {
        todayUVEl.className = "bg-success p-2 rounded"
    } else {
        todayUVEl.className = "bg-warning p-2 rounded"
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
                todayUVEl.textContent = uv;
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

        // add icon
        var icon = info.daily[i].weather[0].icon
        console.log(icon);


        // get temp and humidity
        var temp = info.daily[i].temp.day;
        var fixedTemp = temp.toFixed(1);
        var humidity = info.daily[i].humidity;

        // display info
        document.querySelector(".day-" + i).textContent = date;
        
        var weatherIconEl = document.createElement("img")
        weatherIconEl.setAttribute("src", "http://openweathermap.org/img/w/" + icon + ".png")
        document.querySelector(".day-" + i + "-icon").appendChild(weatherIconEl);

        document.querySelector(".temp-day-" + [i]).innerHTML = fixedTemp + "&deg; F";
        document.querySelector(".humid-day-" + [i]).textContent = humidity + "%";
    }
}



searchFormEl.addEventListener("click", formSubmitHandler);