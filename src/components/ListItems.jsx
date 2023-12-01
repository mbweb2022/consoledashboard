import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";

export const MainListItems = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <React.Fragment>
      {/* Ejemplo para Dashboard */}
      <ListItemButton
        style={location.pathname === "/home" ? { backgroundColor: "lightgray" } : {}}
        onClick={() => navigate("/dashboard")}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton
        style={location.pathname === "/transacciones" ? { backgroundColor: "lightgray" } : {}}
        onClick={() => navigate("/transacciones")}
      >
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Transacciones" />
      </ListItemButton>
      <ListItemButton
        style={location.pathname === "/usuarios" ? { backgroundColor: "lightgray" } : {}}
        onClick={() => navigate("/usuarios")}
      >
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Usuarios" />
      </ListItemButton>
      <ListItemButton
        style={location.pathname === "tesoreria" ? { backgroundColor: "lightgray" } : {}}
        onClick={() => navigate("/tesoreria")}
      >
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Tesoreria" />
      </ListItemButton>
      <ListItemButton
        style={location.pathname === "archivos" ? { backgroundColor: "lightgray" } : {}}
        onClick={() => navigate("/archivos")}
      >
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Archivos" />
      </ListItemButton>
      {/* Continúa con los demás elementos de la lista, siguiendo el mismo patrón */}
      {/* ... */}

    </React.Fragment>
  );
};

export const SecondaryListItems = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        {/* aqui puede ir texto xd */}
      </ListSubheader>

      {/* Ejemplo para Corresponsales 
      <ListItemButton
        style={location.pathname === "/corresponsales" ? { backgroundColor: "lightgray" } : {}}
        onClick={() => navigate("/corresponsales")}
      >
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Corresponsales" />
      </ListItemButton>

       Continúa con los demás elementos de la lista, siguiendo el mismo patrón */}
      {/* ... */}

    </React.Fragment>
  );
};
