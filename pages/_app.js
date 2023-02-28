import { useEffect, useState } from 'react';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
    const [intervalId, setIntervalId] = useState(null);
    useEffect(()=>{
        
    }, [])
    return <Component {...pageProps} />
}

export default MyApp