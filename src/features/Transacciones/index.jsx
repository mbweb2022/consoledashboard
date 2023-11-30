import { useAuthenticationInit } from "../../utils/functions/generalFunctions";
import { useNavigate } from "react-router-dom";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import useDashboardContext from "../../utils/contexts/DashboardContext";
import useCustomContext from "../../utils/contexts/CustomContext";
import { SelectorCard, InformationCard } from "./components";
import { CustomProvider } from "../../utils/contexts/CustomContext";
import { useTransacciones } from "../../utils/hooks/transaccionesHooks";
import { useEffect } from "react";
function TransaccionesContent() {
    const { setLoading, loggedUser, handleAutomaticLogin, refreshState, refresh } = useDashboardContext();
    const navigate = useNavigate();

    const resultado = useTransacciones(refreshState);
    useAuthenticationInit(loggedUser, navigate, handleAutomaticLogin);
    useEffect(()=>{
        setLoading(true)
    }, [refreshState])
    useEffect(()=>{
        if(resultado!=null || resultado != undefined){
            setLoading(false)
        }
        
    }, [resultado])

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <CustomProvider>
                        <SelectorCard context={useCustomContext} resultado={resultado} refresh={refresh} />
                        <InformationCard context={useCustomContext} resultado={resultado}/>
                    </CustomProvider>


                </Grid>
            </Container>
        </>

    )
}
export default TransaccionesContent;
