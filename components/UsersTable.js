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
import { Fab, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import ErrorOutlineTwoToneIcon from "@mui/icons-material/ErrorOutlineTwoTone";
import VerifiedUserTwoToneIcon from "@mui/icons-material/VerifiedUserTwoTone";
import GppBadTwoToneIcon from "@mui/icons-material/GppBadTwoTone";
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import moment from "moment";
import SaveAsIcon from '@mui/icons-material/SaveAs';
import FlashOnIcon from '@mui/icons-material/FlashOn';
function Row(props) {
  const { row, refresh, verificado, financial } = props;
  const [open, setOpen] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false)
  const [loading, setLoading] = React.useState(false);
  const [getterAmount, setterAmount] = React.useState(financial.amount.N)
  const [getterBlinks, setterBlinks] = React.useState(financial.blinks.N)
  const [unableFinancial, setUnableFinancial] = React.useState(false)
  const [loadingButton, setLoadingButton] = React.useState(false)
  return (
    <React.Fragment>
      <Dialog
        open={unableFinancial}
        onClose={() => { setUnableFinancial(false) }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¡Se encontró un error!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{"Hubo un error con el correspondiente usuario seleccionado, no se pudo encontrar la información financiera del mismo dentro de la base de datos, por lo tanto, no se podrá actualizar sus finanzas en caso de quererlas modificar."}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={async () => {
            setUnableFinancial(false)

          }} autoFocus>
            Está bien
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openAlert}
        onClose={() => { setOpenAlert(false) }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Estás seguro de esto?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{"Una vez indiques que quieres eliminar al usuario(a) correspondientemente seleccionado, no volverá a ser encontrado dentro de este sistema. Además, se cerrarán todas las sesiones en los dispositivos actualmente conectados del usuario dentro de la aplicación."}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenAlert(false) }}>No estoy seguro</Button>
          <Button onClick={async () => {
            setLoading(true)
            setOpenAlert(false)
            const response2 = await axios.post(
              "https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production",
              {
                type: "deleteUser",
                username: row.nickname.S,
              }
            );
            console.log("RESPUESTA 2")
            console.log(response2)
            console.log(JSON.stringify(response2))
            row.isAvailabilityTx.BOOL = false;
            row.email.S = row.email.S + "ELIMINADO"
            row.nickname.S = row.nickname.S + " ELIMINADO"
            row.phoneNumber.S = row.phoneNumber.S + " ELIMINADO"
            row.isDeleted = { BOOL: true };
            const request = {
              RequestItems: {
                ["MBUser-oqkpjuho2ngvbonruy7shv26zu-pre"]: [
                  {
                    PutRequest: {
                      Item: {
                        ...row,
                        updatedAt: { S: new Date().toISOString() },
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
            console.log("RESPUESTA 1")
            console.log(response)
            console.log(JSON.stringify(response))
            refresh();
            setLoading(false)

          }} autoFocus>
            Estoy seguro
          </Button>
        </DialogActions>
      </Dialog>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell component="th" scope="row">
          {row.fullName.S}
        </TableCell>
        <TableCell align="left">{row.nickname.S}</TableCell>
        <TableCell align="left">{row.email.S}</TableCell>
        <TableCell align="left">{row.phoneNumber.S}</TableCell>
        <TableCell>
          {row.createdAt
            ? moment(row.createdAt.S).format("L")
            : "Sin definir"}
        </TableCell>
        <TableCell
          style={{
            color: row.isAvailabilityTx.BOOL == true ? "green" : "red",
            fontWeight: "400",
            width: 40,
          }}
          align="center"
        >
          {row.isAvailabilityTx.BOOL == true ? "APROBADO" : "RECHAZADO"}
        </TableCell>
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
              <Table size="small" aria-label="info">
                <TableHead>
                  <TableRow>
                    <TableCell>Nacimiento</TableCell>
                    <TableCell>País</TableCell>
                    <TableCell>Dirección</TableCell>
                    <TableCell>Ciudad</TableCell>
                    <TableCell>Tipo de Documentación</TableCell>
                    <TableCell>Documentación</TableCell>
                    <TableCell>Creado el</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.email.S}>
                    <TableCell component="th" scope="row">
                      {row.birthDate
                        ? moment(row.birthDate.S).format("L")
                        : "Sin definir"}
                    </TableCell>
                    <TableCell>
                      {row.country ? row.country.S : "Sin definir"}
                    </TableCell>
                    <TableCell>
                      {row.address ? row.address.S : "Sin definir"}
                    </TableCell>
                    <TableCell>
                      {row.city ? row.city.S : "Sin definir"}
                    </TableCell>
                    <TableCell>
                      {row.identificationType ? row.identificationType.S : "Sin definir"}
                    </TableCell>
                    <TableCell>
                      {row.identificationNumber ? row.identificationNumber.S : "Sin definir"}
                    </TableCell>
                    <TableCell>
                      {row.createdAt
                        ? moment(row.createdAt.S).format("L")
                        : "Sin definir"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table size="small" aria-label="verification">
                <TableHead>
                  <TableRow>
                    <TableCell>API</TableCell>
                    <TableCell>Workflow ID</TableCell>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Tipo de verificación</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Mensaje</TableCell>
                    <TableCell>Actualizado el</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.email.S}>
                    <TableCell component="th" scope="row">
                      {verificado ? verificado.verifiedBy.S : "Indefinido"}
                    </TableCell>
                    <TableCell>
                      {verificado ? verificado.workflowID.S : "Indefinido"}
                    </TableCell>
                    <TableCell>
                      {verificado ? verificado.transactionID.S : "Indefinido"}
                    </TableCell>
                    <TableCell>
                      {verificado ? verificado.typeVerification.S : "Indefinido"}
                    </TableCell>
                    <TableCell>
                      {verificado ? verificado.status.S : "Indefinido"}
                    </TableCell>
                    <TableCell>
                      {verificado ? verificado.apiResultMessage.S : "Indefinido"}
                    </TableCell>
                    <TableCell>
                      {verificado ? moment(verificado.updatedAt.S).format("L") : "Indefinido"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Typography variant="h6" gutterBottom component="div">
                Datos Financieros
              </Typography>
              <Table size="small" aria-label="info">
                <TableHead>
                  <TableRow>
                    <TableCell>Saldo Moneyblinks Actual</TableCell>
                    <TableCell>Blinks Actuales</TableCell>
                    <TableCell>Guardar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.email.S}>
                    <TableCell component="th" scope="row">
                      <TextField
                        sx={{ display: "flex", justifyContent: "flex-start", width: 100 }}
                        label="Valor (USD)"
                        id="filled-size-small"
                        value={getterAmount}
                        onChange={(event) => {
                          if (event.target.value.split(".").length > 2) {
                            return;
                          }
                          if (/^[0-9.]*$/i.test(event.target.value)) {
                            setterAmount(event.target.value)
                          }
                        }}

                        variant="filled"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        sx={{ display: "flex", justifyContent: "flex-start", width: 100 }}
                        label="Valor"
                        id="filled-size-small"
                        value={getterBlinks}
                        onChange={(event) => {
                          if (event.target.value.split(".").length > 2) {
                            return;
                          }
                          if (/^[0-9.]*$/i.test(event.target.value)) {
                            setterBlinks(event.target.value)
                          }
                        }}

                        variant="filled"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {financial.id ? <Fab
                        disabled={false}
                        variant="circular" sx={{ display: "flex" }} onClick={async () => {
                          setLoadingButton(true);
                          financial.amount.N = Number(getterAmount) + ""
                          financial.blinks.N = Number(getterBlinks) + ""
                          const request = {
                            RequestItems: {
                              ["MBFinancialData-oqkpjuho2ngvbonruy7shv26zu-pre"]: [
                                {
                                  PutRequest: {
                                    Item: {
                                      ...financial,
                                      updatedAt: { S: new Date().toISOString() },
                                    },
                                  },
                                },
                              ],
                            },
                          }
                          const response = await axios.post(
                            "https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production",
                            {
                              type: "setItem",
                              object: request,
                            }
                          );
                          refresh();
                          setLoadingButton(false);
                        }}>
                        {loadingButton ? <PendingTwoToneIcon /> : <SaveAsIcon />}

                      </Fab> :
                        <Fab

                          variant="circular" sx={{ display: "flex" }} onClick={async () => {
                            setUnableFinancial(true)
                          }}>
                          {<FlashOnIcon style={{ color: "red" }} />}

                        </Fab>}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Grid item xs={12} md={10} lg={12}>
                <Paper
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <p></p>
                  <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
                    {row.identificationUrl ? (
                      <Button
                        style={{ right: 75 }}
                        disabled={loading}
                        variant="contained"
                        endIcon={
                          loading ? <PendingTwoToneIcon /> : <SendIcon />
                        }
                        onClick={async () => {
                          if (!loading) {
                            setLoading(true);
                            const response = await axios.post(
                              "https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production",
                              {
                                type: "getFiles",
                                pathNames: [
                                  row.identificationUrl
                                    ? "public/" + row.identificationUrl.S
                                    : undefined,
                                ],
                              }
                            );
                            let timer = 500;
                            response.data.code.information.forEach(
                              (element) => {
                                window.open(element, "_blank");
                              }
                            );
                            setLoading(false);
                          }
                        }}
                      >
                        Ver Documento Frontal
                      </Button>
                    ) : (
                      <Button
                        style={{ right: 75 }}
                        disabled={true}
                        variant="contained"
                        endIcon={<ErrorOutlineTwoToneIcon />}
                      >
                        Ver Documento Frontal
                      </Button>
                    )}

                    {row.identificationBackUrl ? (
                      <Button
                        style={{ left: 75 }}
                        disabled={loading}
                        variant="contained"
                        endIcon={
                          loading ? <PendingTwoToneIcon /> : <SendIcon />
                        }
                        onClick={async () => {
                          if (!loading) {
                            setLoading(true);
                            const response = await axios.post(
                              "https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production",
                              {
                                type: "getFiles",
                                pathNames: [
                                  row.identificationBackUrl
                                    ? "public/" + row.identificationBackUrl.S
                                    : undefined,
                                ],
                              }
                            );
                            response.data.code.information.forEach(
                              (element) => {
                                window.open(element, "_blank");
                              }
                            );
                            setLoading(false);
                          }
                        }}
                      >
                        Ver Documento Posterior
                      </Button>
                    ) : (
                      <Button
                        style={{ left: 75 }}
                        disabled={true}
                        variant="contained"
                        endIcon={<ErrorOutlineTwoToneIcon />}
                      >
                        Ver Documento Posterior
                      </Button>
                    )}
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: 10,
                  }}>
                    {row.avatarUrl ? (
                      <Button
                        style={{ right: 75 }}
                        disabled={loading}
                        variant="contained"
                        endIcon={
                          loading ? <PendingTwoToneIcon /> : <SendIcon />
                        }
                        onClick={async () => {
                          if (!loading) {
                            setLoading(true);
                            const response = await axios.post(
                              "https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production",
                              {
                                type: "getFiles",
                                pathNames: [
                                  row.identificationUrl
                                    ? "public/" + row.avatarUrl.S
                                    : undefined,
                                ],
                              }
                            );
                            let timer = 500;
                            response.data.code.information.forEach(
                              (element) => {
                                window.open(element, "_blank");
                              }
                            );
                            setLoading(false);
                          }
                        }}
                      >
                        Ver Foto de Perfil
                      </Button>
                    ) : (
                      <Button
                        style={{ right: 75 }}
                        disabled={true}
                        variant="contained"
                        endIcon={<ErrorOutlineTwoToneIcon />}
                      >
                        Ver Foto de Perfil
                      </Button>
                    )}
                    <Button
                      style={{ left: 75, backgroundColor: "red" }}
                      disabled={loading}
                      variant="contained"

                      endIcon={
                        loading ? <PendingTwoToneIcon /> : <DeleteIcon />
                      }
                      onClick={async () => {
                        setOpenAlert(true)
                      }}
                    >
                      Eliminar Usuario
                    </Button>

                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: 10,
                      paddingBottom: 15,
                    }}
                  >
                    <Button
                      style={{
                        right: 75,
                        backgroundColor: "lightgreen",
                        color: row.isAvailabilityTx.BOOL ? "gray" : "black",
                      }}
                      disabled={row.isAvailabilityTx.BOOL}
                      variant="contained"
                      endIcon={<VerifiedUserTwoToneIcon />}
                      onClick={async () => {
                        setLoading(true);
                        row.isAvailabilityTx.BOOL = true;
                        const request = {
                          RequestItems: {
                            ["MBUser-oqkpjuho2ngvbonruy7shv26zu-pre"]: [
                              {
                                PutRequest: {
                                  Item: {
                                    ...row,
                                    updatedAt: { S: new Date().toISOString() },
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
                        refresh();
                        setLoading(false);
                      }}
                    >
                      Aprobar usuario
                    </Button>
                    <Button
                      style={{
                        left: 75,
                        backgroundColor: "red",
                        color: row.isAvailabilityTx.BOOL ? "white" : "darkgray",
                      }}
                      disabled={!row.isAvailabilityTx.BOOL}
                      variant="contained"
                      endIcon={<GppBadTwoToneIcon />}
                      onClick={async () => {
                        setLoading(true);
                        row.isAvailabilityTx.BOOL = false;
                        const request = {
                          RequestItems: {
                            ["MBUser-oqkpjuho2ngvbonruy7shv26zu-pre"]: [
                              {
                                PutRequest: {
                                  Item: {
                                    ...row,
                                    updatedAt: { S: new Date().toISOString() },
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
                        console.log(JSON.stringify(response.data));
                        refresh();
                        setLoading(false);
                      }}
                    >
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
  const { users, filtro, busqueda, verified, financial } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [key, setKey] = React.useState(1);
  const refreshTable = () => {
    setKey(key + 1);
  };
  React.useEffect(() => {
    if (busqueda.length == 0 && users.length != 0) {
      refreshTable();
    }
  }, [busqueda]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const rows = [];
  if (filtro.length != 0) {
    rows.push(...filtro);
  } else if (busqueda == "") {
    rows.push(...users);
  }

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table key={key} aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre Completo</TableCell>
              <TableCell align="left">Usuario</TableCell>
              <TableCell align="left">Correo</TableCell>
              <TableCell align="left">Teléfono</TableCell>
              <TableCell align="left">Registrado el</TableCell>
              <TableCell align="left">Estado</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length != 0 ? (
              rows
                .filter(element => element.isDeleted === undefined)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const verificacion = verified.filter(verificado => row.id.S == verificado.userID.S)
                  console.log("PASANDO USUARIO")
                  console.log(row)
                  return (
                    <Row
                      key={row.nickname.S}
                      row={row}
                      verificado={verificacion.length == 0 ? null : verificacion[0]}
                      financial={financial.filter(element => row.id.S === element.userID.S)[0] ? financial.filter(element => row.id.S === element.userID.S)[0] : { amount: { N: 0 }, blinks: { N: 0 } }}
                      refresh={refreshTable}
                    />
                  );
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
