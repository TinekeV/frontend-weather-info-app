import React, { createContext, useState } from 'react';
import kelvinToCelcius from "../helpers/kelvinToCelcius";
import kelvinToFahrenheit from "../helpers/kelvinToFahrenheit";

export const TempContext = createContext(null);

function TempContextProvider({ children }) {
    // hier komt straks de state waarin we de context-data plaatsen
    const [selectedMetric, toggleSelectedMetric] = useState('celcius')

    function toggleTemp() {
        if (selectedMetric === 'celcius') {
            toggleSelectedMetric('fahrenheit')
        } else {
            toggleSelectedMetric('celcius')
        }
    }

    return (
        <TempContext.Provider
            value={{
                toggleTemp: toggleTemp,
                kelvinToMetric: selectedMetric === 'celcius' ? kelvinToCelcius : kelvinToFahrenheit
            }}
        >
          { children }
        </TempContext.Provider>
    )
}

export default TempContextProvider;

