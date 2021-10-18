import './App.sass';
import React, { useState, useEffect, useRef } from "react"

import { BrowserRouter, Route, Switch  } from 'react-router-dom'
import Nav from './components/Nav'
import About from './components/About'
import Socket from './components/Socket'
import TickerTable from './components/TickerTable'
import Contact from './components/Contact'
import EnterSecret from './components/EnterSecret'

import io from "socket.io-client"
import axios from 'axios'

const ENDPOINT = process.env.REACT_APP_ENDPOINT
axios.defaults.headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
}
console.log('env endpoint: ' + process.env.REACT_APP_ENDPOINT)

function Home() {
    const [threads, setThreads] = useState([])
    const [currentTickers, _setCurrentTickers] = useState({})
    const currentTickersRef = useRef(currentTickers)
    const setCurrentTickers = tickers => { currentTickersRef.current = tickers; _setCurrentTickers(tickers)}
    // using ref to work around access the state in socket handler
    // see https://medium.com/geographit/accessing-react-state-in-event-listeners-with-usestate-and-useref-hooks-8cceee73c559

    useEffect(() => {
        // set up websockets
        const socket = io(ENDPOINT);
        const handleNewThread = data => {
            setThreads(threads => [data, ...threads])

            console.log('current tickers', currentTickersRef.current)

            // update ticker mention count
            // add 1 to the mention if ticker already in list
            // if not, initiate it
            if (data.tickers.length > 0) {
                const updatedTickerList = { ...currentTickersRef.current }
                data.tickers.forEach(ticker => {
                    // if ticker exists
                    if (ticker in updatedTickerList) {
                        updatedTickerList[ticker]['mentions'] += 1
                    } else {
                        updatedTickerList[ticker]= {
                            mentions: 1
                        }
                    }
                })
                setCurrentTickers(updatedTickerList)
            }
        }
        socket.on("new thread", handleNewThread)

        // get current tickers and their stats
        axios.get(ENDPOINT + 'stats').then(res => setCurrentTickers(res.data))
        
        // get last thread on first render
        axios.get(ENDPOINT + 'last_thread').then(res => setThreads([res.data]))

        return () => {
            // turning of socket listner on unmount
            socket.off('new thread', handleNewThread);
        }
    }, []);

    console.log('cur tick', currentTickers)

    const sortedTickers = currentTickers ? Object.keys(currentTickers).map(ticker => {
        return {
            name: ticker,
            count: currentTickers[ticker]['mentions']
        }
    }).sort((a, b) => (b.count - a.count)) : []

    return (
        <div className='main'>
            <TickerTable tickers={ sortedTickers }/>
            <Socket threads={ threads }/>
        </div>
    )
}

function App() {
    return (
        <BrowserRouter>
                <div className="App">
                <Nav />
                <Switch>    
                    <Route exact path='/' component={Home} />
                    <Route path='/about' component={About} />
                    <Route path='/contact' component={Contact} />
                    <Route path='/code' component={EnterSecret} />
                    {/* route reddit links to reddit */}
                    <Route path='/r/:subreddit' component={() => { window.location.replace('https://reddit.com/' + window.location.pathname) }} />
                    <Route path='/u/:user' component={() => { window.location.replace('https://reddit.com/' + window.location.pathname) }} />
                   
                    <Route path='*' component={()=>(<div>Oh no!!!! Page not found.</div>)} />
                </Switch>
                </div>
        </BrowserRouter>
    );
}

export default App;
