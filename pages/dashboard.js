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
import Deposits from '../components/Deposits';
import Orders from '../components/Orders';
import axios from "axios"
import moment from "moment"
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
  const [USAtoECU, setUSAtoECU] = React.useState("0.000,00")
  const [ECUtoUSA, setECUtoUSA] = React.useState("0.000,00")
  const [txRecientes, setTxRecientes] = React.useState([])
  const toggleDrawer = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    const update = async () => {

      const response = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
        type: "scan",
        tableName: "MBTransaction-oqkpjuho2ngvbonruy7shv26zu-pre",
      });
      const transacciones = response.data.code.information
      const resultado = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
        type: "scan",
        tableName: "MBCode-oqkpjuho2ngvbonruy7shv26zu-pre",
      });
      const codigos = resultado.data.code.information
      const today = new Date();
      const filtrado = transacciones.filter(element => getDifference(moment(element.updatedAt.S).toDate(), today) <= 30)
      const filtradoCompletado = []
      filtrado.forEach(element => {
        if (element.codeID) {
          const codigo = codigos.filter(codigo => codigo.id.S === element.codeID.S)[0];
          if (codigo.isUsed.BOOL == true && codigo.isUserUsed.BOOL == true) {
            filtradoCompletado.push(element)
          }
        }
      })
      const responseUsuarios = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
        type: "scan",
        tableName: "MBUser-oqkpjuho2ngvbonruy7shv26zu-pre",
      });
      const usuarios = responseUsuarios.data.code.information
      const fromECUToUSA = []
      const fromUSAToECU = []
      filtradoCompletado.forEach(element => {
        const shipping = usuarios.filter(user => user.id.S === element.shippingID.S)[0]
        const receipt = usuarios.filter(user => user.id.S === element.receiptID.S)[0]
        if(shipping.alpha3Code.S === "USA" && receipt.alpha3Code.S === "ECU"){
          fromUSAToECU.push(element)
        }else if(shipping.alpha3Code.S === "ECU" && receipt.alpha3Code.S === "USA"){
          fromECUToUSA.push(element)
        }
      })
      let moneyUSAtoECU = 0
      let moneyECUtoUSA = 0
      fromUSAToECU.forEach(element => {
        moneyUSAtoECU += parseFloat(element.amountDeposit.N)
        console.log(moneyUSAtoECU)
      })
      fromECUToUSA.forEach(element => {
        moneyECUtoUSA += parseFloat(element.amountDeposit.N)
        console.log(moneyECUtoUSA)
      })
      setECUtoUSA(moneyECUtoUSA)
      setUSAtoECU(moneyUSAtoECU)
      const transacionesRecientes = []
      const ordenado = filtradoCompletado.sort((element1, element2) => moment(element2.updatedAt.S).toDate() - moment(element1.updatedAt.S).toDate())
      for(let i=0; i<5; i++){
        let object = {
          ...ordenado[i],
          shipping: usuarios.filter(user => user.id.S === ordenado[i].shippingID.S)[0],
          receipt: usuarios.filter(user => user.id.S === ordenado[i].receiptID.S)[0]
        }
        transacionesRecientes.push(object)
      }
      setTxRecientes(transacionesRecientes)
      function getDifference(date1, date2) {
        var Difference_In_Time = date2.getTime() - date1.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        return Difference_In_Days;
      }
    }
    update();
  }, [])

  return (
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
              Dashboard - Inicio
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
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 350,
                  }}
                >
                  <p>¡Bienvenido de nuevo!, Administrador de MoneyBlinks.</p>
                  <p>Paséate un poco entre todas nuestras opciones.</p>
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 350,
                  }}
                >
                  <Deposits ecu={ECUtoUSA} usa={USAtoECU} />
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Orders txs={txRecientes} />
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