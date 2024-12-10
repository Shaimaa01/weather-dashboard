import { useState, useEffect } from "react";
import { getWeather } from "../services/weatherService.js";
import rainimge from "../imgs/rain.jpg";
import blackcloud from "../imgs/blackcloud.jpg";
import CurrentDateTime from "./CurrentDateTime.jsx";

const WeatherDashboard = () => {
  const [city, setCity] = useState("cairo");
  const [weatherData, setWeatherData] = useState();
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");

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

      console.log(data);

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
          const data = await getWeather("Cairo");
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

  console.log(weatherData);

  if (weatherData) {
    return (
      // container

      <div
        className="grid grid-cols-3  "
        style={{ backgroundImage: `url(${blackcloud})` }}
      >
        {/* img */}
        <div
          className="col-span-2 w-full h-screen relative  bg-cover bg-center py-10 px-20  text-[#E0E3E3]"
          style={{ backgroundImage: `url(${rainimge})` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-[#28413E] opacity-45"></div>

          {/* content */}
          <div className="relative z-20 flex flex-col justify-between h-full pb-10">
            <h2 className="font-bold">the.weather</h2>
            <div className="flex">
              <p className="text-9xl font-semibold">{weatherData.main.temp}°</p>
              <div className="font-medium self-end pl-4">
                <p className=" text-5xl ">{weatherData.name}</p>
                <CurrentDateTime/>
              </div>
            </div>
          </div>
        </div>

        {/* content */}
        <div className="bg-[#28413E] opacity-80 pl-10">
          <div className="">
            {/* Search part  */}
            <div className=" grid grid-cols-8 gap-8 h-20">
              <input
                type="text"
                placeholder="Another Location"
                value={city || ""}
                onChange={(e) => setCity(e.target.value)}
                className="col-span-6 h-10 place-self-end w-full focus:outline-none bg-transparent border-b border-[#9EA7A6] "
              />
              <button
                onClick={handleSearch}
                className="bg-[#718583] col-span-2"
              >
                <i className="fas fa-search text-[#090F0E] text-xl"></i>
              </button>
            </div>

            {/* cities */}
            <div className=" pt-10 pb-3  mr-10  border-b border-[#9EA7A6] ">
              {predefinedCities.map((predefinedCity) => (
                <button
                  key={predefinedCity}
                  onClick={() => handlePredefinedCityClick(predefinedCity)}
                  className=" block text-[#979fa1] pb-7 font-semibold text-md"
                >
                  {predefinedCity}
                </button>
              ))}
            </div>

            {/* Weather details */}
            <div className="pt-10 mr-10  border-b border-[#9EA7A6]  ">
              <h2 className="text-[#E0E3E3] font-medium text-lg pb-8">
                Weather Details
              </h2>
              <p className="text-[#979fa1] pb-7  text-md flex justify-between font-medium">
                Cloudy:
                <span className="text-[#E0E3E3]">
                  {weatherData.clouds.all}%
                </span>
              </p>
              <p className="text-[#979fa1] pb-7  text-md flex justify-between font-medium">
                Humidity:
                <span className="text-[#E0E3E3]">
                  {weatherData.main.humidity}%
                </span>
              </p>
              <p className="text-[#979fa1] pb-7  text-md flex justify-between font-medium">
                Wind:
                <span className="text-[#E0E3E3]">
                  {weatherData.wind.speed} m/s
                </span>
              </p>
              <p className="text-[#979fa1] pb-7  text-md flex justify-between font-medium">
                Description:
                <span className="text-[#E0E3E3]">
                  {weatherData.weather[0].description}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default WeatherDashboard;

// bg-gradient-to-r   from-[#090F0E] from-10%  via-[#28413E] via-30% to-[#E0E3E3] to-90%
// bg-[#4F6764]

{
  /* <h2 className="">{weatherData.name}</h2> */
}
{
  /* <p>Temperature: {weatherData.main.temp}°C</p> */
}
