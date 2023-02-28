import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, secondaryListItems } from '../components/listItems';
import UsersTable from "../components/UsersTable"
import TextField from '@mui/material/TextField';
import axios from "axios"
import styles from '../styles/Home.module.css';
import Button from '@mui/material/Button';
import SyncTwoToneIcon from '@mui/icons-material/SyncTwoTone';
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
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://moneyblinks.com/">
        MoneyBlinks
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [usuarios, setUsuarios] = React.useState([]);
  const [verificados, setVerificados] = React.useState([]);
  const [financialData, setFinancialData] = React.useState([])
  const [filtro, setFiltered] = React.useState([])
  const [buscador, setBuscador] = React.useState("");
  const [isLoading, setLoading] = React.useState(false)
  React.useEffect(() => {


    consulta();

  }, [])
  const consulta = async () => {
    setLoading(true)
    const response = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
      type: "scan",
      tableName: "MBUser-oqkpjuho2ngvbonruy7shv26zu-pre",
    });

    // Si la solicitud es exitosa, imprimimos la respuesta del servidor
    setUsuarios(response.data.code.information)

    const respuesta = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
      type: "scan",
      tableName: "MBUserVerified-oqkpjuho2ngvbonruy7shv26zu-pre",
    });

    // Si la solicitud es exitosa, imprimimos la respuesta del servidor
    setVerificados(respuesta.data.code.information)


    const financialResponse = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
      type: "scan",
      tableName: "MBFinancialData-oqkpjuho2ngvbonruy7shv26zu-pre",
    });
    // Si la solicitud es exitosa, imprimimos la respuesta del servidor
    setFinancialData(financialResponse.data.code.information)
    setLoading(false)
  }
  React.useEffect(() => {
    setFiltered(usuarios.filter(user => user.nickname.S.includes(buscador)))
  }, [buscador])

  return (
    <div className={isLoading ? null : null}>
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: '24px', // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
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
                Usuarios MoneyBlinks
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
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Toolbar />

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                {isLoading ? <div className={styles.loadingdiv}>
                  <img src="/cargando.svg" width={234} />
                  <span style={{ fontSize: 18, fontFamily: "sans-serif" }}>Cargando, espera un momento...</span>
                </div> : null}
                {/* Chart */}
                <Grid item xs={12} md={5} lg={12}>
                  <Paper
                    sx={{

                      display: 'flex',
                      flexDirection: 'column',
                      height: "100%",
                    }}
                  >
                    <p></p>
                    <div style={{ alignItems: "center", justifyContent: "flex-start", display: "flex" }}>
                      <TextField
                        required
                        label={isLoading ? "" : "Buscar por nombre"}
                        onChange={(event) => {
                          setBuscador(event.target.value)
                        }}
                        style={{ left: 10 }}
                      />
                      <Button style={{ left: 25 }} onClick={consulta} variant="contained" endIcon={<SyncTwoToneIcon />}>
                        Refrescar
                      </Button>
                    </div>
                    <p></p>
                  </Paper>
                </Grid>
                {/* Chart */}
                <Grid item xs={12} md={8} lg={12}>
                  <Paper
                    sx={{

                      display: 'flex',
                      flexDirection: 'column',
                      height: "100%",
                      width: "100%"
                    }}
                  >
                    <UsersTable financial={financialData} verified={verificados} busqueda={buscador} users={usuarios.filter(user => user.role.S == "mbuser" || user.role == undefined)} filtro={filtro.filter(user => user.role.S == "mbuser" || user.role == undefined)} />
                  </Paper>
                </Grid>
              </Grid>
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default function Home() {
  return <DashboardContent />;
}