import Head from 'next/head'
import styles from '../styles/Home.module.css';

export const getServerSideProps = async ({ res }) => {
    if (typeof window === 'undefined') {
        res.writeHead(301, {
            Location: '/'
        });
        res.end();
    }

    return {
        props: {}
    };
};
export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1 className={styles.title}>
                    Bienvenido a la Consola!
                </h1>

                <p className={styles.description}>
                    ¡Aquí es donde podremos realizar toda la acción!
                </p>

                <div className={styles.grid}>
                    <a className={styles.card}>
                        <h3>Usuarios &rarr;</h3>
                        <p>¡Administración de usuarios registrados en MoneyBlinks!</p>
                    </a>

                    <a className={styles.card}>
                        <h3>Transacciones &rarr;</h3>
                        <p>¡Podrás revisar todas las transacciones realizadas!</p>
                    </a>

                    <a
                        href="https://github.com/vercel/next.js/tree/master/examples"
                        className={styles.card}
                    >
                        <h3>Corresponsales &rarr;</h3>
                        <p>¡Administra la configuración de los corresponsales y sus finanzas!</p>
                    </a>

                    <a
                        href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        className={styles.card}
                    >
                        <h3>Otro &rarr;</h3>
                        <p>
                            ¡Elementos de Administración Variados en la consola!
                        </p>
                    </a>
                </div>
            </main>

            <footer className={styles.logocontainer}>
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