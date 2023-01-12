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
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import TxsTable from '../components/TxsTable';
import moment from 'moment';
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
    const [txs, setTransacciones] = React.useState([]);
    const [buscador, setBuscador] = React.useState("");
    const [isLoading, setLoading] = React.useState(false)
    const [fromEcuador, setFromEcuador] = React.useState(false);
    const [fromUSA, setFromUSA] = React.useState(false)
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
            tableName: "MBTransaction-oqkpjuho2ngvbonruy7shv26zu-pre",
        });
        const transacciones = respuesta.data.code.information
        const resultado = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
            type: "scan",
            tableName: "MBCode-oqkpjuho2ngvbonruy7shv26zu-pre",
        });
        const codigos = resultado.data.code.information
        const today = new Date();
        const filtrado = transacciones.filter(element => getDifference(moment(element.updatedAt.S).toDate(), today) <= 100)
        const filtradoCompletado = []
        filtrado.forEach(element => {
            if (element.codeID && element.shippingID && element.receiptID && element.txType.S != "DOWN_CASH_MONEY" && element.txType.S != "UP_MONEY_CASH" && element.txType.S != "DOWN_MONEY_CASH" && element.txType.S != "UP_CASH_MONEY") {
                const codigo = codigos.filter(codigo => codigo.id.S === element.codeID.S)[0];
                if (codigo.isUsed.BOOL == true && codigo.isUserUsed.BOOL == true) {
                    
                    filtradoCompletado.push(element)
                }
            }
        })
        setTransacciones(filtradoCompletado.sort((a,b) => moment(b.updatedAt.S).toDate() - moment(a.updatedAt.S).toDate()))
        setLoading(false)
        function getDifference(date1, date2) {
            var Difference_In_Time = date2.getTime() - date1.getTime();
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            return Difference_In_Days;
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
                                            <Button style={{ backgroundColor: "red", left: 25 }} onClick={consulta} variant="contained" endIcon={<SyncTwoToneIcon />}>
                                                Refrescar
                                            </Button>
                                            <Button style={{ left: 25 * 2 }} onClick={()=>{
                                                setFromEcuador(false)
                                                setFromUSA(true)
                                            }} disabled={fromUSA} variant="contained" endIcon={<FlagCircleIcon />}>
                                                Desde USA
                                            </Button>
                                            <Button disabled={fromEcuador} style={{ backgroundColor: "gold", left: 25 * 3 }} onClick={()=>{
                                                setFromUSA(false)
                                                setFromEcuador(true)
                                            }} variant="contained" endIcon={<FlagCircleIcon />}>
                                                Desde ECU
                                            </Button>
                                            {(fromUSA || fromEcuador) ? <Button style={{ backgroundColor: "black", left: 25 * 4 }} onClick={()=>{
                                                setFromUSA(false)
                                                setFromEcuador(false)
                                            }} variant="contained" endIcon={<FlagCircleIcon />}>
                                                Reestablecer
                                            </Button> : null}
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
                                        <TxsTable busqueda={buscador} txs={fromEcuador ? txs.filter(tx => usuarios.filter(user => user.id.S === tx.shippingID.S)[0].alpha3Code.S === "ECU") : fromUSA ? txs.filter(tx => usuarios.filter(user => user.id.S === tx.shippingID.S)[0].alpha3Code.S === "USA") : txs} usuarios={usuarios} />

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