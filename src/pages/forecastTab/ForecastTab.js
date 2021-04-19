import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import './ForecastTab.css';
import kelvinToCelcius from "../../helpers/kelvinToCelcius";
import createDataString from "../../helpers/createDataString";
import { TempContext } from "../../context/TempProvider";


const apiKey = '66ffa59445e9cf9a2b7ac7fbacbc349e';


function ForecastTab({ coordinates }) {
  const [forecasts, setForecasts] = useState(null)
  const [error, setError] = useState(false)
  const [loading, toggleLoading] = useState(false)

  const { kelvinToMetric } = useContext(TempContext)

  useEffect(() => {
      // 1. we definiëren de functie
      async function fetchData() {
          setError(false)
          toggleLoading(true)

          try {
              const result = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,current,hourly&appid=${apiKey}&lang=nl`)
              setForecasts(result.data.daily.slice(1,6));
              // console.log(result.data)
          } catch (e) {
              console.error(e)
              setError(true)
          }
          toggleLoading(false)
      }
      // 2. we roepen de functie alleen aan als coordinated worden meegegeven
      if (coordinates) {
          fetchData();
      }

      // code wordt alleen afgevuurd als coordinates veranderd
     }, [coordinates]);



  return (
    <div className="tab-wrapper">

        {forecasts && forecasts.map((forecast) => {
            return (
                <article className="forecast-day" key={forecast.dt}>
                    <p className="day-description">
                        {createDataString(forecast.dt)}
                    </p>
                    <section className="forecast-weather">
                      <span>
                          {kelvinToMetric(forecast.temp.day)}
                      </span>
                      <span className="weather-description">
                        {forecast.weather[0].description}
                      </span>
                    </section>
                </article>
            )
        })}
        {error && (
            <span>Er is iets misgegaan bij het ophalen van de data</span>)}
        {!forecasts && !error && (
            <span className="no-forecast">Zoek eerst een locatie om het weer voor deze week te bekijken</span>)}
        {loading && (
            <span>Loading...</span>
        )}
    </div>
  );
};

export default ForecastTab;
