import useDashboardContext from "../../utils/contexts/DashboardContext";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useAuthenticationInit } from "../../utils/functions/generalFunctions";
import { useUsuarios } from "../../utils/hooks/usuariosHooks";
import { useEffect } from "react";
import { SelectorCard, InformationCard } from "./components";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { CustomProvider } from "../../utils/contexts/CustomContext";
import useCustomContext from "../../utils/contexts/CustomContext";
function UsuariosContent() {
    const { setLoading, loggedUser, handleAutomaticLogin, refreshState, refresh } = useDashboardContext();
    const navigate = useNavigate();

    const resultado = useUsuarios(refreshState);
    useAuthenticationInit(loggedUser, navigate, handleAutomaticLogin);
    useEffect(() => {
        setLoading(true)
    }, [refreshState])
    useEffect(() => {
        if (resultado != null || resultado != undefined) {
            setLoading(false)
        }

    }, [resultado])
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <CustomProvider>
                    <SelectorCard context={useCustomContext} resultado={resultado} refresh={refresh}/>
                    <InformationCard context={useCustomContext} resultado={resultado} refresh={refresh} />
                </CustomProvider>
            </Grid>
        </Container>

    )
}


export default UsuariosContent;
