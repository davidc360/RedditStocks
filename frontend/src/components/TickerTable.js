import React, { useEffect, useState } from 'react'
import "./TickerTable.sass"

// tickers: sorted by mentions in App.js
export default function ({ tickers, queryHour, setQueryHour }) {
    // console.log('ticker table: ', tickers)
    const tickerRows = []
    tickers?.forEach(ticker => {
        if (ticker.mentions > 2) {
            tickerRows.push(<TickerRow key={ticker['name']} {...ticker} />)
        }
    })

    // console.log('ticker rows: ', tickerRows)

    return (
        <div className="stats">
            <h1>Stats</h1>
                <table className='table'>
                    <ul className='hour-selectors'>
                        <li className={`hour-selector nav-link ${queryHour === 1 ? 'hour-selected' : ''}`} onClick={()=>setQueryHour(1)}>1H</li>
                        <li className={`hour-selector nav-link ${queryHour === 4 ? 'hour-selected' : ''}`} onClick={()=>setQueryHour(4)}>4H</li>
                        <li className={`hour-selector nav-link ${queryHour === 12 ? 'hour-selected' : ''}`} onClick={()=>setQueryHour(12)}>12H</li>
                        <li className={`hour-selector nav-link ${queryHour === 24 ? 'hour-selected' : ''}`} onClick={()=>setQueryHour(24)}>1D</li>
                        <li className={`hour-selector nav-link ${queryHour === 72 ? 'hour-selected' : ''}`} onClick={()=>setQueryHour(72)}>3D</li>
                        <li className={`hour-selector nav-link ${queryHour === 168 ? 'hour-selected' : ''}`} onClick={()=>setQueryHour(168)}>1W</li>
                    </ul>
                    <thead>
                        <tr>
                            <th className='tickerName'>Ticker</th>
                            <th>Mentions</th>
                            <th>Sentiment</th>
                            <th>Positive</th>
                            <th>Neutral</th>
                            <th>Negative</th>
                        </tr>
                    </thead>
                    { tickerRows.length === 0 ? (
                        <div>
                            <br />
                            Not data in this time frame yet.
                        </div>
                    ) : (
                        <tbody>
                            { tickerRows }
                        </tbody>
                    )}
                </table>
        </div>
    )    
}

function TickerRow({ name, mentions, sentiment, positive_count, neutral_count, negative_count }) {

    // const sent_percent = sent_cnt => sent_cnt > 0 ? (sent_cnt / total_sent_cnt * 100).toFixed(2) + '%' : null

    // const blacklistSecret = localStorage.getItem("blacklistSecret")
    
    // function blacklistTicker() {
    //     axios.post(serverURL + "blacklist_ticker", {
    //         ticker,
    //         secret: blacklistSecret
    //     })
    //     setShow(false)
    // }

    function googleTicker() {
        window.open("https://www.google.com/search?q=" + name,'_blank')
    }

    return (
        <tr>
            <td className='tickerName' onClick={googleTicker}>
                { name }
            </td>
            <td>{mentions}</td>
            <td>{sentiment >= 0 ? '+' : ''}{(sentiment*100).toFixed(2)}</td>
            <td>{Math.round((positive_count / mentions)*100)}%</td>
            <td>{Math.round((neutral_count / mentions)*100)}%</td>
            <td>{Math.round((negative_count / mentions)*100)}%</td>
            {
                    // blacklistSecret &&
                    //     <ToolTip tooltext={'Blacklist this ticker'} className={styles.remove} onClick={blacklistTicker}>
                    //         X
                    //     </ToolTip>
            }
        </tr>
    )
}