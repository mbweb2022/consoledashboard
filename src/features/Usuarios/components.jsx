import { useInitializationDataProcess } from "../../utils/hooks/usuariosHooks";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { Modal, Space, DatePicker, Select, Tag } from "antd"
import { Select as SelectAnt, DatePicker as DatePickerAnt } from 'antd';
import dayjs from "dayjs";
import moment from "moment";
import SaveAsIcon from '@mui/icons-material/SaveAs';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import GppBadTwoToneIcon from "@mui/icons-material/GppBadTwoTone";
import DeleteIcon from '@mui/icons-material/Delete';
import PendingTwoToneIcon from "@mui/icons-material/PendingTwoTone";
import SendIcon from "@mui/icons-material/Send";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Fab, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ErrorOutlineTwoToneIcon from "@mui/icons-material/ErrorOutlineTwoTone";
import VerifiedUserTwoToneIcon from "@mui/icons-material/VerifiedUserTwoTone";
import SyncTwoToneIcon from '@mui/icons-material/SyncTwoTone';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from "react";
import DownloadIcon from '@mui/icons-material/Download';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { callBackend } from "../../services/BackendService";

const { RangePicker } = DatePicker;

export function SelectorCard(props) {
    const [buscador, setBuscador] = useState("")
    const [isVisibleModalUsers, setIsVisibleModalUsers] = React.useState(false)
    const useCustomContext = props.context;
    const resultado = props.resultado;
    const refresh = props.refresh;

    const { setInformationList } = useCustomContext();

    React.useEffect(() => {
        if (resultado != null || resultado != undefined) {
            setInformationList(resultado.usersList)
        }

    }, [resultado])
    useInitializationDataProcess(resultado, buscador, setInformationList)
    return (
        <><Grid item xs={12} md={5} lg={12}>
            <Paper
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: "100%",
                }}
            >
                <div style={{ alignItems: "center", justifyContent: "flex-start", display: "flex" }}>
                    <TextField
                        required
                        label={"Buscar por nombre"}
                        onChange={(event) => {
                            setBuscador(event.target.value + "");
                        }}
                        style={{ left: 10, }}
                        value={buscador} />
                    <Button style={{ left: 25, }} onClick={() => refresh()} variant="contained" endIcon={<SyncTwoToneIcon />}>
                        Refrescar
                    </Button>
                    <Button style={{ left: 30, backgroundColor: "mediumturquoise" }} onClick={() => setIsVisibleModalUsers(true)} variant="contained" endIcon={<DownloadIcon />}>
                        DESCARGAR
                    </Button>
                    {/*

                   pls se supone que aqui va el menu de filtro entre aprobados, rechazados, usa, ecuador, fecha...
                   */}
                </div>
            </Paper>
        </Grid><DownloadUsersModal
                isVisibleModalUsers={isVisibleModalUsers}
                setIsVisibleModalUsers={setIsVisibleModalUsers} /></>
    )
}

