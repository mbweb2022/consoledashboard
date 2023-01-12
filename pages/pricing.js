import { DriveFileRenameOutline } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Button, Fab, TextField } from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import MuiAppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import axios from "axios";
import * as React from "react";
import { mainListItems, secondaryListItems } from "../components/listItems";
import styles from '../styles/Home.module.css';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import PendingTwoToneIcon from "@mui/icons-material/PendingTwoTone";
import BlinksTable from "../components/BlinksTable"
import BlinksCorrTable from "../components/BlinksCorrTable"
import CuposCorresponsalTable from "../components/CuposCorresponsalTable"
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
    const [open, setOpen] = React.useState(true);
    const [isLoading, setLoading] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [corresponsalSettings, setCorresponsalSettings] = React.useState([])
    const [comissionCor, setComissionCor] = React.useState("0.00")
    const [comissionCorText, setComissionCorText] = React.useState("0.00")
    const [loadingButton, setLoadingButton] = React.useState(false)
    const [blinkCost, setBlinkCost] = React.useState([])
    const [blinkCostCorr, setBlinkCostCorr] = React.useState([])

    const [search, setSearch] = React.useState("")
    const [users, setUsers] = React.useState([])
    const handleChange =
        (panel) => (event, isExpanded) => {
            setExpanded(isExpanded ? panel : false);
        };
    const toggleDrawer = () => {
        setOpen(!open);
    }; ''
    React.useEffect(() => {
        const consulta = async () => {
            setLoading(true);
            const corSet = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
                type: "scan",
                tableName: "MBCorresponsalSettings-oqkpjuho2ngvbonruy7shv26zu-pre",
            });

            // Si la solicitud es exitosa, imprimimos la respuesta del servidor
            setCorresponsalSettings(corSet.data.code.information)
            setComissionCor("" + parseFloat(corSet.data.code.information.filter(item => item.type && item.type.S == "TX_COMMISSION")[0].value.N).toFixed(2))
            setComissionCorText("" + parseFloat(corSet.data.code.information.filter(item => item.type && item.type.S == "TX_COMMISSION")[0].value.N).toFixed(2))


            console.log(corSet.data.code.information)
            const bCost = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
                type: "scan",
                tableName: "MBBlinkCostByPrice-oqkpjuho2ngvbonruy7shv26zu-pre",
            });
            console.log(bCost.data.code.information.sort((a, b) => parseInt(a.id.S) - parseInt(b.id.S)))
            setBlinkCost(bCost.data.code.information.sort((a, b) => parseInt(a.id.S) - parseInt(b.id.S)))




            const bCostCorr = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
                type: "scan",
                tableName: "MBCorresponsalChargues-oqkpjuho2ngvbonruy7shv26zu-pre",
            });
            console.log(bCostCorr.data.code.information.sort((a, b) => parseInt(a.id.S) - parseInt(b.id.S)))
            setBlinkCostCorr(bCostCorr.data.code.information.sort((a, b) => parseInt(a.id.S) - parseInt(b.id.S)))
            const responseUsers = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
                type: "scan",
                tableName: "MBUser-oqkpjuho2ngvbonruy7shv26zu-pre",
            });

            // Si la solicitud es exitosa, imprimimos la respuesta del servidor
            setUsers(responseUsers.data.code.information)

            setLoading(false);
        };
        consulta();
    }, []);
    function isFloat(string) {
        console.log("ENTRA " + string + " CON RESULTADO " + Number.isNaN(Number.parseFloat(string)))
        return Number.isNaN(Number.parseFloat(string));
    }
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
                            Pricing MoneyBlinks
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
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
                        ) : <Grid container spacing={3}>
                            {/* Chart */}
                            <Grid item xs={12} md={8} lg={12}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: "flex",
                                        flexDirection: "column",
                                        height: 800,
                                    }}
                                >
                                    <div>
                                        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                            <AccordionSummary
                                                expandIcon={<>{expanded !== "panel1" ? <DriveFileRenameOutline /> : null}<ExpandMoreIcon /></>}
                                                aria-controls="panel1bh-content"
                                                id="panel1bh-header"
                                            >
                                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                    Comisión Corresponsal
                                                </Typography>
                                                <Typography sx={{ color: 'text.secondary' }}>Actual: US$ {comissionCor}  {expanded !== "panel1" ? "(Click para modificar)" : ""}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    <div>
                                                        <TextField
                                                            sx={{ display: "flex", justifyContent: "flex-start", width: 125 }}
                                                            label="Valor (USD)"
                                                            id="filled-size-small"
                                                            value={comissionCorText}
                                                            onChange={(event) => {
                                                                if (event.target.value.split(".").length > 2) {
                                                                    return;
                                                                }
                                                                if (/^[0-9.]*$/i.test(event.target.value)) {
                                                                    setComissionCorText(event.target.value)
                                                                }
                                                            }}

                                                            variant="filled"
                                                            size="small"
                                                        />
                                                        <Fab variant="extended" onClick={async () => {
                                                            setLoadingButton(true);
                                                            const informacion = corresponsalSettings.filter(item => item.type && item.type.S == "TX_COMMISSION")[0]
                                                            console.log(informacion)
                                                            const request = {
                                                                RequestItems: {
                                                                    ["MBCorresponsalSettings-oqkpjuho2ngvbonruy7shv26zu-pre"]: [
                                                                        {
                                                                            PutRequest: {
                                                                                Item: {
                                                                                    ...informacion,
                                                                                    updatedAt: { S: new Date().toISOString() },
                                                                                    value: { N: Number(comissionCorText) + "" }
                                                                                },
                                                                            },
                                                                        },
                                                                    ],
                                                                },
                                                            };
                                                            const response = await axios.post(
                                                                "https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production",
                                                                {
                                                                    type: "setItem",
                                                                    object: request,
                                                                }
                                                            );
                                                            console.log(response.data)
                                                            console.log(JSON.stringify(response.data))
                                                            setComissionCor(comissionCorText)
                                                            setLoadingButton(false);
                                                            console.log("WIDTH")
                                                            console.log(window.innerWidth)
                                                        }} disabled={loadingButton ? true : comissionCor === comissionCorText ? true : isFloat(comissionCorText) ? true : false} sx={{ marginLeft: (window.innerWidth / 100) * 6, justifyContent: "flex-end" }}>
                                                            Guardar

                                                            {loadingButton ? <PendingTwoToneIcon /> : <SaveAsIcon style={{ marginLeft: 10 }} />}

                                                        </Fab>

                                                    </div>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                                            <AccordionSummary
                                                expandIcon={<>{expanded !== "panel2" ? <DriveFileRenameOutline /> : null}<ExpandMoreIcon /></>}
                                                aria-controls="panel2bh-content"
                                                id="panel2bh-header"
                                            >
                                                <Typography sx={{ width: '33%', flexShrink: 0 }}>Blinks</Typography>
                                                <Typography sx={{ color: 'text.secondary' }}>
                                                    {expanded !== "panel2" ? "(Click para modificar)" : ""}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    <BlinksTable lista={blinkCost} />
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                                            <AccordionSummary
                                                expandIcon={<>{expanded !== "panel3" ? <DriveFileRenameOutline /> : null}<ExpandMoreIcon /></>}
                                                aria-controls="panel3bh-content"
                                                id="panel3bh-header"
                                            >
                                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                    Blinks Corresponsal
                                                </Typography>
                                                <Typography sx={{ color: 'text.secondary' }}>
                                                    {expanded !== "panel3" ? "(Click para modificar)" : ""}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    <BlinksCorrTable lista={blinkCostCorr} />
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                                            <AccordionSummary
                                                expandIcon={<>{expanded !== "panel4" ? <DriveFileRenameOutline /> : null}<ExpandMoreIcon /></>}
                                                aria-controls="panel4bh-content"
                                                id="panel4bh-header"
                                            >
                                                <Typography sx={{ width: '33%', flexShrink: 0 }}>Cupos de Corresponsales</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <div style={{ alignItems: "center", justifyContent: "flex-start", display: "flex" }}>
                                                    <TextField
                                                        required
                                                        label={isLoading ? "" : "Buscar por nombre"}
                                                        onChange={(event) => {
                                                            setSearch(event.target.value)
                                                        }}
                                                        style={{ left: 10 }}
                                                    />
                                                </div>
                                                <Typography>
                                                    <CuposCorresponsalTable settings={corresponsalSettings} usuarios={users} buscador={search} />
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    </div>
                                </Paper>
                            </Grid>
                        </Grid>}

                        <Copyright sx={{ pt: 4 }} />
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default function Home() {
    return <DashboardContent />;
}
