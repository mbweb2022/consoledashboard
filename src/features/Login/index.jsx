
import { BackgroundComponent, Grid, LoginCard, Logo, Title, FormInput, FormButton } from "./Login.style";
import React from "react";
import useDashboardContext from "../../utils/contexts/DashboardContext";
import { handleLogin } from "../../utils/functions/loginFunctions";
import { useNavigate } from "react-router-dom";
import { useAutomaticAuthenticationInit } from "../../utils/hooks/loginHooks";
function Index() {
    const [User, setUser] = React.useState("");
    const [Password, setPassword] = React.useState("");
    
    const navigate = useNavigate()
    const {isLoading, setLoading, setError, setLoggedUser, handleAutomaticLogin} = useDashboardContext();
    async function Login(User, Password){
        setLoading(true)
        const {error, message} = await handleLogin(User, Password, setLoggedUser, navigate);
        if(error){
            setError(message)
        }
        setLoading(false)
    
    }
    useAutomaticAuthenticationInit(handleAutomaticLogin, navigate, setLoading);
    return (
        <>
            <BackgroundComponent />
            <Grid>
                <LoginCard>
                    <Logo />
                    <Title>Iniciar sesión</Title>
                    <div>
                        <FormInput
                            type="text"
                            placeholder="Usuario"
                            name="username"
                            required
                            onChange={(event)=>{
                                setUser(event.target.value)
                            }}
                            disabled={isLoading}
                            maxLength={36}
                        />
                    </div>
                    <div>
                        <FormInput
                            type="password"
                            placeholder="Contraseña"
                            name="password"
                            required
                            disabled={isLoading}
                            
                            maxLength={24}
                            onChange={(event) => {
                                setPassword(event.target.value)
                            }}
                        />
                    </div>
                    <FormButton disabled={isLoading} onClick={()=>{
                        Login(User, Password)
                    }} type="submit">Ingresar</FormButton>
                </LoginCard>
            </Grid>

        </>

    )
}

export default Index;
