import React, { useState, useEffect } from 'react';
import './App.scss';
import {FormControl, MenuItem, Select,Card, CardContent} from '@material-ui/core'
import InfoBox from "./components/InfoBox";
import Map from "./components/Map"
import Table from "./components/Table"
import { sortData,  prettyPrintStat } from "./util";
import LineGraph from './components/LineGraph'
import "leaflet/dist/leaflet.css"


function App() {

  // Api da Desease.sh

  ///https://disease.sh/v3/covid-19/countries

  const [countries, setCountires] = useState([ ]);
  const[country, setCountry] = useState("todospaises");
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData, setTabletData] = useState([])
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);


  useEffect(() => {
    fetch ("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then((data) => {
      setCountryInfo(data);
    });

  }, [])

  useEffect(() => {
    const getCoutriesData = async () => {
        await fetch ("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
            const countries = data.map((country) => (
              {
                name : country.country, // Brasil
                value: country.countryInfo.iso2 // BR
              }
            ));
            
            const sortedData = sortData(data);
            setTabletData(sortedData);
            setMapCountries(data);
            setCountires(countries);
        })
    };

    getCoutriesData();
    }, []);


    const onCountryChange = async (event) => {
      const countryCode = event.target.value;
    
      // https://disease.sh/v3/covid-19/all
      // https://disease.sh/v3/covid-19/countries/ [CODE]

      const url = countryCode === 'todospaises' ? 'https://disease.sh/v3/covid-19/all' : 
      `https://disease.sh/v3/covid-19/countries/${countryCode}`;
      
      
      

       await fetch(url)
      .then(response => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        countryCode === "todospaises"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);

       
        setMapZoom(4);
        

        
       ;
      });
    }


  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid 19 Tracker </h1>
          <FormControl className="app__dropdown">
            <Select
              variant='outlined'
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="todospaises">Escolher País</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name }</MenuItem>
              ))}
            </Select>
          </FormControl>


        </div>

        {/* Info Box */}
        <div className="app__stats">
              <InfoBox isRed active={casesType === 'cases'} onClick = {e =>setCasesType('cases')} title = "Casos Corona Vírus"  cases={ prettyPrintStat(countryInfo.todayCases)} total = {prettyPrintStat(countryInfo.cases)} />

              <InfoBox active={casesType === 'recovered'} onClick = {e =>setCasesType('recovered')} title = "Recuperados Corona Vírus" cases = {prettyPrintStat(countryInfo.todayRecovered)} total = {prettyPrintStat(countryInfo.recovered)} />

              <InfoBox isRed active={casesType === 'deaths'}  onClick = {e =>setCasesType('deaths')} title = "Mortes Corona Vírus" cases = {prettyPrintStat(countryInfo.todayDeaths)}  total = {prettyPrintStat(countryInfo.deaths)} />
        </div>

        {/* Map */}
        <Map
          countries = {mapCountries}
          center={mapCenter}
          zoom={mapZoom}
          casesType={casesType}
        />


      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Casos ao vivo por Paises</h3>
          <Table countries={tableData} />

        
          <h3 className="tips" >Tipos :  {casesType} </h3>
          <LineGraph casesType={casesType} />


        </CardContent>

        {/* Table */}
        {/* Graph */}
      </Card>

    </div>
  );
}

export default App;
