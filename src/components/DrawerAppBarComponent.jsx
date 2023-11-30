
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { AppBar, Drawer } from "../features/Dashboard/components";
import { MainListItems, SecondaryListItems } from "./ListItems";
import useDashboardContext from "../utils/contexts/DashboardContext";
import logo2 from "../assets/logo2.png"
import { useLocation, useNavigate } from "react-router-dom";
function DrawerAppBarComponent(props) {
    const location = useLocation();
    const navigation = useNavigate();
    const { openDrawer, setOpenDrawer, setLoggedUser } = useDashboardContext();
    const mdTheme = createTheme();
    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer);
    };
    return (
        <>
            <ThemeProvider theme={mdTheme}>
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <AppBar position="absolute" open={openDrawer}>
                        <Toolbar
                            sx={{
                                pr: '24px',
                            }}
                        >
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                onClick={toggleDrawer}
                                sx={{
                                    marginRight: '36px',
                                    ...(openDrawer && { display: 'none' }),
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
                                Dashboard - Inicio
                            </Typography>
                            <IconButton color="inherit" onClick={() => {
                                navigation('/login')
                                localStorage.clear();
                                setLoggedUser(null)

                            }}>
                                <ExitToAppIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <Drawer variant="permanent" open={openDrawer}>
                        <Toolbar
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                px: [1],
                            }}
                        >
                            <img src={logo2} alt="logoImage" style={{ width: "64px", marginRight: 45 }} />
                            <IconButton onClick={toggleDrawer}>

                                <ChevronLeftIcon />
                            </IconButton>
                        </Toolbar>
                        <Divider />
                        <List component="nav">
                            {MainListItems()}
                            <Divider sx={{ my: 1 }} />
                            {SecondaryListItems()}
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
                        {props.children}
                    </Box>
                </Box>
            </ThemeProvider >
        </>
    )
}

export default DrawerAppBarComponent;