function Row(props) {
    const { row, verificado, financial, refresh } = props;
    const [open, setOpen] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false)
    const [loading, setLoading] = React.useState(false);
    const [getterAmount, setterAmount] = React.useState(financial.amount.N)
    const [getterBlinks, setterBlinks] = React.useState(financial.blinks.N)
    const [getterName, setterName] = React.useState(row.fullName.S)
    const [unableFinancial, setUnableFinancial] = React.useState(false)
    const [editingName, setEditingName] = React.useState(false)
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
                        const { data: deleteUser } = await callBackend({
                            type: "deleteUser",
                            username: row.nickname.S,
                        })
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
                        const { data: modifyUser } = await callBackend({
                            type: "setItem",
                            object: request,
                        })
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
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {row.identificationNumber && row.country ? <CheckCircleOutlineIcon color="primary" /> : <HighlightOffIcon color="primary" />}
                        {row.isAvailabilityTx.BOOL == true ? "APROBADO" : "RECHAZADO"}
                    </div>
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
                                Información Personal
                            </Typography>
                            <Table size="small" aria-label="info">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nombre Completo</TableCell>
                                        <TableCell>Editar/Guardar</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={row.email.S}>
                                        <TableCell component="th" scope="row">
                                            {editingName ? <TextField
                                                sx={{ display: "flex", justifyContent: "flex-start", width: 300 }}
                                                label="Nuevo Nombre Completo"
                                                id="filled-size-small"
                                                value={getterName}
                                                onChange={(event) => {
                                                    setterName(event.target.value)
                                                }}

                                                variant="filled"
                                                size="small"
                                            /> : row.fullName.S}
                                        </TableCell>
                                        <TableCell>
                                            {editingName ? <Fab
                                                variant="circular" sx={{ display: "flex" }} onClick={async () => {
                                                    setEditingName(false)
                                                    setLoading(true);
                                                    row.fullName.S = getterName + "";
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
                                                    }
                                                    await callBackend({
                                                        type: "setItem",
                                                        object: request,
                                                    })
                                                    refresh();
                                                    setLoading(false);
                                                }}>
                                                {loading ? <PendingTwoToneIcon /> : <SaveAsIcon />}

                                            </Fab> : <Fab
                                                variant="circular" sx={{ display: "flex" }} onClick={async () => {
                                                    setEditingName(true)
                                                }}>
                                                {loading ? <PendingTwoToneIcon /> : <EditIcon />}

                                            </Fab>}
                                        </TableCell>

                                    </TableRow>
                                </TableBody>
                            </Table>
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
                                                    setLoading(true);
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
                                                    await callBackend({
                                                        type: "setItem",
                                                        object: request,
                                                    })
                                                    refresh();
                                                    setLoading(false);
                                                }}>
                                                {loading ? <PendingTwoToneIcon /> : <SaveAsIcon />}

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
                                                        const { data: image } = await callBackend({
                                                            type: "getFiles",
                                                            pathNames: [
                                                                row.identificationUrl
                                                                    ? "public/" + row.identificationUrl.S
                                                                    : undefined,
                                                            ],
                                                        })
                                                        image.code.information.forEach(
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
                                                        const { data: image } = await callBackend({
                                                            type: "getFiles",
                                                            pathNames: [
                                                                row.identificationBackUrl
                                                                    ? "public/" + row.identificationBackUrl.S
                                                                    : undefined,
                                                            ],
                                                        })
                                                        image.code.information.forEach(
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
                                                        const { data: image } = await callBackend({
                                                            type: "getFiles",
                                                            pathNames: [
                                                                row.identificationUrl
                                                                    ? "public/" + row.avatarUrl.S
                                                                    : undefined,
                                                            ],
                                                        })

                                                        image.code.information.forEach(
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
                                            endIcon={loading ? <PendingTwoToneIcon /> : <VerifiedUserTwoToneIcon />}
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
                                                const parallelRequests = [
                                                    callBackend({
                                                        type: "setItem",
                                                        object: request,
                                                    }),
                                                    callBackend({
                                                        type: "emailing",
                                                        template_name: "WELCOME_EMAIL_APPROVAL_" + row.alpha3Code.S,
                                                        substitutions: {
                                                            name: row.nickname.S
                                                        },
                                                        receiver: row.email.S
                                                    })
                                                ]
                                                await Promise.all(parallelRequests);
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
                                            endIcon={loading ? <PendingTwoToneIcon /> : <GppBadTwoToneIcon />}
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
                                                await callBackend({
                                                    type: "setItem",
                                                    object: request,
                                                })
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


export function InformationCard(props) {
    const useCustomContext = props.context;
    const resultado = props.resultado;
    const refresh = props.refresh;
    const { setInformationList, informationList } = useCustomContext();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    React.useEffect(() => {
        setPage(0)
    }, [informationList])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(+event.target.value);

    };
    return (
        <Grid item xs={12} md={8} lg={12}>
            <Paper
                sx={{

                    display: 'flex',
                    flexDirection: 'column',
                    height: "100%",
                    width: "100%"
                }}
            >
                <Paper sx={{ width: "100%" }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table key={0} aria-label="collapsible table">
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
                                {informationList.length != 0 ? (
                                    informationList
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            const verificacion = resultado.usersVerified.filter(verificado => row.id.S == verificado.userID.S)
                                            return (
                                                <Row
                                                    key={row.nickname.S}
                                                    row={row}
                                                    verificado={verificacion.length == 0 ? null : verificacion[0]}
                                                    financial={resultado.financialData.filter(element => row.id.S === element.userID.S)[0] ? resultado.financialData.filter(element => row.id.S === element.userID.S)[0] : { amount: { N: 0 }, blinks: { N: 0 } }}
                                                    refresh={refresh}
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
                        count={informationList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página"
                    />
                </Paper>
            </Paper>
        </Grid>
    )
}

export const DownloadUsersModal = ({ isVisibleModalUsers, setIsVisibleModalUsers }) => {
    const [rangeDate, setRangeDate] = useState([null, null])
    const [filterValue, setFilterValue] = useState(["ALL"])
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [isNotValidForm, setIsNotValidForm] = useState(true)
    const [okText, setOkText] = useState("Generar archivo")
    const [fileUrl, setFileUrl] = useState("")

    const [filterOptions] = useState([
        {
            value: "ALL",
            label: "Todos"
        },
        {
            value: "APPROVED",
            label: "Aprobados"
        },
        {
            value: "DENIED",
            label: "Rechazados"
        }, {
            value: "USA",
            label: "Estados Unidos"
        }, {
            value: "ECU",
            label: "Ecuador"
        }
    ])
    useEffect(() => {
        setRangeDate(loadInitDate())
    }, [])
    useEffect(() => {
        if (confirmLoading) {
            setOkText("Generando")
        }
    }, [confirmLoading])
    useEffect(() => {
        if (filterValue.length > 0 && rangeDate[0] && rangeDate[1]) {
            setIsNotValidForm(false)
        } else {
            setIsNotValidForm(true)
        }
        setOkText("Generar archivo")
    }, [rangeDate, filterValue])
    const loadInitDate = () => {
        try {
            const currentTimeSeconds = (new Date().getTime() - (60000 * 10080));
            return [dayjs(new Date(currentTimeSeconds - 604800).toISOString().split("T")[0]), dayjs(new Date().toISOString().split("T")[0], 'YYYY-MM-DD')]
        } catch (e) {
            return [null, null]
        }
    }
    const handleChangeDate = (values) => {
        setOkText("Generar archivo")
        try {
            let rangeTmp = rangeDate
            if (values && values[0]) {
                rangeTmp[0] = dayjs(values[0].toISOString().split("T")[0], 'YYYY-MM-DD')
            }
            if (values && values[1]) {
                rangeTmp[1] = dayjs(values[1].toISOString().split("T")[0], 'YYYY-MM-DD')
            }
            setRangeDate(rangeTmp)
        } catch (e) {
            setRangeDate([null, null])
            console.log("error", e)
        }
    }
    const handleSelectChange = (values) => {
        if (values.includes("ALL") || (values.length == filterOptions.length - 1)) {
            setFilterValue(["ALL"])
        } else {
            setFilterValue(values)
        }
    };
    const onDownloadUserFile = async () => {
        try {
            setConfirmLoading(true);
            const { data: files } = await callBackend({
                type: "LIST_USERS_DOWNLOAD",
                startDate: rangeDate[0].toISOString().split("T")[0],
                endDate: rangeDate[1].toISOString().split("T")[0],
                filterBy: filterValue
            })
            console.log("FILESS")
            console.log(JSON.stringify(files))
            setFileUrl(files.fileUrl)

            setOkText("Descargar")
        } catch (e) {
            console.log(e)
        } finally {
            setConfirmLoading(false);
        }


    }
    return <Modal
        title="Descargar usuarios"
        open={isVisibleModalUsers}
        okText={okText}
        cancelText="Cancelar"
        onOk={okText == "Descargar" ? () => {
            window.open(fileUrl, "_blank");
        } : onDownloadUserFile}
        confirmLoading={confirmLoading}
        cancelButtonProps={{ disabled: confirmLoading }}
        okButtonProps={{ disabled: isNotValidForm }}
        onCancel={() => {
            setFilterValue(["ALL"])
            setRangeDate(loadInitDate())
            setIsVisibleModalUsers(false)
        }}
    >
        <p>Completa la siguiente información para proceder con la descarga</p>
        <Space direction="vertical" size={12} style={{ marginTop: 20 }}>
            <RangePicker
                onCalendarChange={handleChangeDate}
                value={rangeDate}
            />
            <Select
                mode="multiple"
                defaultValue={["ALL"]}
                style={{ width: '100%' }}
                onChange={handleSelectChange}
                options={filterOptions}
                value={filterValue}
            />

        </Space>
    </Modal >
}
