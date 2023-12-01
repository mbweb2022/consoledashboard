import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import LoginIndex from "./features/Login"
import TransaccionesIndex from "./features/Transacciones"
import DashboardIndex from "./features/Dashboard"
import UsuariosIndex from "./features/Usuarios"
import TesoreriaIndex from './features/Tesoreria';
import ArchivosIndex from "./features/Archivos"
import { DashboardProvider } from './utils/contexts/DashboardContext';
function App() {
  return (

    <Router>
      <DashboardProvider>
        <Routes>
          {/* Ruta para la página de inicio */}
          <Route path="/" element={<Navigate to="/login" />} />
          {/* Ruta para la página de inicio de sesión */}
          <Route path="/login" element={<LoginIndex />} />

          {/* Ruta por defecto en caso de que ninguna otra coincida */}
          <Route path="/home" element={<DashboardIndex />} />
          <Route path="/dashboard" element={<Navigate to="/home" />} />
          <Route path="/transacciones" element={<TransaccionesIndex />} />
          <Route path="/usuarios" element={<UsuariosIndex />} />
          <Route path="/tesoreria" element={<TesoreriaIndex />} />
          <Route path="/archivos" element={<ArchivosIndex />} />
        </Routes>
      </DashboardProvider>
    </Router >

  );
}

export default App;
