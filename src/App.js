import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';

import SearchBar from './components/searchBar/SearchBar';
import TabBarMenu from './components/tabBarMenu/TabBarMenu';
import MetricSlider from './components/metricSlider/MetricSlider';
import ForecastTab from "./pages/forecastTab/ForecastTab";
import TodayTab from "./pages/todayTab/TodayTab";
import { TempContext } from "./context/TempProvider";

// const apiKey = '66ffa59445e9cf9a2b7ac7fbacbc349e';

function App() {
  const [ weatherData, setWeatherData ] = useState(null);
  const [ location, setLocation ] = useState(null);
  const [ error, setError] = useState(false)

  const { kelvinToMetric } = useContext(TempContext)

  useEffect(() => {
        // 1. we definiëren de functie
        async function fetchData() {
          setError(false)

          try {

            const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location},nl&appid=${process.env.REACT_APP_API_KEY}&lang=nl`)
            setWeatherData(result.data)
            //console.log(result.data)
          } catch (e) {
            console.error(e)
            setError(true)
          }
        };

        // 2. we roepen de functie aan (als location is veranderd, maar niet null is)
        if (location) {
            fetchData();
        }

        // code wordt alleen afgevuurd als location veranderd
      }, [location]);


  return (
    <>
      <div className="weather-container">

        {/*HEADER -------------------- */}
        <div className="weather-header">
          <SearchBar setLocationHandler={setLocation}/>

            {error && (
                <span className="wrong-location-error">Oeps! Deze locatie bestaat niet</span>)}

          <span className="location-details">
            {weatherData &&
            <>
              <h2>{weatherData.weather[0].description}</h2>
              <h3>{weatherData.name}</h3>
              <h1>{kelvinToMetric(weatherData.main.temp)}</h1>
            </>

            }
          </span>
        </div>

        {/*CONTENT ------------------ */}
        <Router>
            <div className="weather-content">
                  <TabBarMenu/>

                  <div className="tab-wrapper">
                      <Switch>
                          <Route exact path="/">
                              <TodayTab coordinates={weatherData && weatherData.coord} />
                          </Route>
                          <Route path="/komende-week">
                              <ForecastTab coordinates={weatherData && weatherData.coord}/>
                          </Route>
                      </Switch>
                  </div>
            </div>
        </Router>

        <MetricSlider/>
      </div>
    </>
  );
}

export default App;
