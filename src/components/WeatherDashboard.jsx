import { useState, useEffect } from "react";
import { getWeather } from "../services/weatherService";
import rainimge from "../imgs/rain.jpg";
import blackcloud from "../imgs/blackcloud.jpg";

const WeatherDashboard = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");

  //   if (!weatherData) {
  //     return <p>Loading...</p>; // Or show a placeholder message
  //   }

  // List of predefined cities
  const predefinedCities = [
    "Brazil",
    "Poland",
    "Japan",
    "Antarctica",
    "Australia",
  ];

  //   to handle predfined citys
  const handlePredefinedCityClick = async (selectedCity) => {
    setCity(selectedCity);
    try {
      setError("");
      const data = await getWeather(selectedCity);
      setWeatherData(data);
      saveToLocalStorage(data);
      // Clear the input field
      setCity("");

      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("City not found or API error");
    }
  };

  // Fetch weather data on load if available in localStorage
  useEffect(() => {
    const storedWeather = getFromLocalStorage();
    if (storedWeather) {
      setCity(storedWeather.city);
      setWeatherData(storedWeather.data);
    }
  }, []);

  // Set the interval to fetch the weather data every 30 minutes
  useEffect(() => {
    if (!city) return; // Don't set the interval if the city is not set

    const interval = setInterval(async () => {
      try {
        const data = await getWeather(city); // Fetch updated weather data
        console.log("Updated weather data:", data);
        setWeatherData(data); // Update the state with new data
        saveToLocalStorage(city, data); // Save updated data to localStorage
      } catch (error) {
        console.error("Failed to update weather data:", error);
      }
    }, 30 * 60 * 1000); // 30 minutes interval

    // Clear the interval when the component is unmounted or city changes
    return () => clearInterval(interval);
  }, [city]); // Only set the interval when city changes

  // Handle search and fetch new weather data
  const handleSearch = async () => {
    try {
      setError("");
      const data = await getWeather(city);
      setWeatherData(data);

      // Save fetched data to localStorage
      saveToLocalStorage(data);

      // Clear the input field
      setCity("");

      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("City not found or API error");
    }
  };

  // Save weather data to localStorage with timestamp
  const saveToLocalStorage = (data) => {
    const weatherData = {
      data,
    };
    localStorage.setItem("weatherData", JSON.stringify(weatherData));
  };

  // Retrieve weather data from localStorage if valid
  const getFromLocalStorage = () => {
    const weatherData = localStorage.getItem("weatherData");
    if (weatherData) {
      const parsedData = JSON.parse(weatherData);
      return parsedData;
    }
    return null;
  };

  // defualt city when it is first time to open the web
  useEffect(() => {
    if (!localStorage.getItem("weatherData")) {
      const fetchData = async () => {
        try {
          setError("");
          const data = await getWeather("Cairo"); // Use "Cairo" directly here
          setWeatherData(data);

          // Save fetched data to localStorage
          saveToLocalStorage(data);

          // eslint-disable-next-line no-unused-vars
        } catch (error) {
          setError("City not found or API error");
        }
      };

      fetchData(); // Call the fetch function
    } else {
      console.log("not empty");
    }
  }, []);

  return (
    // container
    <div
      className="grid grid-cols-3  "
      style={{ backgroundImage: `url(${blackcloud})` }}
    >
      {/* img */}
      <div
        className="col-span-2 w-full h-screen relative  bg-cover bg-center"
        style={{ backgroundImage: `url(${rainimge})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#28413E] opacity-50"></div>
      </div>

      {/* content */}
      <div className="bg-[#28413E] opacity-85">
        <div className="">
          <h1 className="">Weather Dashboard</h1>
          <div className="">
            <input
              type="text"
              placeholder="Another Location"
              value={city || ""}
              onChange={(e) => setCity(e.target.value)}
              className=""
            />
            <button onClick={handleSearch} className="">
              Search
            </button>
          </div>
          <div className="">
            {predefinedCities.map((predefinedCity) => (
              <button
                key={predefinedCity}
                onClick={() => handlePredefinedCityClick(predefinedCity)}
                className=""
              >
                {predefinedCity}
              </button>
            ))}
          </div>
          <div className="">
            <h2 className="">{weatherData.name}</h2>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
            <p>Description: {weatherData.weather[0].description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;

// bg-gradient-to-r   from-[#090F0E] from-10%  via-[#28413E] via-30% to-[#E0E3E3] to-90%
