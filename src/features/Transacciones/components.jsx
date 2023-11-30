import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SyncTwoToneIcon from '@mui/icons-material/SyncTwoTone';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import moment from "moment";
export function SelectorCard(props) {
    const [buscador, setBuscador] = useState("")
    const [from, setFrom] = useState("");
    const useCustomContext = props.context;
    const resultado = props.resultado;
    const refresh = props.refresh;
    const { setInformationList, informationList } = useCustomContext();

    React.useEffect(() => {
        if (resultado != null || resultado != undefined) {
            setInformationList(resultado.transaccionesRecientes)
        }

    }, [resultado])

    React.useEffect(() => {
        if (resultado != null || resultado != undefined) {
            const original = resultado.transaccionesRecientes;
            let toSend = [];
            const usuarios = resultado.usersList;
            original.forEach(element => {
                const data = JSON.parse(element.txValues.S)
                let receipt = data.bankAccountToSend
                let gettedReceipt
                if (element.receiptID) {
                    gettedReceipt = usuarios.find(user => element.receiptID.S === user.id.S);
                }

                toSend.push({
                    ...element,
                    shipping: usuarios.find(user => element.shippingID.S === user.id.S),
                    receipt: element.receiptID ? gettedReceipt ? gettedReceipt : { nickname: { S: "Desconocido" }, alpha3Code: { S: "????" } } : receipt,
                })
            })


            if (buscador.length >= 3) {
                toSend = toSend.filter(tx => (tx.shipping && (tx.shipping.nickname.S.toLowerCase().includes(buscador.toLowerCase()) || tx.shipping.fullName.S.toLowerCase().includes(buscador.toLowerCase())) || (tx.receipt && ((tx.receipt.nickname && (tx.receipt.nickname.S.toLowerCase().includes(buscador.toLowerCase()) || tx.receipt.fullName.S.toLowerCase().includes(buscador.toLowerCase()))) || tx.receipt.name && tx.receipt.name.toLowerCase().includes(buscador.toLowerCase())))))
            }
            if (from.trim().length != 0) {
                toSend = toSend.filter(tx => (tx.shipping && tx.shipping.alpha3Code.S === from.trim()))
            }
            setInformationList(toSend);
        }




    }, [resultado, buscador, from])

    return (
        <Grid item xs={12} md={5} lg={12}>
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
                            setBuscador(event.target.value)
                        }}
                        style={{ left: 10 }}
                    />
                    <Button style={{ backgroundColor: "red", left: 25 }} onClick={() => refresh()} variant="contained" endIcon={<SyncTwoToneIcon />}>
                        Refrescar
                    </Button>
                    <Button style={{ left: 25 * 2 }} onClick={() => {
                        setFrom("USA")
                    }} disabled={from === "USA"} variant="contained" endIcon={<FlagCircleIcon />}>
                        Desde USA
                    </Button>
                    <Button disabled={from === "ECU"} style={{ backgroundColor: "gold", left: 25 * 3 }} onClick={() => {
                        setFrom("ECU")
                    }} variant="contained" endIcon={<FlagCircleIcon />}>
                        Desde ECU
                    </Button>
                    {from.trim().length != 0 ? <Button style={{ backgroundColor: "black", left: 25 * 4 }} onClick={() => {
                        setFrom("")
                    }} variant="contained" endIcon={<FlagCircleIcon />}>
                        Reestablecer
                    </Button> : null}
                </div>
            </Paper>
        </Grid>

    )
}
export function InformationCard(props) {
    function Row(props) {
        const { row, shipping, receipt } = props;
        return (
            <React.Fragment>
                <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                    <TableCell align="left">{moment(row.updatedAt.S).toDate().toISOString()}</TableCell>
                    <TableCell align="left">{shipping.nickname.S} ({shipping.alpha3Code.S})</TableCell>
                    <TableCell align="left">{receipt.nickname ? receipt.nickname.S : receipt.name} ({receipt.alpha3Code ? receipt.alpha3Code.S : receipt.country})</TableCell>
                    <TableCell align="left">{row.typeTransaction ? row.typeTransaction.S === "AMOUNTMB" ? "SALDO MONEYBLINKS" : row.typeTransaction.S === "CARD" ? "TARJETA" : row.typeTransaction.S === "ACCOUNT" ? "CUENTA BANCARIA" : "DESCONOCIDO" : row.txType.S === "UP_MONEY_CASH" ? "Recarga de Dinero Corresponsal" : row.txType.S === "DOWN_MONEY_CASH" ? "Descarga de Dinero Corresponsal" : "DESCONOCIDO"}</TableCell>
                    <TableCell align="left">US ${row.amountDeposit.N} </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }

    const useCustomContext = props.context;
    const { informationList } = useCustomContext();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
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
                                    <TableCell align="left">Fecha</TableCell>
                                    <TableCell>Usuario Ordenante (País)</TableCell>
                                    <TableCell align="left">Usuario Beneficiario (País)</TableCell>
                                    <TableCell align="left">Método de Pago</TableCell>
                                    <TableCell align="left">Cantidad</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {informationList.length != 0 ? (
                                    informationList
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            return (
                                                <Row
                                                    key={row.id.S}
                                                    row={row}
                                                    shipping={row.shipping}
                                                    receipt={row.receipt}
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
