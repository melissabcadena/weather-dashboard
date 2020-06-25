var getWeather = function (cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=8fc9d3841b8ffcc0fce5fb6a16a654cc"

    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            console.log(response.json());
        } else {
            alert("Error: " + response.statusText);
        }
    })
}

getWeather("dallas");