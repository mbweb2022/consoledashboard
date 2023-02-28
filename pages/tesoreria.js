import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems, secondaryListItems } from "../components/listItems";
import Deposits from "../components/Deposits";
import Orders from "../components/Orders";
import axios from "axios";
import BankTable from "../components/BankTable";
import ACHTable from "../components/ACHTable";
import styles from '../styles/Home.module.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
export const getServerSideProps = async ({ res }) => {
  if (typeof window === 'undefined') {
    res.writeHead(301, {
      Location: '/'
    });
    res.end();
  }

  return {
    props: {}
  };
};
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://moneyblinks.com/">
        MoneyBlinks
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

function DashboardContent() {
  const [listaArchivos, setListaArchivos] = React.useState([]);
  const [open, setOpen] = React.useState(true);
  const [ACHList, setACHList] = React.useState([])
  const [usuarios, setUsuarios] = React.useState([])
  const [isLoading, setLoading] = React.useState(false)
  const [view, setView] = React.useState("")
  const toggleDrawer = () => {
    setOpen(!open);
  };
  React.useEffect(() => {
    const consulta = async () => {
      setLoading(true)
      const responseUsers = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
        type: "scan",
        tableName: "MBUser-oqkpjuho2ngvbonruy7shv26zu-pre",
      });

      // Si la solicitud es exitosa, imprimimos la respuesta del servidor
      setUsuarios(responseUsers.data.code.information)
      const response = await axios.post(
        "https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production",
        {
          type: "getInfo",
        }
      );
      const lista = response.data.code.information;
      lista.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setListaArchivos(lista);

      const txs = await axios.post(
        "https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production",
        {
          type: "getTXS",
        }
      );
      setACHList(txs.data.code)
      setLoading(false)
    };
    consulta();
  }, []);
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Tesorería MoneyBlinks
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <img src="/logo2.png" style={{ width: "64px", marginRight: 45 }} />
            <IconButton onClick={toggleDrawer}>

              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems()}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems()}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {isLoading ? (
              <div className={styles.loadingdiv}>
                <img src="/cargando.svg" width={234} />
                <span style={{ fontSize: 18, fontFamily: "sans-serif" }}>
                  Cargando, espera un momento...
                </span>
              </div>
            ) : null}
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 115,
                  }}
                >
                  Por favor, escoja entre las siguientes opciones:
                  {isLoading ? null : <Box sx={{ minWidth: 120, paddingTop: 1 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Tipo de Tesorería</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={view}
                        label="Transacciones"
                        onChange={(e) => {
                          setView(e.target.value);
                        }}
                      >
                        <MenuItem value={"ACH"}>Checkbook Transactions (ACH)</MenuItem>
                        <MenuItem value={"Bank"}>ECU Bank Generated Files</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>}
                </Paper>
              </Grid>
            </Grid>
          </Container>
          {view == "" ? null : <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 500,
                  }}
                >
                  {view === "ACH" ? <ACHTable
                    lista={ACHList}
                    usuarios={usuarios}
                  /> :
                    <BankTable
                      archivos={listaArchivos.filter(a => a.name.includes("ECU-BANK"))}
                    />}
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Home() {
  return <DashboardContent />;
}
