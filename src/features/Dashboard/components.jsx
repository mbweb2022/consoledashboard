import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Fab } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import React from 'react';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
const drawerWidth = 240;

export const AppBar = styled(MuiAppBar, {
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

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
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


export function MainCard(props) {
  const loggedUser = props.loggedUser
  const resultado = props.resultado
  const navigate = props.navigate
  return (
    <>
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 350,
          }}
        ><Typography component="div">
            <Box sx={{ fontFamily: 'Monospace', fontSize: 'h6.fontSize', m: 1 }}>
              Bienvenido de nuevo, {loggedUser.fullName.S}.
            </Box>
            <Box sx={{ fontFamily: 'Monospace', fontSize: 'h6.fontSize', m: 1 }}>
              Al panel de Administrador MoneyBlinks
            </Box>
          </Typography>
          <Typography component="div">
            <Box sx={{ fontFamily: 'default', fontSize: 16, m: 1 }}>
              En los últimos 30 dias se han completado un total de {resultado.transaccionesRecientes.length} transacciones,
            </Box>
            <Box sx={{ fontFamily: 'default', fontSize: 16, m: 1 }}>
              y se han registrado una cantidad de {resultado.usuariosRegistrados} usuarios en la aplicación.
            </Box>
          </Typography>
          <Typography component="div">
            <Box sx={{ fontFamily: 'default', fontSize: 16, m: 1 }}>
              Coméntanos, ¿Qué deseas hacer?
            </Box>
          </Typography>
          <div>
            <Fab variant="extended" style={{ fontSize: 13, color: "white", maxWidth: 250, backgroundColor: "red" }} onClick={() => {
              navigate("/transacciones")
            }}>
              <ShoppingCartIcon sx={{ mr: 1 }} fontSize="small" />
              Revisar Txs
            </Fab>
            <Fab variant="extended" style={{ marginLeft: 10, fontSize: 13, color: "white", maxWidth: 250, backgroundColor: "gold" }} onClick={() => {
              navigate("/usuarios")
            }}>
              <ManageAccountsIcon sx={{ mr: 1 }} fontSize="small" />
              Evaluar Usuarios
            </Fab>
            <Fab variant="extended" style={{ marginLeft: 10, fontSize: 13, color: "white", maxWidth: 250, backgroundColor: "green" }} onClick={() => {
              navigate("/pricing")
            }}>
              <AttachMoneyIcon sx={{ mr: 1 }} fontSize="small" />
              Corregir Pricing
            </Fab>
            <Fab variant="extended" style={{ marginLeft: 10, fontSize: 13, color: "white", maxWidth: 250, backgroundColor: "purple" }} onClick={() => {
              navigate("/archivos")
            }}>
              <CloudDownloadIcon sx={{ mr: 1 }} fontSize="small" />
              Ver Archivos
            </Fab>
          </div>
        </Paper>
      </Grid>
    </>
  )
}

function Title(props) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}

export function DataCard(props) {
  const resultado = props.resultado
  const navigate = props.navigate
  return (
    <Grid item xs={12} md={4} lg={3}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 350,
        }}
      >
        <React.Fragment>
          <Title>Resumen de remesas</Title>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            En los últimos 30 días
          </Typography>
          <p></p>
          <Typography component="p" variant="h4">
            US ${resultado.moneyECUtoUSA}
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            de Ecuador a USA
          </Typography>
          <p></p>
          <Typography component="p" variant="h4">
            US ${resultado.moneyUSAtoECU}
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            de USA a Ecuador
          </Typography>
          <p></p>
          <div>
            <Link color="primary" href="#" onClick={() => {
              navigate("/transacciones")
            }}>
              Ver todas las transacciones
            </Link>
          </div>
        </React.Fragment>
      </Paper>
    </Grid>

  )
}

export function LastTxsCard(props) {
  const resultado = props.resultado
  const navigate = props.navigate
  const Users = resultado.usersList;
  function createData(id, date, name, shipTo, paymentMethod, amount) {
    return { id, date, name, shipTo, paymentMethod, amount };
  }
  const rows = []
  function preventDefault(event) {
    event.preventDefault();
  }
  const firstFive = resultado.transaccionesRecientes.slice(0, 5)
  firstFive.forEach(element => {
    const shipping = Users.find(user =>user.id.S === element.shippingID.S)
    if (element.txType.S === "UP_MONEY_CASH" || element.txType.S === "DOWN_MONEY_CASH") {
      const receipt = Users.find(user =>user.id.S === element.receiptID.S)
      rows.push(createData(element.id.S, moment(element.updatedAt.S).toDate().toISOString(), shipping.nickname.S, receipt.nickname.S, element.txType.S === "UP_MONEY_CASH" ? "Recarga de Dinero Corresponsal" : "Descarga de Dinero Corresponsal", element?.amountDeposit.N + ""))
    } else if (element.txType.S === "THIRD_ACCOUNTS" || element.txType.S === "OWN_ACCOUNTS") {
      const values = JSON.parse(element.txValues.S)
      const receipt = values.bankAccountToSend
      rows.push(createData(element.id.S, moment(element.updatedAt.S).toDate().toISOString(), shipping.nickname.S, receipt.name, element.typeTransaction.S === "AMOUNTMB" ? "SALDO MONEYBLINKS" : element.typeTransaction.S === "CARD" ? "TARJETA" : element.typeTransaction.S === "ACCOUNT" ? "CUENTA BANCARIA" : "DESCONOCIDO", element?.amountDeposit.N + ""))
    } else {
      const receipt = Users.find(user =>user.id.S === element.receiptID.S)
      rows.push(createData(element.id.S, moment(element.updatedAt.S).toDate().toISOString(), shipping.nickname.S, receipt.nickname.S, element.typeTransaction.S === "AMOUNTMB" ? "SALDO MONEYBLINKS" : element.typeTransaction.S === "CARD" ? "TARJETA" : element.typeTransaction.S === "ACCOUNT" ? "CUENTA BANCARIA" : "DESCONOCIDO", element?.amountDeposit.N + ""))
    }
  })
  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <React.Fragment>
          <Title>Transacciones Recientes</Title>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Nombre Ordenante</TableCell>
                <TableCell>Nombre Beneficiario</TableCell>
                <TableCell>Método de pago</TableCell>
                <TableCell align="right">Cantidad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.shipTo}</TableCell>
                  <TableCell>{row.paymentMethod}</TableCell>
                  <TableCell align="right">{`US $${row.amount}`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Link color="primary" href="#" onClick={() => {
            navigate("/transacciones")
          }} sx={{ mt: 3 }}>
            Ver más transacciones
          </Link>
        </React.Fragment>
      </Paper>
    </Grid>
  )
}
