import React from 'react';
import useDashboardContext from '../utils/contexts/DashboardContext'; // Importa el contexto
import cargandoSVG from "../assets/cargando.svg";

function LoadingScreen() {
    const { isLoading } = useDashboardContext();
    if (isLoading) {
        return (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Fondo blanco semi-transparente
                    display: 'flex',
                    flexDirection: 'column', // Apila los elementos verticalmente
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999, // Asegura que esté en la parte superior
                }}
            >
                <img src={cargandoSVG} height={"230vh"} width={"230vw"} />
                <span style={{ fontSize:"2vw", fontFamily: "sans-serif" }}>Cargando, espera un momento...</span>
            </div>
        );
    }

    return null;
}

export default LoadingScreen;
