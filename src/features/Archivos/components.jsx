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
function ListCard(props) {
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
                                        type: "getFiles2",
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

    const resultado = props.resultado;
    const view = props.view;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    if(resultado == null || resultado == undefined || view.trim() === "") return null;
    const lista = resultado.FilesList.filter((a) => a.name.includes(view));

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
                        {lista.length != 0 ? (
                            lista
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
                count={lista.length}
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
                                        <InputLabel id="demo-simple-select-label">Tipo de Archivo</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={view}
                                            label="Transacciones"
                                            onChange={(e) => {
                                                setView(e.target.value);
                                            }}
                                        >
                                            <MenuItem value={"MEDICAL"}>Medical Insurance Files</MenuItem>
                                            <MenuItem value={"LIFE"}>Life Insurance Files</MenuItem>
                                            <MenuItem value={"SAPT"}>ECU Bank Central Files</MenuItem>
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
                        <ListCard resultado={resultado} view={view} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>

    )
}
