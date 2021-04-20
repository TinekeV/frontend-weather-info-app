import React, { useState, useEffect }  from 'react';
import axios from "axios";
import './TodayTab.css';
import WeatherDetail from "../../components/weatherDetail/WeatherDetail";
import createTimeString from "../../helpers/createTimeString";

function TodayTab({ coordinates }) {
	const [forecasts, setForecasts] = useState(null)
	const [error, setError] = useState(false)
	const [loading, toggleLoading] = useState(false)

	useEffect(() => {
		// 1. we definiëren de functie
		async function fetchData() {
			setError(false)
			toggleLoading(true)

			try {
				const result = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,current,daily&appid=${process.env.REACT_APP_API_KEY}`)
				setForecasts([
					result.data.hourly[3],
					result.data.hourly[5],
					result.data.hourly[7],
				]);
				console.log(result.data)
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


	return(
		<div className="tab-wrapper">
			{forecasts &&
			<>
				<div className="chart">
					{forecasts.map((forecast) => {
						return <WeatherDetail
							key={forecast.dt}
							temp={forecast.temp}
							type={forecast.weather[0].main}
							description={forecast.weather[0].description}
						/>
					})}
				</div>
				<div className="legend">
					{forecasts.map((forecast) => {
						return <span>{createTimeString(forecast.dt)}</span>
					})}
				</div>
			</>
			}
			{error && (
				<span>Er is iets misgegaan bij het ophalen van de data</span>)}
			{loading && (
				<span>Loading...</span>)}
		</div>
  );
}

export default TodayTab;
