import React, { useEffect, useState, useContext } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableRow, Paper, CircularProgress, Box, Typography, Snackbar, IconButton, TextField,
  Grid, InputLabel, MenuItem, FormControl, Button, Select
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { pink } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Add from "@mui/icons-material/Add";
import { SelectChangeEvent } from '@mui/material/Select';
import TableHead01 from "../../components/Table/TableHead01";
import TableFooter01 from "../../components/Table/TableFooter01";
import { useStore } from '../../store/store';
import { ICurrentPage } from '../../models/ICurrentPage';
import { ClientsPool, initialClientsPool, Client, ClientsFilter, initialClientsFilter } from "../../models/Clients";
import { headCells } from "./head-cells";
import ConfirmDialog from "../../components/Dialogs/SoftDeleteDialog";
import AuthContext from '../../store/auth-context';
import { useNavigate } from 'react-router-dom';

const ClientsPage = () => {
  const navigate = useNavigate();
  const authCtx: any = useContext(AuthContext);
  const [state, dispatch] = useStore(true);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [isInit, setIsInit] = useState<boolean>(true);
  const [filterTimeout, setFilterTimeout] = useState<any>(null);
  const [clientsPool, setClientsPool] = useState<ClientsPool>(initialClientsPool);
  const [clientsFilter, setClientsFilter] = useState<ClientsFilter>(initialClientsFilter);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [disablePagination, setDisablePagination] = useState<boolean>(false);

  const [dialog, setDialog] = useState<any>({
    isDialogOpen: false,
    title: "",
    desc: "",
    cancelText: "",
    agreeText: "",
    itemId: 0,
    type: ""
  });

  useEffect(() => {

    const currentPage: ICurrentPage = {
      name: 'Müşteriler'
    };
    dispatch('SET_CURRENT_PAGE', currentPage);

  }, []);

  useEffect(() => {
    if (isInit) {
      setIsInit(false);
    }
    else {
      getFilteredData();
    }
  }, [clientsPool.page, clientsPool.perPage, clientsPool.sort, clientsPool.orderBy]);


  useEffect(() => {
    if (filterTimeout !== null) {
      clearTimeout(filterTimeout);
    }
    setFilterTimeout(setTimeout(function () {
      setClientsPool({
        ...clientsPool,
        page: 0
      });
      if (clientsPool.page === 0) {
        getFilteredData();
      }
    }, 250));

  }, [clientsFilter]);

  const getFilteredData = async () => {
 
    const sort = (clientsPool.orderBy === "asc" ? "-" : "") + clientsPool.sort;

    let fetchUrl = state.globals.routes.clients + "?sort=" + sort + "&page=" + (clientsPool.page + 1) + "&per_page=" + clientsPool.perPage;

    if (clientsFilter.name !== "") {
      fetchUrl += ("&name=" + clientsFilter.name);
    }
    if (clientsFilter.accountStatus === "0") {
      fetchUrl += ("&deleted=1");
    }

    const result: any = await fetch(fetchUrl)
    const resData: any = await result.json();

    if (result.ok) {
      let clients: Client[] = [];
 
      resData.data.map((item: any) => (
        clients.push({
          id: item.id,
          created_at: new Date(item.created_at),
          name: item.name,
          total_locations: item.total_locations,
          authorized_person: item.authorized_person,
          phone: item.phone,
          consultantName:item.consultant? item.consultant.name:"",
          accountStatus: item.deleted_at === null ? "Aktif" : "Silinmiş",
        })
      ));

      setClientsPool({
        ...clientsPool,
        totalCount: resData.total,
        items: clients
      });

    }
    else {
      setErrorMessage(resData.message);
      setShowError(true);
    }
    setShowSpinner(false);
    setTimeout(function () {
      setDisablePagination(false);
    }, 350);
  };

  const handleChangePage = (event: any, newPage: any) => {
    setDisablePagination(true);
    setClientsPool({
      ...clientsPool,
      page: newPage
    });
  };

  const handleChangeRowsPerPage = (event: any) => {
    var perPage = parseInt(event.target.value, 10);
    setClientsPool({
      ...clientsPool,
      page: 0,
      perPage
    });
  };

  const handleEditView = (id: number, mode: string) => {
    const url = state.globals.urls[mode].replace(":id", id.toString());
    navigate(url);
  };

  const handleTextFieldChange = (event: any) => {

    setClientsFilter({
      ...clientsFilter,
      [event.target.id]: event.target.value
    });
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setClientsFilter({
      ...clientsFilter,
      [event.target.name]: event.target.value
    });
  };

  const handleClearFilter = () => {
    setClientsFilter(initialClientsFilter);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string,
  ) => {
    const isAsc = clientsPool.sort === property && clientsPool.orderBy === 'asc';

    setClientsPool({
      ...clientsPool,
      sort: property,
      orderBy: isAsc ? 'desc' : 'asc'
    });

  };

  const confirmDialogClose = () => {
    setDialog(
      {
        isDialogOpen: false,
        title: "",
        desc: "",
        cancelText: "",
        agreeText: "",
        itemId: 0,
        type: ""
      }
    );
  };

  const confirmDialogAgree = () => {

    if (dialog.type === "delete") {
      deleteClient();
    }
    else if (dialog.type === "restore") {
      restoreClient();
    }
  };

  const deleteClient = () => {
    let fetchUrl = state.globals.routes.clients + "/" + dialog.itemId;
    if (clientsFilter.accountStatus === "0") {
      fetchUrl = state.globals.routes.clients + "/" + dialog.itemId + "/force-delete";
    }


    fetch(fetchUrl, {
      method: 'DELETE',
      headers: {
        contentType: "application/json",
        accept: "application/json"
      },
    })
      .then((res: any) => {
        getFilteredData();

        setDialog(
          {
            isDialogOpen: false,
            title: "",
            desc: "",
            cancelText: "",
            agreeText: "",
            itemId: 0,
            type: ""
          }
        );
      })


  };

  const handleDelete = (id: number) => {
    if (clientsFilter.accountStatus === "0") {
      setDialog(
        {
          isDialogOpen: true,
          title: "Sil",
          desc: "Müşteriyi kalıcı olarak silmek istediğinize emin misiniz?",
          cancelText: "İptal",
          agreeText: "Evet",
          itemId: id,
          type: "delete"
        }
      );
    }
    else {
      setDialog(
        {
          isDialogOpen: true,
          title: "Sil",
          desc: "Müşteriyi silmek istediğinize emin misiniz?",
          cancelText: "İptal",
          agreeText: "Evet",
          itemId: id,
          type: "delete"
        }
      );
    }

  };

  const restoreClient = () => {
    let fetchUrl = state.globals.routes.clients + "/" + dialog.itemId + "/restore";


    fetch(fetchUrl, {
      method: 'PUT',
      headers: {
        contentType: "application/json",
        accept: "application/json"
      },
    })
      .then((res: any) => {
        getFilteredData();

        setDialog(
          {
            isDialogOpen: false,
            title: "",
            desc: "",
            cancelText: "",
            agreeText: "",
            itemId: 0,
            type: ""
          }
        );
      })


  };

  const handleRestore = (id: number) => {
    setDialog(
      {
        isDialogOpen: true,
        title: "Müşteriyi Aktif Etme",
        desc: "Müşteriyi aktif etmek istediğinize emin misiniz?",
        cancelText: "İptal",
        agreeText: "Evet",
        itemId: id,
        type: "restore"
      }
    );

  };

  return (
    <>
      <ConfirmDialog
        title={dialog.title}
        desc={dialog.desc}
        cancelText={dialog.cancelText}
        agreeText={dialog.agreeText}
        isDialogOpen={dialog.isDialogOpen}
        agreeDialog={confirmDialogAgree}
        closeDialog={confirmDialogClose} />

      <Grid container spacing={0} xs={12} md={12} lg={12}>
       
          <div className="search-area">
            <div className="filter-inputs">
              <TextField
                id="name" label="Adı" variant="outlined"
                value={clientsFilter.name}
                onChange={handleTextFieldChange}
                sx={{ width: 220, marginRight: 1 }}
              />

              <FormControl
                sx={{ width: 220 }}
              >
                <InputLabel id="accountStatus-label">Hesap Durumu</InputLabel>
                <Select
                  labelId="accountStatus-label"
                  id="accountStatus"
                  name="accountStatus"
                  value={clientsFilter.accountStatus}
                  label="Hesap Durumu"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="">Seçiniz</MenuItem>
                  {
                    state.globals.formDatas.status.map((item: any) => {

                      return (
                        <MenuItem key={"accountStatus_" + item.id} value={item.id}>{item.title}</MenuItem>
                      )
                    })

                  }
                </Select>
              </FormControl>

            </div>
            <div className="filter-actions">
              {
                (clientsFilter.name !== "" || clientsFilter.accountStatus !== "") &&
                <Button variant="contained" startIcon={<DeleteIcon />} sx={{ height: 56, marginLeft: "0!important", marginRight: "8px!important" }}
                  onClick={handleClearFilter}>
                  Temizle
                </Button>
              }
            </div>
          </div>
 
      </Grid>

      {
          authCtx.user.scopes.includes("client.create") &&
          <Grid  sx={{ display: "flex", alignItems: "flex-end" }}>
            <div className="add-actions">
              <Button onClick={() => navigate(state.globals.urls.clientCreate)} variant="contained" color="success" startIcon={<Add />}>
                Müşteri Ekle
              </Button>
            </div>
          </Grid>
        }

      <TableContainer component={Paper}>
        <Table>

          <TableHead01 headCells={headCells} orderBy={clientsPool.orderBy} sort={clientsPool.sort} sortChange={handleRequestSort} />

          <TableBody>

            {
              !showSpinner && clientsPool.items.length > 0 &&
              clientsPool.items.map((row, index) => {
                return (

                  <TableRow key={"clients" + index}>
                    <TableCell component="th" scope="row">
                      {row.created_at.toLocaleDateString("tr")}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.name}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.total_locations}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.authorized_person}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.phone}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.consultantName}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.accountStatus}
                    </TableCell>
                    <TableCell align="right" style={{ width: 160 }}>

                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                       
                        {
                          authCtx.user.scopes.includes("client.update") && clientsFilter.accountStatus !== "0" &&
                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleEditView(row.id, "clientEdit")}>
                            <EditIcon color="primary" />
                          </IconButton>
                        }
                        {
                          (!authCtx.user.scopes.includes("client.update") && authCtx.user.scopes.includes("client.viewAny")) &&

                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleEditView(row.id, "clientView")}>
                            <RemoveRedEyeIcon />
                          </IconButton>
                        }
                        {
                          (authCtx.user.scopes.includes("client.restore") && clientsFilter.accountStatus === "0") &&

                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleRestore(row.id)}>
                            <AutorenewIcon color="primary" />
                          </IconButton>
                        }
                        {
                          (authCtx.user.scopes.includes("client.delete") && clientsFilter.accountStatus !== "0") &&
                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleDelete(row.id)}>
                            <DeleteIcon sx={{ color: pink[500] }} />
                          </IconButton>
                        }
                        {
                          (authCtx.user.scopes.includes("client.forceDelete") && clientsFilter.accountStatus === "0") &&
                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleDelete(row.id)}>
                            <DeleteIcon sx={{ color: pink[500] }} />
                          </IconButton>
                        }

                      </div>

                    </TableCell>
                  </TableRow>

                );
              })
            }
            {
              !showSpinner && clientsPool.items.length === 0 &&

              <TableRow>
                <TableCell colSpan={9}>
                  <Box sx={{ display: 'flex' }}>
                    <Typography variant="subtitle2" gutterBottom component="div">
                      Sonuç Bulunamadı.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            }


            {
              showSpinner &&
              <TableRow>
                <TableCell colSpan={9}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            }

          </TableBody>
          {
            !showSpinner &&
            <TableFooter01 colSpan={9} length={clientsPool.totalCount} rowsPerPage={clientsPool.perPage} page={clientsPool.page}
              handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage}  disablePagination={disablePagination}/>
          }
        </Table>
      </TableContainer>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={showError}
        onClose={() => setShowError(false)}
        message={errorMessage}
        key={'bottom' + 'right'}
      />
    </>
  );
}

export default ClientsPage
