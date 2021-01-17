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
          foreCast(data); //link function to get future weather
        });
    });
}

// onclick function to retrive current city result
var searchBtn = document.getElementById("search-button");
var userInput = document.getElementById("city");

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  var cityName = userInput.value.trim();
  if (cityName) {
    getCoordAPI(cityName);
    userInput.value = "";
    //add to storage
    cityList = JSON.parse(localStorage.getItem("city_list"));
    if (!cityList || cityList.length == 0) {
      cityList = [cityName]
      localStorage.setItem("city_list",JSON.stringify(cityList));
    }
    else {
      if (cityList.indexOf(cityName) == -1) {
          cityList.push(cityName)
      }
      localStorage.setItem("city_list",JSON.stringify(cityList));
      //function
    }
  } else {
    alert("Invaild Input");
  }
  console.log(cityList.length);
  pastsearch(cityList);
});

// Display the current weather after grabing the city name form the input text box.
function drawWeather(response) {
  var cur = response.current;
  // convert to celcius
  var celcius = Math.round(parseFloat(cur.temp) - 273.15);
  document.getElementById("temp").innerHTML = "Temperature: " + celcius + "°C";
  // convert to MPH
  var ws = cur.wind_speed;
  var windsmph = (ws * 2.237).toFixed(1);
  document.getElementById("wind-speed").innerHTML =
    "Wind-speed: " + windsmph + "MPH";
  // display weather icon image
  var weatherIcon = cur.weather[0].icon + ".png";
  iconImg = "https://openweathermap.org/img/w/" + weatherIcon;
  document.getElementById("icon").src = iconImg;
  // display weather humidity
  document.getElementById("humidity").innerHTML =
    "Humidity: " + cur.humidity + "%";
   // display weather uv-index
  document.getElementById("uv-index").innerHTML = cur.uvi;
}

// Display the following 5 day forecast weather
function foreCast(resp) {
  var daily = resp.daily;
  daily.map((itm, i) => {
    if (i < 5) {
      // get forecast dates
      var dateFormat = new Date (daily[i].dt * 1000).toLocaleDateString("en-US");
      document.getElementById("fDate" + i).innerHTML = dateFormat;

      // get forecast icon images
      var foreCastIcon = daily[i].weather[0].icon + ".png";
      foreCastIconImg =
        "https://openweathermap.org/img/w/" + foreCastIcon;
      document.getElementById("fImg" + i).src = foreCastIconImg;

      // get forecast temperature
      var foreCastTemp = Math.round(parseFloat(daily[i].temp.max) - 273.15);
      document.getElementById("fTemp" + i).innerHTML = foreCastTemp + "°C";

      // get forecast humidity
      var foreCastHumidity = daily[i].humidity;
      document.getElementById("fHumidity"+ i).innerHTML = foreCastHumidity + "%";

    }
  });
}

// clear localStorage
var clearBtn = document.getElementById("clear-button");
clearBtn.addEventListener("click", function (event) {
  event.preventDefault();
  localStorage.setItem("city_list", JSON.stringify([]));
  cityList = "";
  })

// past search
 function pastsearch(cityList){
  search_history_list.innerHTML="";
  for(var i = 0; i < cityList.length; i++){
    console.log(cityList[i]);
    var buttonEl = document.createElement("button");
    buttonEl.textContent = cityList[i].city;
    search_history_list.appendChild(buttonEl);
  }
 }

