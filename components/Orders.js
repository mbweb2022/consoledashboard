import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import moment from 'moment';
import { useRouter } from 'next/router';

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}


function preventDefault(event) {
  event.preventDefault();
}

export default function Orders(props) {
  const router = useRouter();
  const { txs } = props
  const rows = [
  ];
  console.log("ENTRAAA")
  console.log(txs)
  txs.forEach(element => {
    rows.push(createData(element.id.S, moment(element.updatedAt.S).toDate().toISOString(), element.shipping.nickname.S, element.receipt.nickname.S, element.typeTransaction.S === "AMOUNTMB" ? "SALDO MONEYBLINKS" : element.typeTransaction.S === "CARD" ? "TARJETA" : element.typeTransaction.S === "ACCOUNT" ? "CUENTA BANCARIA" : "DESCONOCIDO", element?.amountDeposit.N + ""))
  });
  return (
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
      <Link color="primary" href="#" onClick={()=>{
        router.push("/transacciones")
      }} sx={{ mt: 3 }}>
        Ver más transacciones
      </Link>
    </React.Fragment>
  );
}