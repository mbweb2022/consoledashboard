
import { useDashboard } from "../../utils/hooks/dashboardHooks";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import useDashboardContext from "../../utils/contexts/DashboardContext";
import React from "react";

import { useAuthenticationInit } from "../../utils/functions/generalFunctions";
import { useNavigate } from "react-router-dom";
import { MainCard, DataCard, LastTxsCard } from "./components";

function DashboardContent() {

    const { setLoading, loggedUser, handleAutomaticLogin } = useDashboardContext();
    const navigate = useNavigate();
    useAuthenticationInit(loggedUser, navigate, handleAutomaticLogin);
    setLoading(true)
    const resultado = useDashboard();
    if (resultado != undefined && resultado != null) {
        setLoading(false);
    }

    return (
        <>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                
                <Grid container spacing={3}>

                    {(loggedUser && resultado) ? <>
                        <MainCard loggedUser={loggedUser} resultado={resultado} navigate={navigate} />
                        <DataCard resultado={resultado} navigate={navigate} />
                        <LastTxsCard resultado={resultado} navigate={navigate}/>
                    </> : null}
                    

                </Grid>

            </Container>


        </>
    )
}

export default DashboardContent;
