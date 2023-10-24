import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TablePagination from "@mui/material/TablePagination";
import moment from "moment";
function Row(props) {
    const { row, shipping, receipt } = props;
    const [open, setOpen] = React.useState(false);
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

export default function TxsTable(props) {
    const { txs, usuarios, busqueda } = props;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [key, setKey] = React.useState(1);
    /*React.useEffect(() => {
        if (txs.length != 0) {
            refreshTable();
        }
    }, []);*/
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const rows = [];
    if (busqueda === "") {
        rows.push(...txs);
    } else if(busqueda.length >= 3) {
        rows.push(...txs.filter(tx => usuarios.filter(user => tx.shippingID.S === user.id.S)[0].nickname.S.includes(busqueda) || (tx.receiptID && usuarios.filter(user => tx.receiptID.S === user.id.S)[0].nickname.S.includes(busqueda))))
    }



    return (
        <Paper sx={{ width: "100%" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table key={key} aria-label="collapsible table">
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
                        {rows.length != 0 ? (
                            rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    const shipping = usuarios.filter(user => user.id.S === row.shippingID.S)[0]
                                    let receipt = undefined;
                                    if (row.txType.S === "THIRD_ACCOUNTS" || row.txType.S === "OWN_ACCOUNTS") {
                                        const data = JSON.parse(row.txValues.S)
                                        receipt = data.bankAccountToSend
                                    }else{
                                        receipt = usuarios.filter(user => user.id.S === row.receiptID.S)[0]
                                    }
                                    return (
                                        <Row
                                            key={row.id.S}
                                            row={row}
                                            shipping={shipping}
                                            receipt={receipt}
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
