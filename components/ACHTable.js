import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TablePagination from "@mui/material/TablePagination";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import PendingTwoToneIcon from "@mui/icons-material/PendingTwoTone";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useRouter } from "next/navigation";
import ErrorOutlineTwoToneIcon from "@mui/icons-material/ErrorOutlineTwoTone";
import VerifiedUserTwoToneIcon from "@mui/icons-material/VerifiedUserTwoTone";
import GppBadTwoToneIcon from "@mui/icons-material/GppBadTwoTone";
import moment from "moment";
function Row(props) {
  const { row, usuario } = props;
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell align="left">
          {row.recipient == "jcmedinav@moneyblinks.com" ? "COBRO" : "ENVÍO"}
        </TableCell>
        <TableCell align="left">{usuario ? usuario.nickname.S : (row.recipient == "jcmedinav@moneyblinks.com" ? row.sender : row.recipient)}</TableCell>
        <TableCell align="left">{row.description}</TableCell>
        <TableCell align="left">{row.date}</TableCell>
        <TableCell align="right">{row.recipient == "jcmedinav@moneyblinks.com" ? "+" : "-"}{parseFloat(row.amount).toFixed(2)}</TableCell>
        <TableCell align="right">{row.status}</TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function ACHTable(props) {
  const { lista, usuarios } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const rows = [];
  rows.push(...lista);
  console.log("LISTAAA")
  console.log(lista)
  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Efectuador</TableCell>
              <TableCell align="left">Descripción</TableCell>
              <TableCell align="left">Fecha</TableCell>
              <TableCell align="left">Valor</TableCell>
              <TableCell align="left">Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length != 0 ? (
              rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return <Row key={row.id} row={row} usuario={usuarios.filter(element => element.email.S == (row.recipient == "jcmedinav@moneyblinks.com" ? row.sender : row.recipient))[0]} />;
                })
            ) : (
              <p style={{ paddingLeft: 25 }}>
                No se ha encontrado la información solicitada.
              </p>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
      />
    </Paper>
  );
}
