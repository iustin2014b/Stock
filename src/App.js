import React, { useEffect, useState, useRef } from 'react';
import './index.css';
import { Chart as ChartJS} from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import InputSymbol from './Components/InputSymbol';
import ChartLine from './Components/ChartLine';
import DropdownTime from './Components/DropdownTime';

function App() {
    const [name, setName] = useState("");
    const [values, setValues] = useState(() => []);
    const [valuesMin, setValuesMin] = useState(() => []);
    const [valuesMax, setValuesMax] = useState(() => []);
    const [dates, setDates] = useState(() => []);
    const [companySymbol, setcompanySymbol] = useState("");
    const [buttonClicked, setButtonClicked] =useState(0); //useState(false);
    const [renderIt, setRenderIt] = useState(false);
    const [data, setData] = useState(null);
    const [msg, setMsg] = useState("Enter a company symbol");
    const[interval,setInterval]=useState("hour")
    const [valued, setValued] = React.useState('hour');

    function handleChangeDropbox(event){
            setValued(event.target.value);
        }

    function handleButtonClick() {
        setButtonClicked(buttonClicked+1)
        setRenderIt(true);
        setcompanySymbol (document.getElementById("inputBox").value)
        document.getElementById("inputBox").value=""
    }
    
    function handleChangeInput(e) {
        setcompanySymbol(e.target.value);
        setRenderIt(false);
    }
    function handleChangeDropBox(event){
        setInterval(event.target.value)
    }

    const fetchDates = async () => {
        let datesArray = [];
        let valuesArray = [];
        let valuesMinArray = [];
        let valuesMaxArray = [];
        let API_Call;
        const API_Key = '04QJXW0ZW0IVIQOK'
        let dTime=valued
        if (dTime =="hour")
            API_Call = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+companySymbol+"&interval=60min&apikey="+API_Key;
       if (dTime =="day")
               API_Call = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+companySymbol+"&apikey="+API_Key;
        if (dTime =="week")  
            API_Call = "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol="+companySymbol+"&apikey="+API_Key;         
       if (companySymbol.length >=1)
            try {
                const response = await fetch(API_Call);
                if(response.ok) {
                    const data = await response.json();
                    const nameMeta=Object.keys(data) [0];
                
                    let result= nameMeta.localeCompare("MetaData")
                    if (result==-1){
                        setMsg( "Invalid API  call");
                        setRenderIt(false); 
                    }
                    const nameArrayTimes=Object.keys(data) [1];
                    const arrayOfTimes=Object.keys(data[nameArrayTimes]);
                    for(let i = 0; i <= 98; i++) {
                        valuesArray.push(parseFloat(data[nameArrayTimes][ arrayOfTimes[i]]['1. open']));
                        valuesMinArray.push(parseFloat(data[nameArrayTimes][ arrayOfTimes[i]]['3. low']));
                        valuesMaxArray.push(parseFloat(data[nameArrayTimes][ arrayOfTimes[i]]['2. high']));		      
                        datesArray.push(arrayOfTimes[i]);
                    }	 
                    let company= companySymbol;
                    setMsg( "Succesfull stocks " +company +" loaded") ; 
                    setRenderIt(true);      
                } 
                else{
                    setMsg( "Connection to site error");
                }       
                } 
            catch(error) {
                    throw Error (msg)
            }  
            setValues(valuesArray);
            setValuesMin(valuesMinArray);
            setValuesMax(valuesMaxArray);
            setDates(datesArray);
            return () => {     }
    }	
    useEffect(() => {fetchDates() },  [buttonClicked]);
    return (
        <div>     
         <DropdownTime value={valued} onChange={handleChangeDropbox} />
         <InputSymbol onChange = {handleChangeInput} onClick={handleButtonClick} companySymbol={companySymbol}  />
    
        <p>${msg}</p>   
        <ChartLine render={renderIt} dates={dates} values={values} valuesMax={valuesMax} valuesMin={valuesMin} inputName={companySymbol}/>  
        </div>
  )
}

export default App;
