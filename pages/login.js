import Head from 'next/head'
import styles from '../styles/Home.module.css';
import * as React from "react";
import { Auth } from "aws-amplify";
import { useRouter } from 'next/navigation';

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
  const [isLoading, setLoading] = React.useState(false);
  const [usuario, setUsuario] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isVisible, setIsVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const router = useRouter();

  React.useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          setErrorMessage("");
        }, 450)
      }, 5000); // oculta el cuadro de error después de 5 segundos
    }
  }, [isVisible]);

  React.useEffect(() => {
    setLoading(true)
    setTimeout(async () => {
      await Auth.currentSession()
        .then(data => {
          router.push('/dashboard')
          console.log(data);
        })
        .catch(err => {
          // No hay una sesión abierta
          console.log(err);
        });
      setLoading(false)
    }, 5500)
  }, [])
  return (
    <div className={isLoading ? null : null}>
      <div className={styles.container}>

        {isLoading ? <div className={styles.loadingdiv}>
          <img src="/cargando.svg" width={234} />
          <span style={{ fontSize: 18, fontFamily: "sans-serif" }}>Cargando, espera un momento...</span>
        </div> : null}
        <div className={styles.containerlogin}>
          <img src="/loginbackground.jpg" alt="Fondo" />
        </div>
        <Head>
          <title>Moneyblinks Administrator</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className={styles.grid}>

          <div className={styles.card}>

            <div className={styles.logocard}>
              <img src="/logo2.png" style={{ width: "128px", marginBottom: errorMessage == "" ? 0 : 20 }} />
            </div>
            <div className={errorMessage == "" ? null : `${styles.errorBox} ${isVisible ? styles.visible : styles.hidden}`}>
              <span style={{ fontFamily: "sans-serif", fontSize: 18 }}>{errorMessage}</span>
            </div>
            <h3 style={{ paddingTop: 10, marginBottom: 25 }}>Iniciar sesión</h3>

            <label for="username"><span className={styles.inputtext} style={{ fontSize: 18 }}>Nombre de usuario</span></label>
            <input value={usuario} onChange={(event) => {
              setUsuario(event.target.value);
            }} disabled={isLoading} type="email" className={styles.input} id="username" name="username" />
            <label for="password"><span className={styles.inputtext} style={{ fontSize: 18 }} >Contraseña</span></label>
            <input value={password} onChange={(event) => {
              setPassword(event.target.value);
            }} disabled={isLoading} style={{ marginBottom: 10 }} className={styles.input} type="password" id="password" name="password" />

            <button disabled={isLoading} className={styles.button} type="submit" onClick={async () => {
              setLoading(true)
              if (usuario == "" || password == "") {
                setErrorMessage("Usuario o contraseña no pueden estar vacíos.")
                setIsVisible(true)
              }
              await Auth.signIn(usuario, password)
                .then((user) => {
                  router.push('/dashboard')
                })
                .catch((err) => {
                  console.log("Se ha cacheado un error: ", err);
                  console.log("JSON: " + JSON.stringify(err))
                  if (err.code == "NotAuthorizedException") {
                    setErrorMessage("Usuario o contraseña incorrectos.")
                    setIsVisible(true)
                  }
                });
              setLoading(false);

            }}>Ingresar &rarr;</button>


          </div>

        </div>

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
          position: fixed;
          bottom: 0; /* sitúa el pie de página al fondo */
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
    </div>
  )
}