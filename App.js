import React from 'react';
import {Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import background1 from './assets/background.png';
import background2 from './assets/rainy background.png';
import cloud from './assets/cloud.png';
import datafile from './datafile.js';
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

export default function App(){
  const [data1, setData1] = React.useState(null);
  const [data2, setData2] = React.useState(null);

  //React.useEffect( () => {
    //WeatherAPI.get("https://weatherbit-v1-mashape.p.rapidapi.com/forecast/3hourly?lat=37.773972&lon=-122.431297").then ( data => {
      //console.log("\n\nDATA1:", data);
        //setData1(data);
    //})
    //WeatherAPI.get("https://weatherbit-v1-mashape.p.rapidapi.com/current?lat=37.773972&lon=-122.431297").then ( data => {
      //console.log("\n\nDATA2:", data.data[0]);
      //if(data.data[0])
        //setData2(data.data[0]);
    //})
  //}, [])

  React.useEffect(() => {
    const data = [
      {
      "rh":64,
      "pod":"d",
      "lon":-122.43,
      "pres":1010.5,
      "timezone":"America/Los_Angeles",
      "ob_time":"2020-09-19 20:20",
      "country_code":"US",
      "clouds":75,
      "ts":1600546800,
      "solar_rad":561.8,
      "state_code":"CA",
      "city_name":"San Francisco",
      "wind_spd":2.57,
      "wind_cdir_full":"east",
      "wind_cdir":"E",
      "slp":1011.1,
      "vis":5,
      "h_angle":0,
      "sunset":"02:10",
      "dni":895.51,
      "dewpt":15.5,
      "snow":0,
      "uv":4.01071,
      "precip":0,
      "wind_dir":80,
      "sunrise":"13:56",
      "ghi":803.44,
      "dhi":114.49,
      "aqi":99,
      "lat":37.77,
      "weather":{
      "icon":"c02d",
      "code":801,
      "description":"Few clouds"
      },
      "datetime":"2020-09-19:20",
      "temp":22.7,
      "station":"3189P",
      "elev_angle":51.03,
      "app_temp":22.7,
      }
      ]
    setData2(data);
    setData1(datafile);
  }, [])


  if(!data1){
    return(
      <View><Text>Loading...</Text></View>
    )
  }

  if(!data2){
    return(
      <View><Text>Loading...</Text></View>
    )
  }

  //<View style={styles.container}>
    //<ImageBackground source={background1} style={styles.background1}>
    //</ImageBackground>
  //</View>

  
  //Data1 code
  const {temp: temp1, weather: weather1} = data1[i]; 

  var divide = (data1.length/5);
  var start = divide/2;
  let image = null;
  for(var i = start; i < data1.length; i+divide)
    if(weather1 && weather1.description)
      image = getImage(weather1.description);
  
  var x = 0; 
  var Fhigh, Flow, Chigh, Clow = [0, 0, 0, 0, 0];

  for(var k = 0; k < data1.length; k+divide) {
    for(var l = k; l < k+divide; l++) {
      Chigh[x] = temp1;
      Clow[x] = temp1;
      if(temp < Clow[x])
        Clow[x] = temp1;
      if(temp > Chigh[x])
        Chigh[x] = temp1;
    }
    x++;
  }

  for(x = 0; x < 5; x++) {
    Fhigh[x] = ((Chi[x] * (9/5)) + 32);
    Flow[x] = ((Clow[x] * (9/5)) + 32);
  }
  
  //Data2 code
  const {city_name, temp: temp2, weather: weather2} = data2[0];

  let image2 = null;
  if(weather2 && weather2.description)
      image2 = getImage(weather2.description);
  function getImage(feels){
    var str = feels.toLowerCase();
    if(str.includes('sun') || str.includes('clear'))
      return sun;
    if(str.includes('cloud'))
      return cloud;
    if(str.includes('rain'))
      return rain;
    if(str.includes('thunder'))
      return thun;
    if(str.includes('wind'))
      return wind;
    else
      return null;
  }

  var farenheit2 = ((temp2 * (9/5)) + 32);

  return(
  <View style={{display: 'flex', flexDirection: 'row'}}>
    <Text>{city_name} {"\n"}Currently: {farenheit2}°F </Text>
    {image && <Image source={image2} style={{width: 100, height: 50}}/>}
  </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  background1: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
});

