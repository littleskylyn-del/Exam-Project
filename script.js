const searchBtn = document.getElementById("searchBtn");

const cityInput = document.getElementById("cityInput");

// Convert weather code into description and icon

function getWeatherDescription(code) {
  if (code === 0) {
    return {
      text: "Clear Sky",
      icon: "☀",
    };
  }

  if ([1, 2, 3].includes(code)) {
    return {
      text: "Cloudy",
      icon: "⛅",
    };
  }

  if ([45, 48].includes(code)) {
    return {
      text: "Fog",
      icon: "🌫",
    };
  }

  if ([51, 53, 55].includes(code)) {
    return {
      text: "Drizzle",
      icon: "🌦",
    };
  }

  if ([61, 63, 65].includes(code)) {
    return {
      text: "Rain",
      icon: "🌧",
    };
  }

  if ([71, 73, 75].includes(code)) {
    return {
      text: "Snow",
      icon: "❄",
    };
  }

  if (code === 95) {
    return {
      text: "Thunderstorm",
      icon: "⛈",
    };
  }

  return {
    text: "Unknown",
    icon: "🌍",
  };
}

// Get city coordinates

async function getCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

  const response = await fetch(url);

  const data = await response.json();

  if (!data.results) {
    throw new Error("City not found");
  }

  return data.results[0];
}

// Get weather information

async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;

  const response = await fetch(url);

  return await response.json();
}

// Display current weather

function displayCurrentWeather(weather, location) {
  let info = getWeatherDescription(weather.current.weather_code);

  document.getElementById("city").innerHTML =
    `${location.name}, ${location.country}`;

  document.getElementById("temperature").innerHTML =
    `${weather.current.temperature_2m}°C`;

  document.getElementById("description").innerHTML = info.text;

  document.getElementById("icon").innerHTML = info.icon;

  document.getElementById("humidity").innerHTML =
    weather.current.relative_humidity_2m + "%";

  document.getElementById("wind").innerHTML =
    weather.current.wind_speed_10m + " km/h";
}

// Display forecast

function displayForecast(daily) {
  let box = document.getElementById("forecastContainer");

  box.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    let weather = getWeatherDescription(daily.weather_code[i]);

    box.innerHTML += `

<div class="forecast-card">

<h4>

${new Date(daily.time[i]).toLocaleDateString("en", { weekday: "short" })}

</h4>


<p>
${weather.icon}
</p>


<p>
High:
${daily.temperature_2m_max[i]}°C
</p>


<p>
Low:
${daily.temperature_2m_min[i]}°C
</p>


</div>

`;
  }
}

// Search button function

async function handleSearch() {
  let city = cityInput.value;

  let error = document.getElementById("error");

  let loading = document.getElementById("loading");

  try {
    loading.innerHTML = "Loading...";

    error.innerHTML = "";

    let location = await getCoordinates(city);

    let weather = await getWeather(location.latitude, location.longitude);

    displayCurrentWeather(weather, location);

    displayForecast(weather.daily);

    loading.innerHTML = "";
  } catch (error) {
    loading.innerHTML = "";

    document.getElementById("error").innerHTML = error.message;
  }
}

searchBtn.addEventListener("click", handleSearch);
