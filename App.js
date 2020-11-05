import React from 'react';
import {Image, ImageBackground, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
import background1 from './assets/background.png';
import background2 from './assets/rainy_background.png';
import cloud from './assets/cloud.png';
import rain from './assets/rain.png';
import sun from './assets/sun.png';
import thun from './assets/thunder.png';

const WeatherAPI = axios.create({
  baseURL: 'weatherbit-v1-mashape.p.rapidapi.com',
  timeout: 1000,
  headers: {
    "content-type":"application/octet-stream",
    "x-rapidapi-host":"weatherbit-v1-mashape.p.rapidapi.com",
    "x-rapidapi-key":"dae388b832msh002dec8dceeab1fp15d898jsn90374ed4d6bc", 
    "useQueryString":true
  }
});

const PositionAPI = axios.create({
  baseURL: 'http://api.positionstack.com/v1/',
  timeout: 1000,
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
  if (str.includes('sun') || str.includes('clear')) 
    return sun;
  if (str.includes('cloud')) 
    return cloud;
  if (str.includes('rain')) 
    return rain;
  if (str.includes('thunder')) 
    return thun;
  if (str.includes('wind')) 
    return wind;
  else 
    return null;
}

function getBackground(feels) {
  var str = feels.toLowerCase();
  if(str.includes('sun') || str.includes('clear'))
    return background1;
  if(str.includes('rain') || str.includes('thunder') || str.includes('wind') || str.includes('cloud'))
    return background2;
  else 
    return null;
}

function parseDataPOS(dataPOS){
  return {
    Lon : dataPOS.longitude,
    Lat : dataPOS.latitude
  }
};

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
  const { city_name, temp: temp2, weather: weather2 } = data;

  let image2 = null;
  if (weather2 && weather2.description) image2 = getImage(weather2.description);

  let background = getBackground(weather2.description);
  var farenheit2 = temp2 * (9 / 5) + 32;

  return {
    cityName: city_name,
    image: image2,
    f: farenheit2,
    backimage: background
  };
}

export default function App(){
  const [data1, setData1] = React.useState(null);
  const [data2, setData2] = React.useState(null);
  const [value, setValue] = React.useState(null);
  const [dataPOS, setDataPOS] = React.useState(null);

  const onChange = (text) => {
    setValue(text)
  }
  
  const onClickSearch = () => {
    let input = 'https://api.positionstack.com/v1/forward'
    const params = {
      access_key: '2e57390d6ecdef89d24a18996f20aad6',
      query: value
    }  

    PositionAPI.get(input, {params}).then((response) => {
      if (response && response.data && response.data.results) {
        setDataPOS(parseDataPOS(response.data.results));
      }
    });
  }
  
  React.useEffect(() => {
    let input = 'https://weatherbit-v1-mashape.p.rapidapi.com/forecast/3hourly'
    if(dataPOS) {
      const {Lon, Lat} = dataPOS
      const params = {
        lat : Lat,
        lon : Lon
     }
      WeatherAPI.get(input, {params}).then((response) => {
        if (response && response.data && response.data.data) {
          setData1(parseData1(response.data.data));
        }
      });
    }
  }, [dataPOS]);

  React.useEffect(() => {
    let input = 'https://weatherbit-v1-mashape.p.rapidapi.com/current'
    if(dataPOS) {
      const {Lon, Lat} = dataPOS
      const params = {
        lat : Lat,
        lon : Lon
      }
      WeatherAPI.get(input, {params}).then((response) => {
        if (
          response &&
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          setData2(parseData2(response.data.data[0]));
        }
      });
    }
  }, [dataPOS]);

  if(data2 || data1) {
    const{cityName, f, image, backimage} = data2; 

    return(
      <ImageBackground source={backimage} 
        style={{
          flex: 1,
          objectFit: 'cover',
          width: '100vw',
          height: '100vh'
      }}>
      <View>
        <TextInput
            onChangeText={onChange}
            onSubmitEditing={onClickSearch}
            value={value}
        />

       <TouchableOpacity 
            onPress={onClickSearch}>
            <Text>Go</Text>
        </TouchableOpacity>
      </View>


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

      {data2 && <Text style={styles.data2}>{cityName}</Text>}
      {data2 && <Text style={styles.data2}>Currently: {Math.round(f)}°F</Text>}
      {image && <Image source={image} style={{ width: 100, height: 50, marginLeft: -20}} />}
    
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
             {data1 && <Text style={styles.data1}>{dayOfWeek}</Text>}
             {image && (
                <Image source={image} style={{ width: 80, height: 50, marginLeft: -12, marginBottom: 10 }} />
              )}
              {data1 && <Text style={styles.data1}>Hi: {Math.round(fHi)}°F</Text>}
              {data1 && <Text style={styles.data1}>Lo: {Math.round(fLow)}°F</Text>}
              {data1 && <Text style={styles.data1}>Hi: {Math.round(cHi)}°C</Text>}
              {data1 && <Text style={styles.data1}>Lo: {Math.round(cLow)}°C</Text>}
            </View>
          );
        })}
      </View>
    </View>
    </ImageBackground>
  );
  }
}
const styles = StyleSheet.create({
  data1: {
    marginBottom: 5
  },
  data2: {
    marginBottom: 5,
    marginLeft: -30
  }
})
