import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import background1 from './assets/background.png';
import background2 from './assets/rainy background.png';
import cloud from './assets/cloud.png';
import rain from './assets/rain.png';
import sun from './assets/sun.png';
import thun from './assets/thunder.png';

const WeatherAPI = axios.create({
  baseURL: 'weatherbit-v1-mashape.p.rapidapi.com',
  timeout: 1000,
  headers: {
    'content-type': 'application/octet-stream',
    'x-rapidapi-host': 'weatherbit-v1-mashape.p.rapidapi.com',
    'x-rapidapi-key': 'dae388b832msh002dec8dceeab1fp15d898jsn90374ed4d6bc',
    useQueryString: true,
  },
});

function getDayText(day) {
  if (day === 0) return 'Sun';
  if (day === 1) return 'Mon';
  if (day === 2) return 'Tues';
  if (day === 3) return 'Wed';
  if (day === 4) return 'Thurs';
  if (day === 5) return 'Fri';
  if (day === 6) return 'Sat';
  return '';
}

function getImage(feels) {
  var str = feels.toLowerCase();
  if (str.includes('sun') || str.includes('clear')) return sun;
  if (str.includes('cloud')) return cloud;
  if (str.includes('rain')) return rain;
  if (str.includes('thunder')) return thun;
  if (str.includes('wind')) return wind;
  else return null;
}

function parseData1(data1) {
  const renderData = [];
  var divide = data1.length / 5;
  var start = divide / 2;

  for (let i = 0; i < data1.length; i += divide) {
    const mid = i + divide / 2;

    const { timestamp_local, weather } = data1[mid];
    const date = new Date(timestamp_local);
    const dayOfWeek = getDayText(date.getDay());

    let hi = data1[i].temp;
    let low = data1[i].temp;
    for (let j = i + 1; j < i + divide; j++) {
      const { temp: jtemp } = data1[j];
      hi = Math.max(jtemp, hi);
      low = Math.min(jtemp, low);
    }

    const fHi = hi * (9 / 5) + 32;
    const fLow = low * (9 / 5) + 32;
    const weatherDescription = weather ? weather.description : '';

    const wantedData = {
      cHi: hi,
      cLow: low,
      dayOfWeek,
      image: getImage(weatherDescription),
      fHi,
      fLow,
    };

    renderData.push(wantedData);
  }
  return renderData;
}

function parseData2(data) {
  //Data2 code
  const { city_name, temp: temp2, weather: weather2 } = data;

  let image2 = null;
  if (weather2 && weather2.description) image2 = getImage(weather2.description);

  var farenheit2 = temp2 * (9 / 5) + 32;

  return {
    cityName: city_name,
    image: image2,
    f: farenheit2,
  };
}

export default function App(props) {
  const [data1, setData1] = React.useState(null);
  const [data2, setData2] = React.useState(null);

  React.useEffect(() => {
    WeatherAPI.get(
      'https://weatherbit-v1-mashape.p.rapidapi.com/forecast/3hourly?lat=37.773972&lon=-122.431297'
    ).then((response) => {
      if (response && response.data && response.data.data) {
        setData1(parseData1(response.data.data));
      }
    });
  }, []);

  React.useEffect(() => {
    WeatherAPI.get(
      'https://weatherbit-v1-mashape.p.rapidapi.com/current?lat=37.773972&lon=-122.431297'
    ).then((response) => {
      if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        setData2(parseData2(response.data.data[0]));
      }
    });
  }, []);

  if (!data1 || !data2) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const { cityName, f, image } = data2;
  return (
    <View
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '5vw',
        width: '100vw',
        height: '100vh',
      }}>
      <Text>{cityName}</Text>
      <Text>Currently: {f}°F</Text>
      {image && <Image source={image} style={{ width: 100, height: 50 }} />}

      <View style={{ display: 'flex', flexDirection: 'row' }}>
        {data1.map((data) => {
          const { cHi, cLow, dayOfWeek, fHi, fLow, image } = data;
          return (
            <View
              key={dayOfWeek}
              style={{
                padding: '20px',
                marginRight: '30px',
              }}>
              <Text>{dayOfWeek}</Text>
              {image && (
                <Image source={image} style={{ width: 100, height: 50 }} />
              )}
              <Text>Hi: {Math.round(fHi)}°F</Text>
              <Text>Lo: {Math.round(fLow)}°F</Text>
              <Text>Hi: {Math.round(cHi)}°C</Text>
              <Text>Lo: {Math.round(cLow)}°C</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
