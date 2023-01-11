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
import { Fab, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import PendingTwoToneIcon from "@mui/icons-material/PendingTwoTone";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { useRouter } from "next/navigation";
import ErrorOutlineTwoToneIcon from "@mui/icons-material/ErrorOutlineTwoTone";
import VerifiedUserTwoToneIcon from "@mui/icons-material/VerifiedUserTwoTone";
import GppBadTwoToneIcon from "@mui/icons-material/GppBadTwoTone";
import moment from "moment";
function Row(props) {
    const { row, refresh } = props;
    console.log("rows activas")
    console.log(row)
    const [getter, setter] = React.useState(row.corresponsal.value.S)
    const [loadingButton, setLoadingButton] = React.useState(false)
    return (
        <React.Fragment>
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                <TableCell align="left">{row.nickname.S}</TableCell>
                <TableCell align="left">{row.fullName.S}</TableCell>
                <TableCell align="left">{row.email.S}</TableCell>
                <TableCell align="left">
                    <TextField
                        sx={{ display: "flex", justifyContent: "flex-start", width: 100 }}
                        label="Valor (USD)"
                        id="filled-size-small"
                        value={getter}
                        onChange={(event) => {
                            if (event.target.value.split(".").length > 2) {
                                return;
                            }
                            if (/^[0-9.]*$/i.test(event.target.value)) {
                                setter(event.target.value)
                            }
                        }}

                        variant="filled"
                        size="small"
                    />
                </TableCell>
                {getter === row.corresponsal.value.S ? null :
                    <TableCell align="left">
                        <Fab variant="circular" sx={{ display: "flex" }} onClick={async () => {
                            setLoadingButton(true);
                            row.corresponsal.value.S = Number(getter) + ""
                            const request = {
                                RequestItems: {
                                    ["MBCorresponsalSettings-oqkpjuho2ngvbonruy7shv26zu-pre"]: [
                                        {
                                            PutRequest: {
                                                Item: {
                                                    ...row.corresponsal,
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

                        </Fab>
                    </TableCell>}
            </TableRow>
        </React.Fragment>
    );
}

export default function CuposCorresponsalTable(props) {
    const { settings, usuarios, buscador } = props;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [key, setKey] = React.useState(1);
    const refresh = () => {
        setKey(key + 1);
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const rows = [];
    const corresponsalSettingsData = settings.filter(item => item.type == undefined)
    if (buscador == "") {
        usuarios.forEach(element => {
            const data = corresponsalSettingsData.filter(setting => setting.userId.S == element.id.S)[0]
            if (data != null) {
                element.corresponsal = data;
                rows.push(element)
            }
        });
    } else {
        usuarios.forEach(element => {
            if (element.nickname.S.includes(buscador)) {
                const data = corresponsalSettingsData.filter(setting => setting.userId.S == element.id.S)[0]
                if (data != null) {
                    element.corresponsal = data;
                    rows.push(element)
                }
            }
        })
    }

    return (
        <Paper sx={{ width: "100%" }}>
            <TableContainer sx={{ maxHeight: 440, maxWidth: 1200 }}>
                <Table key={key} aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Usuario</TableCell>
                            <TableCell align="left">Nombre</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Cupo</TableCell>
                            <TableCell> {" "} </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length != 0 ? (
                            rows

                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {

                                    return <Row key={row.id.S} row={row} refresh={refresh} />;

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
