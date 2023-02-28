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
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
function Row(props) {
  const { row } = props;
  const [loading, setLoading] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell align="left">{row.name}</TableCell>
        <TableCell align="left">{row.createdAt}</TableCell>
        <TableCell align="left">
          {(parseFloat(row.size) / 1000).toFixed(2)} KB
        </TableCell>
        <TableCell align="right">
          <Button
            style={{ paddingLeft: 0, backgroundColor: "red" }}
            disabled={loading}
            variant="contained"
            endIcon={loading ? <PendingTwoToneIcon /> : <CloudDownloadIcon />}
            onClick={async () => {
              if (!loading) {
                setLoading(true);
                const response = await axios.post(
                  "https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production",
                  {
                    type: "getFiles2",
                    pathNames: [row.name],
                  }
                );
                response.data.code.information.forEach((element) => {
                  window.open(element, "_blank");
                });
                setLoading(false);
              }
            }}
          />
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function ArchivosLifeTable(props) {
  const { archivos } = props;
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
  rows.push(...archivos);

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre del archivo</TableCell>
              <TableCell align="left">Creado el</TableCell>
              <TableCell align="left">Tamaño</TableCell>
              <TableCell align="left">Descarga</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length != 0 ? (
              rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return <Row key={row.name} row={row} />;
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
