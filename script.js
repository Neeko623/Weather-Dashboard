// get API and fetch data
function getCoordAPI(cityName) {
  let myCoordAPI =
    "https://api.openweathermap.org/data/2.5/weather?q=" + // openweather
    cityName +
    "&appid=833bc0f4fbfc23c222c8f06e4c764de6"; // my key
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
      cityList = [cityName];
      localStorage.setItem("city_list", JSON.stringify(cityList));
    } else {
      if (cityList.indexOf(cityName) == -1) {
        cityList.push(cityName);
      }
      localStorage.setItem("city_list", JSON.stringify(cityList));
      //function
    }
  } else {
    alert("Invaild Input");
  }
  pastsearch(cityList); // display past search cities
  assignCity(cityList); // retreive back to current weather of the city location
});

// Display the current weather after grabing the city name form the input text box.
function drawWeather(response) {
  var cur = response.current;
  console.log(response);
  //current date
  var currentdate = new Date(cur.dt * 1000).toLocaleDateString("en-US");
  document.getElementById("currentdate").innerHTML = currentdate;
  //city name
  document.getElementById("cityname").innerHTML = response.timezone;
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
      var dateFormat = new Date(daily[i].dt * 1000).toLocaleDateString("en-US");
      document.getElementById("fDate" + i).innerHTML = dateFormat;
      // get forecast icon images
      var foreCastIcon = daily[i].weather[0].icon + ".png";
      foreCastIconImg = "https://openweathermap.org/img/w/" + foreCastIcon;
      document.getElementById("fImg" + i).src = foreCastIconImg;
      // get forecast temperature
      var foreCastTemp = Math.round(parseFloat(daily[i].temp.max) - 273.15);
      document.getElementById("fTemp" + i).innerHTML = foreCastTemp + "°C";
      // get forecast humidity
      var foreCastHumidity = daily[i].humidity;
      document.getElementById("fHumidity" + i).innerHTML =
        foreCastHumidity + "%";
    }
  });
}

// clear localStorage
var clearBtn = document.getElementById("clear-button");
clearBtn.addEventListener("click", function (event) {
  event.preventDefault();
  localStorage.setItem("city_list", JSON.stringify([]));
  cityList = "";
  deleteHistoryBtn();
});

// detele all history search
var num = 0;

function deleteHistoryBtn(){
  for (i = 0; i < num; i++) {
    var btn = document.getElementById("searchCity" + i);
    btn.remove();
  }
  num = 0;
}

// past search display below search input
function pastsearch(cityList) {
  search_history_list.innerHTML = "";
  for (var i = 0; i < cityList.length; i++) {
    var buttonEl = document.createElement("button");
    buttonEl.id = "searchCity" + i;
    buttonEl.textContent = cityList[i];
    search_history_list.appendChild(buttonEl);
  }
  num = cityList.length;
  // console.log(num);
  console.log(buttonEl.id);
}

// display all the search and get the current weather
function assignCity(cityList) {
  var btnArr = [];

  for (i = 0; i < cityList.length; i++) {
    btnArr[i] = document.getElementById("searchCity" + i);
  }

  btnArr.map((itm) => {
    itm.addEventListener("click", function () {
      getCoordAPI(itm.innerHTML);
    });
  });
}

