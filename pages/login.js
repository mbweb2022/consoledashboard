import Head from 'next/head'
import styles from '../styles/Home.module.css';
import * as React from "react";
import { useRouter } from 'next/navigation';
import axios from "axios"
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

  const login = async () => {
    if (!isLoading) {
      setLoading(true)
      if (usuario == "" || password == "") {
        setErrorMessage("Usuario o contraseña no pueden estar vacíos.")
        setIsVisible(true)
        setLoading(false)
        return;
      }
      if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/.test(password)) {
        setErrorMessage("La contraseña introducida no cumple con la política de contraseñas.")
        setIsVisible(true)
        setLoading(false)
        return;
      }
      if (usuario.length < 6) {
        setErrorMessage("El usuario introducido es incorrecto.")
        setIsVisible(true)
        setLoading(false)
        return;
      }
      try {
        const response = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
          type: "login",
          username: usuario,
          password: password,
        });

        // Si la solicitud es exitosa, imprimimos la respuesta del servidor
        console.log(response.data.code.message);
        if (response.data.code.message == "User does not exist.") {
          setErrorMessage("El usuario indicado no existe.")
          setIsVisible(true)
          setLoading(false)
          return;
        } else if (response.data.code.message == "Incorrect username or password.") {
          setErrorMessage("Usuario o contraseña incorrectos.")
          setIsVisible(true)
          setLoading(false)
          return;
        } else if (response.data.code.message == "User not allowed to sign in.") {
          setErrorMessage("No tienes permitido iniciar sesión")
          setIsVisible(true)
          setLoading(false)
          return;
        } else if (response.data.code.token) {
          router.push('/dashboard')
          localStorage.setItem('ssTk-mb', response.data.code.token);
          setLoading(false)
          return;
        } else {
          setErrorMessage("Hubo un error temporal, por favor, inténtalo más tarde.")
          setIsVisible(true)
          setLoading(false)
        }
      } catch (error) {
        // Si hay algún error, lo imprimimos en la consola
        if (error.messsage) {
          setErrorMessage("Hubo un error temporal, por favor, inténtalo más tarde.")
          setIsVisible(true)
          setLoading(false)
          return;
        } else {
          setErrorMessage("Ahora mismo el sitio está en mantenimiento.")
          setIsVisible(true)
          setLoading(false)
          return;
        }

      }
      /*await Auth.signIn(usuario, password)
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
        */
      setLoading(false);
    }
  }
  React.useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          setErrorMessage("");
        }, 450)
      }, 5000);
    }
  }, [isVisible]);

  React.useEffect(() => {
    //setLoading(true)
    setTimeout(async () => {
      const storedSessionToken = localStorage.getItem('ssTk-mb');
      if (storedSessionToken) {
        try {
          console.log("STORED TOKEN")
          console.log(storedSessionToken)
          setLoading(true)
          const response = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
            type: "autologin",
            token: storedSessionToken
          });
          setLoading(false)
          console.log("HUBO ERROR? XD")
          console.log(response.data.error)
          console.log(response.data.code)
          console.log(JSON.stringify(response.data.code))
          if (!response.data.error) {
            router.push('/dashboard')
          }
        } catch (e) {
          setLoading(false)
        }

      }
      /*
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
      */
    }, 2500)
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
            <h3 style={{ textAlign: "center", paddingTop: 10, marginBottom: 10 }}>INICIAR SESIÓN</h3>

            <label onKeyDown={(event) => {
              if (event.key === 'Enter') {
                login()

              }
            }} for="username"><span className={styles.inputtext} style={{ fontSize: 18 }}>Nombre de usuario</span></label>
            <input value={usuario} onChange={(event) => {
              setUsuario(event.target.value);
            }} disabled={isLoading} type="email" className={styles.input} id="username" name="username" />
            <label for="password"><span className={styles.inputtext} style={{ fontSize: 18 }} >Contraseña</span></label>
            <input onKeyDown={(event) => {
              if (event.key === 'Enter') {
                login()

              }
            }} value={password} onChange={(event) => {
              setPassword(event.target.value);
            }} disabled={isLoading} style={{ marginBottom: 10 }} className={styles.input} type="password" id="password" name="password" />

            <button disabled={isLoading} className={styles.button} type="submit" onClick={login}>Ingresar &rarr;</button>


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