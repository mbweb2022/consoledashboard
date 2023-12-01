import * as React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Box from "@mui/material/Box";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Button from "@mui/material/Button";
import PendingTwoToneIcon from "@mui/icons-material/PendingTwoTone";
import { callBackend } from "../../services/BackendService";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import SyncTwoToneIcon from '@mui/icons-material/SyncTwoTone';
import Container from '@mui/material/Container';
export function BankCard(props) {
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
                                    const { data: file } = await callBackend({
                                        type: "getFiles",
                                        pathNames: [row.name],
                                    })
                                    file.code.information.forEach((element) => {
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
    const archivos = props.archivos;
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
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {archivos.length != 0 ? (
                            archivos
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
                count={archivos.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página"
            />
        </Paper>
    );
}

export function ACHCard(props) {
    const list = props.list;
    const users = props.users
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

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
                        {list.length != 0 ? (
                            list
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return <Row key={row.id} row={row} usuario={users.filter(element => element.email.S == (row.recipient == "jcmedinav@moneyblinks.com" ? row.sender : row.recipient))[0]} />;
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
                count={list.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página"
            />
        </Paper>
    )

}
export function MainCard(props) {
    const resultado = props.resultado;
    const refresh = props.refresh;
    console.log("CARGANDO RESULTADO")
    console.log(resultado)
    const [view, setView] = React.useState("")
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={12}>
                    <Paper
                        sx={{
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            height: 115,
                        }}
                    >
                        Por favor, escoja entre las siguientes opciones:
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ width: "85%" }}>
                                <Box sx={{ minWidth: 120, paddingTop: 1 }}>

                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Tipo de Tesorería</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={view}
                                            label="Transacciones"
                                            onChange={(e) => {
                                                setView(e.target.value);
                                            }}
                                        >
                                            <MenuItem value={"ACH"}>Checkbook Transactions (ACH)</MenuItem>
                                            <MenuItem value={"Bank"}>ECU Bank Generated Files</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                            </div>
                            <div style={{ alignItems: "center", justifyContent: "center" }}>
                                <Button style={{ left: 25 }} onClick={() => refresh()} variant="contained" endIcon={<SyncTwoToneIcon />}>
                                    Refrescar
                                </Button>
                            </div>
                        </div>
                    </Paper>
                    <Paper
                        sx={{
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            height: 500,
                        }}
                    >
                        {view === "ACH" && <ACHCard list={resultado.ACHList} users={resultado.Users} />}
                        {view === "Bank" && <BankCard archivos={resultado.FilesList.filter(a => a.name.includes("ECU"))} />}
                    </Paper>
                </Grid>
            </Grid>
        </Container>

    )
}
