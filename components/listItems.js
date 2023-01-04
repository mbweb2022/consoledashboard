import * as React from "react";
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
import { useRouter, usePathname } from "next/navigation";
export const mainListItems = () => {
  const router = useRouter();
  return (
    <React.Fragment>
      {usePathname() == "/dashboard" ? (
        <ListItemButton style={{ backgroundColor: "lightgray" }}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText
            primary="Dashboard"
            onClick={() => {
              router.push("/dashboard");
            }}
          />
        </ListItemButton>
      ) : (
        <ListItemButton>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText
            primary="Dashboard"
            onClick={() => {
              router.push("/dashboard");
            }}
          />
        </ListItemButton>
      )}

      {usePathname() == "/transacciones" ? (
        <ListItemButton style={{ backgroundColor: "lightgray" }}>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText
            primary="Transacciones"
            onClick={() => {
              //router.push("/dashboard")
            }}
          />
        </ListItemButton>
      ) : (
        <ListItemButton>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText
            primary="Transacciones"
            onClick={() => {
              //router.push("/dashboard")
            }}
          />
        </ListItemButton>
      )}

      {usePathname() == "/usuarios" ? (
        <ListItemButton style={{ backgroundColor: "lightgray" }}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Usuarios" />
        </ListItemButton>
      ) : (
        <ListItemButton>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText
            primary="Usuarios"
            onClick={() => {
              router.push("/usuarios");
            }}
          />
        </ListItemButton>
      )}
      {usePathname() == "/tesoreria" ? (
        <ListItemButton style={{ backgroundColor: "lightgray" }}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Tesorería" />
        </ListItemButton>
      ) : (
        <ListItemButton>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Tesorería" onClick={()=>{
            router.push("/tesoreria");
          }} />
        </ListItemButton>
      )}
      {usePathname() == "/archivos" ? (
        <ListItemButton style={{ backgroundColor: "lightgray" }}>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Archivos" />
        </ListItemButton>
      ) : (
        <ListItemButton>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText
            primary="Archivos"
            onClick={() => {
              router.push("/archivos");
            }}
          />
        </ListItemButton>
      )}
    </React.Fragment>
  );
};

export const secondaryListItems = () => {
  const router = useRouter();
  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        Más funciones
      </ListSubheader>
      {usePathname() == "/corresponsales" ? (
        <ListItemButton style={{ backgroundColor: "lightgray" }}>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Corresponsales" />
        </ListItemButton>
      ) : (
        <ListItemButton>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText
            primary="Corresponsales"
            onClick={() => {
              router.push("/corresponsales");
            }}
          />
        </ListItemButton>
      )}
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Txes Corresponsal" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Pricing" />
      </ListItemButton>
    </React.Fragment>
  );
};
