import useDashboardContext from "../../utils/contexts/DashboardContext";
import { useNavigate } from "react-router-dom";
import { useAuthenticationInit } from "../../utils/functions/generalFunctions";
import React, { useEffect } from "react";
import { useArchivos } from "../../utils/hooks/archivosHooks";
import { CustomProvider } from "../../utils/contexts/CustomContext";
import useCustomContext from "../../utils/contexts/CustomContext";
import { MainCard } from "./components";

function ArchivosContent () {
    const { setLoading, loggedUser, handleAutomaticLogin, refreshState, refresh } = useDashboardContext();
    const navigate = useNavigate();
    const resultado = useArchivos(refreshState)
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


        <CustomProvider>
            <MainCard context={useCustomContext} resultado={resultado} refresh={refresh} />
        </CustomProvider>


    )
}

export default ArchivosContent
