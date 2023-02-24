import React, { useState, useEffect} from 'react';
import {ButtonGroup, Button} from '@mui/material';
import './App.css';


function App() {
    const [data, setData] = useState([]);
    const [activeCurr, setActiveCurr] = useState({})
    const [uahInput, setUahInput] = useState('');
    const [currInput, setCurrInput] = useState('')

    useEffect(()=> {
        request()
    },[])

    const onUah = e => {
        setUahInput(e.target.value)
        setCurrInput(Math.round(e.target.value * activeCurr.rate *100)/100)
    }
    const onCurr = e => {
        setCurrInput(e.target.value)
        setUahInput(Math.round(e.target.value * activeCurr.inverseRate *100)/100)
    }
    const onClick = (e) => {
        setActiveCurr(data.filter(item=>item.name == e.target.getAttribute('data-name'))[0])
        setCurrInput(uahInput * activeCurr.inverseRate)
    }

    const request = () => {
        fetch('http://www.floatrates.com/daily/uah.json')
            .then(res => res.json())
            .then(res => Object.values(res))
            .then(res => res.filter(curr => {
                return (curr.code === 'USD' || 
                        curr.code === 'EUR' ||
                        curr.code === 'PLN' )
            }).map(item => ({name:item.code, rate:item.rate, inverseRate:item.inverseRate})))
            .then(res => {
                setData(res)
                setActiveCurr(res[1])
            })
            .catch((error) => {
                console.error(error)})
    }

    const addStyle = (name) => {
        if(name == activeCurr?.name){
            return{
                border: '2px solid white',
                fontSize :'24px'
            }
        }
    }

  return (
    <div className="app">
        <p>1 Українська гривня дорівнює:</p>
        <div className="currency_conteiner">
            <p>{Math.floor(data[0]?.rate * 1000)/1000}$</p>
            <p>{Math.floor(data[1]?.rate * 1000)/1000}€</p>
            <p>{Math.floor(data[2]?.rate * 1000)/1000}zł</p>
        </div>
        <input value={uahInput}
                placeholder='UAH'
                type="text" 
                className='counter'
                onChange={e => onUah(e)}/>
        <input  value={currInput}
                placeholder={activeCurr.name}
                type="text" 
                className='counter'
                onChange={e => onCurr(e)}/>
        <ButtonGroup variant="contained" className='controls' aria-label="outlined primary button group">
            <Button onClick={e => onClick(e)} style={addStyle('EUR')}data-name='EUR'>EUR</Button>
            <Button onClick={e => onClick(e)} style={addStyle('USD')} data-name='USD'>USD</Button>
            <Button onClick={e => onClick(e)} style={addStyle('PLN')} data-name='PLN'>PLN</Button>
        </ButtonGroup>
      </div>
  );
}

export default App;

