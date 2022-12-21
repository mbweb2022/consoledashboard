import Head from 'next/head'
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/navigation';
import * as React from "react";
import {Auth} from "aws-amplify";
import awsconfig from "../src/aws-exports";
export default function Home() {
  if (typeof window != 'undefined') {
    Auth.configure(awsconfig);
  
    const router = useRouter();
    React.useEffect(() => {
      let interval = setInterval(() => {
          router.push('/login')
          clearInterval(interval);
      }, 7250)
    }, [])
  }
  return (

    <div className={styles.container}>
      <Head>
        
        <title>Moneyblinks Administrator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <img src="/logo2.png" style={{ width: "128px", height: "60px" }} />
        <h1 className={styles.title}>
          ¡Bienvenido a <span style={{ color: "gold" }}>M</span>oney<span style={{ color: "gold" }}>B</span>link<span style={{ color: "gold" }}>$</span>!
        </h1>

        <p className={styles.description}>
          Por favor, espera unos segundos mientras preparamos todo...
        </p>
        <img src="/loading.gif" style={{ width: "128px", height: "128px" }} />
      </main>

      <footer>
        <a
          href="https://moneyblinks.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Moneyblinks.
          <img src="/logo2.png" alt="Vercel" className={styles.logo} />
        </a>
      </footer>

      <style jsx>{`
        main {

          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>

    </div>
  )
}