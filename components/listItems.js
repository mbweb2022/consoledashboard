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
        <ListItemButton onClick={() => {
          router.push("/dashboard");
        }}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText
            primary="Dashboard"
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
              router.push("/transacciones")
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
        <ListItemButton onClick={() => {
          router.push("/usuarios");
        }}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText
            primary="Usuarios"
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
        <ListItemButton onClick={() => {
          router.push("/tesoreria");
        }}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Tesorería" />
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
        <ListItemButton
          onClick={() => {
            router.push("/archivos");
          }}>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText
            primary="Archivos"
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
        <ListItemButton onClick={() => {
          router.push("/corresponsales");
        }}>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText
            primary="Corresponsales"
          />
        </ListItemButton>
      )}
      {usePathname() == "/pricing" ? (<ListItemButton style={{ backgroundColor: "lightgray" }}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Pricing" />
      </ListItemButton>) : (
        <ListItemButton onClick={() => {
          router.push("/pricing");
        }}>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Pricing" />
        </ListItemButton>
      )}

    </React.Fragment>
  );
};
