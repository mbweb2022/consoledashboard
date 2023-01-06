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
import ArchivosMedicalTable from "../components/ArchivosMedicalTable";
import styles from '../styles/Home.module.css';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import axios from "axios";
import { DriveFileRenameOutline } from "@mui/icons-material";
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
    const [isLoading, setLoading] = React.useState(false);
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [corresponsalSettings, setCorresponsalSettings] = React.useState([])
    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };
    const toggleDrawer = () => {
        setOpen(!open);
    };''
    React.useEffect(() => {
        const consulta = async () => {
            setLoading(true);
            const corresponsalSettings = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
                type: "scan",
                tableName: "MBCorresponsalSettings-oqkpjuho2ngvbonruy7shv26zu-pre",
            });

            // Si la solicitud es exitosa, imprimimos la respuesta del servidor
            setCorresponsalSettings(corresponsalSettings.data.code.information)
            console.log(corresponsalSettings.data.code.information)
            setLoading(false);
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
                            Pricing MoneyBlinks
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
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
                        ) : null}
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
                                                <Typography sx={{ color: 'text.secondary' }}>Actual: {corresponsalSettings.length == 0 ? null : corresponsalSettings.filter(item => item.type && item.type.S == "TX_COMMISSION")[0].value.N}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
                                                    Aliquam eget maximus est, id dignissim quam.
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
                                                    Última vez modificado el
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
                                                    varius pulvinar diam eros in elit. Pellentesque convallis laoreet
                                                    laoreet.
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel3bh-content"
                                                id="panel3bh-header"
                                            >
                                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                    Advanced settings
                                                </Typography>
                                                <Typography sx={{ color: 'text.secondary' }}>
                                                    Filtering has been entirely disabled for whole web server
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                                                    amet egestas eros, vitae egestas augue. Duis vel est augue.
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel4bh-content"
                                                id="panel4bh-header"
                                            >
                                                <Typography sx={{ width: '33%', flexShrink: 0 }}>Personal data</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                                                    amet egestas eros, vitae egestas augue. Duis vel est augue.
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    </div>
                                </Paper>
                            </Grid>
                        </Grid>
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
