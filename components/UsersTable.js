import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TablePagination from '@mui/material/TablePagination';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import PendingTwoToneIcon from '@mui/icons-material/PendingTwoTone';
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import { useRouter } from 'next/navigation';
import ErrorOutlineTwoToneIcon from '@mui/icons-material/ErrorOutlineTwoTone';
import VerifiedUserTwoToneIcon from '@mui/icons-material/VerifiedUserTwoTone';
import GppBadTwoToneIcon from '@mui/icons-material/GppBadTwoTone';
import moment from "moment";
function Row(props) {
  const { row, refresh } = props;
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component="th" scope="row">
          {row.nickname.S}
        </TableCell>
        <TableCell align="left">{row.email.S}</TableCell>
        <TableCell align="left">{row.phoneNumber.S}</TableCell>
        <TableCell align="left">{row.country.S}</TableCell>
        <TableCell style={{ color: "white", fontWeight: "400", backgroundColor: row.isAvailabilityTx.BOOL == true ? "green" : "red", borderRadius: 50, width: 40 }} align="center">{row.isAvailabilityTx.BOOL == true ? "APROBADO" : "RECHAZADO"}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Más información
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Nacimiento</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Dirección</TableCell>
                    <TableCell>Ciudad</TableCell>
                    <TableCell>Creado el</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.email.S}>
                    <TableCell component="th" scope="row">{row.birthDate ? moment(row.birthDate.S).format("L") : "Sin definir"}</TableCell>
                    <TableCell>{row.fullName ? row.fullName.S : "Sin definir"}</TableCell>
                    <TableCell>{row.address ? row.address.S : "Sin definir"}</TableCell>
                    <TableCell>{row.city ? row.city.S : "Sin definir"}</TableCell>
                    <TableCell>{row.createdAt ? moment(row.createdAt.S).format("L") : "Sin definir"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Grid item xs={12} md={10} lg={12}>
                <Paper
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: "100%",
                  }}
                >
                  <p></p>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {row.identificationUrl ?
                      <Button style={{ right: 75 }} disabled={loading} variant="contained" endIcon={loading ? <PendingTwoToneIcon /> : <SendIcon />} onClick={async () => {
                        if (!loading) {
                          setLoading(true)
                          const response = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
                            type: "getFiles",
                            pathNames: [
                              row.identificationUrl ? "public/" + row.identificationUrl.S : undefined,
                            ]
                          });
                          let timer = 500;
                          response.data.code.information.forEach(element => {
                            window.open(element, '_blank');
                          });
                          setLoading(false)
                        }
                      }}>
                        Ver Documento Frontal
                      </Button> :
                      <Button style={{ right: 75 }} disabled={true} variant="contained" endIcon={<ErrorOutlineTwoToneIcon />}>
                        Ver Documento Frontal
                      </Button>}

                    {row.identificationBackUrl ?
                      <Button style={{ left: 75 }} disabled={loading} variant="contained" endIcon={loading ? <PendingTwoToneIcon /> : <SendIcon />} onClick={async () => {
                        if (!loading) {
                          setLoading(true)
                          const response = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
                            type: "getFiles",
                            pathNames: [
                              row.identificationBackUrl ? "public/" + row.identificationBackUrl.S : undefined,
                            ]
                          });
                          response.data.code.information.forEach(element => {
                            window.open(element, '_blank');
                          });
                          setLoading(false)
                        }
                      }}>
                        Ver Documento Posterior
                      </Button> :
                      <Button style={{ left: 75 }} disabled={true} variant="contained" endIcon={<ErrorOutlineTwoToneIcon />}>
                        Ver Documento Posterior
                      </Button>
                    }

                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
                    <Button style={{ right: 75, backgroundColor: "lightgreen", color: row.isAvailabilityTx.BOOL ? "gray" : "black" }} disabled={row.isAvailabilityTx.BOOL} variant="contained" endIcon={<VerifiedUserTwoToneIcon />}
                      onClick={async () => {
                        setLoading(true)
                        row.isAvailabilityTx.BOOL = true
                        const request = {
                          RequestItems: {
                            ["MBUser-oqkpjuho2ngvbonruy7shv26zu-pre"]: [
                              {
                                PutRequest: {
                                  Item: {
                                    ...row,
                                    updatedAt: { S: new Date().toISOString() },
                                  }
                                }
                              }
                            ]
                          }
                        }
                        const response = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
                          type: "setItem",
                          object: request
                        });
                        refresh()
                        setLoading(false)
                      }}>
                      Aprobar usuario
                    </Button>
                    <Button style={{ left: 75, backgroundColor: "red", color: row.isAvailabilityTx.BOOL ? "white" : "darkgray" }} disabled={!row.isAvailabilityTx.BOOL} variant="contained" endIcon={<GppBadTwoToneIcon />}
                      onClick={async () => {
                        setLoading(true)
                        row.isAvailabilityTx.BOOL = false
                        const request = {
                          RequestItems: {
                            ["MBUser-oqkpjuho2ngvbonruy7shv26zu-pre"]: [
                              {
                                PutRequest: {
                                  Item: {
                                    ...row,
                                    updatedAt: { S: new Date().toISOString() },
                                  }
                                }
                              }
                            ]
                          }
                        }
                        const response = await axios.post('https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production', {
                          type: "setItem",
                          object: request
                        });
                        console.log(JSON.stringify(response.data))
                        refresh()
                        setLoading(false)
                      }}>
                      Rechazar usuario
                    </Button>
                  </div>
                  <p></p>
                </Paper>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function UsersTable(props) {
  const { users, filtro, busqueda } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [key, setKey] = React.useState(1);
  const refreshTable = () => {
    setKey(key + 1);
  }
  React.useEffect(() => {
    if (busqueda.length == 0 && users.length != 0) {
      refreshTable();
    }

  }, [busqueda])
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const rows = [];
  if (filtro.length != 0) {
    rows.push(...filtro)
  } else if (busqueda == "") {
    rows.push(...users)
  }

  return (
    <Paper sx={{ width: '100%' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table key={key} aria-label="collapsible table">
          <TableHead>
            <TableRow>

              <TableCell>Nombre de Usuario</TableCell>
              <TableCell align="left">Correo</TableCell>
              <TableCell align="left">Teléfono</TableCell>
              <TableCell align="left">País</TableCell>
              <TableCell align="left">Estado</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length != 0 ? rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <Row key={row.nickname.S} row={row} refresh={refreshTable} />)
              }) :
              <p style={{ paddingLeft: 25 }}>No se ha encontrado la información solicitada.</p>}
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