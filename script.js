// get API
function getCoordAPI(cityName) {
  let myCoordAPI =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=833bc0f4fbfc23c222c8f06e4c764de6";
  fetch(myCoordAPI)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      lat = data.coord.lat;
      lon = data.coord.lon;

      let urlAPI =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=833bc0f4fbfc23c222c8f06e4c764de6";
      fetch(urlAPI)
        .then(function (response) {
          return response.json(); // Convert data to json
        })
        .then(function (data) {
          drawWeather(data); //link function to get current weather
          foreCast(data); // foreCast(data); //link function to get future weather
        });
    });
}

// onclick function to retrive current city result
var searchBtn = document.getElementById("search-button");
var searchInput = document.getElementById("city");

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  var cityName = searchInput.value.trim();
  if (cityName) {
    getCoordAPI(cityName);
    searchInput.value = "";
  } else {
    alert("Invaild Input");
  }
});

// Display the current weather after grabing the city name form the input text box.
function drawWeather(response) {
  var cur = response.current;
  console.log(response);
  // //set up new date format
  // var date=new Date(daily[i].dt*1000).toLocaleDateString();
  // convert to celcius
  var celcius = Math.round(parseFloat(cur.temp) - 273.15);
  // convert to MPH
  var ws = cur.wind_speed;
  var windsmph = (ws * 2.237).toFixed(1);
  // display weather icon image
  var weatherIcon = cur.weather[0].icon + ".png";
  iconImg = "https://openweathermap.org/img/w/" + weatherIcon;
  console.log(iconImg);
  document.getElementById("icon").src = iconImg;

  document.getElementById("temp").innerHTML = "Temperature: " + celcius + "°C";
  document.getElementById("humidity").innerHTML =
    "Humidity: " + cur.humidity + "%";
  document.getElementById("wind-speed").innerHTML =
    "Wind-speed: " + windsmph + "MPH";
  document.getElementById("uv-index").innerHTML = cur.uvi;
}

// Display the following 5 day forecast weather

function foreCast(resp) {
  var date = new Date()
  var daily = resp.daily;
  daily.map((itm, i) => {
    if (i < 5) {
      // get forecast dates
      var foreCastDates = daily[i].dt;
      document.getElementById("fDate" + i).innerHTML = foreCastDates;
      console.log(foreCastDates);

      // get forecast icon images
      var foreCastIcon = daily[i].weather[0].icon + ".png";
      foreCastIconImg =
        "https://openweathermap.org/img/w/" + foreCastIcon;
      document.getElementById("fImg" + i).src = foreCastIconImg;
      console.log(foreCastIconImg);

      // get forecast temperature
      var foreCastTemp = daily[i].temp;
      document.getElementById("fTemp" + i).innerHTML = foreCastTemp;
      console.log(foreCastTemp);

      // get forecast humidity
      var foreCastHumidity = daily[i].humidity;
      document.getElementById("fHumidity"+ i).innerHTML = foreCastHumidity;
      console.log(foreCastHumidity);
    }
  });
}
