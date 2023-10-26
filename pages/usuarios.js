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
import DownloadIcon from '@mui/icons-material/Download';
import moment from 'moment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Select as SelectAnt, DatePicker as DatePickerAnt } from 'antd';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DownloadUsersModal } from '../components/DownloadUsersModal';
import dayjs from 'dayjs';
const { RangePicker } = DatePickerAnt;
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
  const today = new Date();
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  const [usuarios, setUsuarios] = React.useState([]);
  const [verificados, setVerificados] = React.useState([]);
  const [financialData, setFinancialData] = React.useState([])
  const [filtro, setFiltered] = React.useState([])
  const [buscador, setBuscador] = React.useState("");
  const [isLoading, setLoading] = React.useState(false)
  const [aprobados, setAprobados] = React.useState(false)
  const [rechazados, setRechazados] = React.useState(false)
  const [startDate, setStartDate] = React.useState(new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()))
  const [endDate, setEndDate] = React.useState(now)
  const [rangeDate, setRangeDate] = React.useState([null, null])
  const [selectValue, setSelectValue] = React.useState("NONE")

  const [view, setView] = React.useState("")
  const [isVisibleModalUsers, setIsVisibleModalUsers] = React.useState(false)
  const [filterOptions] = React.useState([
    {
      value: "NONE",
      label: "Ninguno"
    },
    {
      value: "APPROVED",
      label: "Aprobados"
    },
    {
      value: "DENIED",
      label: "Rechazados"
    }, {
      value: "USA",
      label: "Estados Unidos"
    }, {
      value: "ECU",
      label: "Ecuador"
    }, {
      value: "DATE",
      label: "Fecha"
    }
  ])

  React.useEffect(() => {
    consulta();
  }, [])
  const consulta = async () => {
    setLoading(true);

    const requests = [
      axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
        type: "scan",
        tableName: "MBFinancialData-oqkpjuho2ngvbonruy7shv26zu-pre",
      }),
      axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
        type: "scan",
        tableName: "MBUser-oqkpjuho2ngvbonruy7shv26zu-pre",
      }),
      axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
        type: "scan",
        tableName: "MBUserVerified-oqkpjuho2ngvbonruy7shv26zu-pre",
      })
    ];

    try {
      const [financialResponse, response, respuesta] = await Promise.all(requests);

      setFinancialData(financialResponse.data.code.information);
      let arrayUsuarios = [];
      for (const user of response.data.code.information) {
        if ((user?.role?.S == "mbuser" || !user?.role) && (user?.isDeleted?.S == false || !user?.isDeleted)) {
          arrayUsuarios.push(user)
        }
      }
      console.log("usuarios filtrados ", arrayUsuarios.length)
      arrayUsuarios.sort((a, b) => moment(b.createdAt.S).toDate() - moment(a.createdAt.S).toDate());
      setUsuarios(arrayUsuarios);

      setVerificados(respuesta.data.code.information);
    } catch (error) {
      console.error(error);  // Agrega manejo de errores, por ejemplo, mostrar un mensaje al usuario.
    }

    setLoading(false);
  };


  const filtrarAprobados = async () => {
    if (rechazados) setRechazados(prevRechazados => !prevRechazados);
    setAprobados(prevAprobados => !prevAprobados);

  }
  const filtrarRechazados = async () => {
    if (aprobados) setAprobados(prevAprobados => !prevAprobados);
    setRechazados(prevRechazados => !prevRechazados);
  }

  const reestablecer = async () => {
    setRechazados(false)
    setAprobados(false)
    setView("")
  }

  React.useEffect(() => {
    if (buscador.length > 2) {
      if (buscador.includes(" ")) {
        setFiltered(Object.assign([], usuarios.filter(user => user.fullName.S.toLowerCase().includes(buscador.toLowerCase()))))
        return;
      }
      setFiltered(Object.assign([], usuarios.filter(user => user.nickname.S.toLowerCase().includes(buscador.toLowerCase()) || user.fullName.S.split(" ").some(str => str.toLowerCase().includes(buscador.toLowerCase())) || new RegExp('\\b' + buscador.toLowerCase() + "\\b").test(user.fullName.S.toLowerCase()))))
    }else{
      reestablecer()
      setFiltered([])
      setSelectValue("NONE")
      setRangeDate(Object.assign([], [null, null]))
      //handleSelectChange("NONE")
    }
   
  }, [buscador])
  const handleSelectChange = (value) => {
    if (value == "APPROVED") {
      filtrarAprobados()
      setRechazados(false)
      setView("")
    } else if (value == "DENIED") {
      filtrarRechazados()
      setAprobados(false)
      setView("")
    } else if (value == "USA") {
      setView("USA");
      setRechazados(false)
      setAprobados(false)
    } else if (value == "ECU") {
      setView("ECU");
      setRechazados(false)
      setAprobados(false)
    } else {
      reestablecer()
      setFiltered([])
      setRangeDate(Object.assign([], [null, null]))

    }
    setSelectValue(value)
    setBuscador("")
    console.log(`Selected: ${value}`);
  };
  const handleChangeDate = (values) => {
    try {
      let rangeTmp = rangeDate
      if (values && values[0]) {
        rangeTmp[0] = dayjs(values[0].toISOString().split("T")[0], 'YYYY-MM-DD')
      }
      if (values && values[1]) {
        rangeTmp[1] = dayjs(values[1].toISOString().split("T")[0], 'YYYY-MM-DD')
      }
      setRangeDate(Object.assign([], rangeTmp))
      setSelectValue("DATE")
    } catch (e) {
      setSelectValue("NONE")
      setRangeDate(Object.assign([], [null, null]))
      console.log("error", e)
    }
  }
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
                          console.log("event.target.value",event.target.value)
                          setBuscador(event.target.value+"")
                        }}
                        style={{ left: 10, }}
                        value={buscador}
                      />
                      <Button style={{ left: 25, }} onClick={consulta} variant="contained" endIcon={<SyncTwoToneIcon />}>
                        Refrescar
                      </Button>
                      <Button style={{ left: 30, backgroundColor: "mediumturquoise" }} onClick={() => setIsVisibleModalUsers(true)} variant="contained" endIcon={<DownloadIcon />}>
                        DESCARGAR
                      </Button>
                      <div >
                        <SelectAnt
                          size={"large"}
                          defaultValue="NONE"
                          onChange={handleSelectChange}
                          style={{ left: 40, width: 175 }}
                          options={filterOptions}
                          value={selectValue}
                        />
                      </div>
                      <RangePicker
                        onCalendarChange={handleChangeDate}
                        style={{
                          left: 50
                        }}
                        value={rangeDate}
                      />
                      {/* <Button style={{ left: 25, }} onClick={consulta} variant="contained" endIcon={<SyncTwoToneIcon />}>
                        Refrescar
                      </Button>
                      <Button style={{ left: 25 * 2, backgroundColor: "gold" }} onClick={filtrarAprobados} disabled={aprobados} variant="contained">
                        Aprobados
                      </Button>
                      <Button style={{ left: 25 * 3, backgroundColor: "magenta" }} onClick={filtrarRechazados} disabled={rechazados} variant="contained">
                        Rechazados
                      </Button> */}
                      {/* <FormControl style={{ left: 25 * 4, width: 100 }}>
                        <InputLabel id="demo-simple-select-label">País</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={view}
                          label="País"
                          onChange={(e) => {
                            setView(e.target.value);
                          }}
                        >
                          <MenuItem value={"USA"}>USA</MenuItem>
                          <MenuItem value={"ECU"}>ECU</MenuItem>
                        </Select>
                      </FormControl> */}
                      {/* <div style={{ paddingLeft: 30 }}>
                        <p>Fecha Inicio</p>
                        <DatePicker selected={startDate} onChange={(date) => { setStartDate(date) }} />
                      </div>
                      <div style={{ paddingLeft: 25 }}>
                        <p>Fecha Fin</p>
                        <DatePicker selected={endDate} onChange={(date) => { setEndDate(date) }} />
                      </div> */}

                      {/* {aprobados || rechazados || view.length != 0 ?
                        <Button style={{ left: 25 * 7, backgroundColor: "black" }} onClick={reestablecer} variant="contained">
                          Reestablecer
                        </Button> : null} */}
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
                    <UsersTable rangeDate={rangeDate} financial={financialData} verified={verificados} busqueda={buscador} users={usuarios} filtro={filtro} aprobados={aprobados} rechazados={rechazados} view={view} startDate={startDate} endDate={endDate} />
                  </Paper>
                </Grid>
              </Grid>
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
      <DownloadUsersModal
        isVisibleModalUsers={isVisibleModalUsers}
        setIsVisibleModalUsers={setIsVisibleModalUsers} />
    </div>
  );
}

export default function Home() {
  return <DashboardContent />;
}
