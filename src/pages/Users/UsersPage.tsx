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
import { UsersPool, initialUsersPool, User, UsersFilter, initialUsersFilter } from "../../models/Users";
import { headCells } from "./head-cells";
import ConfirmDialog from "../../components/Dialogs/SoftDeleteDialog";
import AuthContext from '../../store/auth-context';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
  const navigate = useNavigate();
  const authCtx: any = useContext(AuthContext);
  const [state, dispatch] = useStore(true);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [isInit, setIsInit] = useState<boolean>(true);
  const [filterTimeout, setFilterTimeout] = useState<any>(null);
  const [usersPool, setUsersPool] = useState<UsersPool>(initialUsersPool);
  const [usersFilter, setUsersFilter] = useState<UsersFilter>(initialUsersFilter);
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
      name: 'Yetkililer'
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
  }, [usersPool.page, usersPool.perPage, usersPool.sort, usersPool.orderBy]);


  useEffect(() => {
    if (filterTimeout !== null) {
      clearTimeout(filterTimeout);
    }
    setFilterTimeout(setTimeout(function () {
      setUsersPool({
        ...usersPool,
        page: 0
      });
      if (usersPool.page === 0) {
        getFilteredData();
      }
    }, 250));

  }, [usersFilter]);

  const getFilteredData = async () => {

    const sort = (usersPool.orderBy === "asc" ? "-" : "") + usersPool.sort;

    let fetchUrl = state.globals.routes.users + "?sort=" + sort + "&page=" + (usersPool.page + 1) + "&per_page=" + usersPool.perPage;

    if (usersFilter.name !== "") {
      fetchUrl += ("&name=" + usersFilter.name);
    }
    if (usersFilter.email !== "") {
      fetchUrl += ("&email=" + usersFilter.email);
    }
    if (usersFilter.role_id !== "") {
      fetchUrl += ("&role_id=" + usersFilter.role_id);
    }
    if (usersFilter.accountStatus === "0") {
      fetchUrl += ("&deleted=1");
    }
    if (usersFilter.user_type !== "") {
      fetchUrl += ("&user_type_id=" + usersFilter.user_type);
    }

    const result: any = await fetch(fetchUrl)
    const resData: any = await result.json();

    if (result.ok) {
      let users: User[] = [];

      resData.data.map((item: any) => (
        users.push({
          id: item.id,
          created_at: new Date(item.created_at),
          name: item.name,
          phone: item.phone,
          email: item.email,
          user_type: item.user_type.name,
          role: item.roles.map((x: any) => x.name).join(", "),
          accountStatus: item.deleted_at === null ? "Aktif" : "Silinmiş",
        })
      ));

      setUsersPool({
        ...usersPool,
        totalCount: resData.total,
        items: users
      });

    }
    else {
      setErrorMessage(resData.message);
      setShowError(true);
    }

    setShowSpinner(false);
    setTimeout(function () {
      setDisablePagination(false);
    }, 300);

  };

  const handleChangePage = (event: any, newPage: any) => {
    setDisablePagination(true);
    setUsersPool({
      ...usersPool,
      page: newPage
    });
  };

  const handleChangeRowsPerPage = (event: any) => {
    var perPage = parseInt(event.target.value, 10);
    setUsersPool({
      ...usersPool,
      page: 0,
      perPage
    });
  };

  const handleEditView = (id: number, mode: string) => {
    const url = state.globals.urls[mode].replace(":id", id.toString());
    navigate(url);
  };

  const handleTextFieldChange = (event: any) => {

    setUsersFilter({
      ...usersFilter,
      [event.target.id]: event.target.value
    });
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setUsersFilter({
      ...usersFilter,
      [event.target.name]: event.target.value
    });
  };

  const handleClearFilter = () => {
    setUsersFilter(initialUsersFilter);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string,
  ) => {
    const isAsc = usersPool.sort === property && usersPool.orderBy === 'asc';

    setUsersPool({
      ...usersPool,
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
      deleteUser();
    }
    else if (dialog.type === "restore") {
      restoreUser();
    }
  };

  const deleteUser = () => {
    let fetchUrl = state.globals.routes.users + "/" + dialog.itemId;
    if (usersFilter.accountStatus === "0") {
      fetchUrl = state.globals.routes.users + "/" + dialog.itemId + "/force-delete";
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
    if (usersFilter.accountStatus === "0") {
      setDialog(
        {
          isDialogOpen: true,
          title: "Sil",
          desc: "Kullanıcıyı kalıcı olarak silmek istediğinize emin misiniz?",
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
          desc: "Kullanıcıyı silmek istediğinize emin misiniz?",
          cancelText: "İptal",
          agreeText: "Evet",
          itemId: id,
          type: "delete"
        }
      );
    }

  };

  const restoreUser = () => {
    let fetchUrl = state.globals.routes.users + "/" + dialog.itemId + "/restore";


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
        title: "Kullanıcı Aktif Etme",
        desc: "Kullanıcıyı aktif etmek istediğinize emin misiniz?",
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
                value={usersFilter.name}
                onChange={handleTextFieldChange}
                sx={{ width: 220, marginRight: 1 }}
              />
              <TextField
                id="email" label="E-Posta" variant="outlined"
                value={usersFilter.email}
                onChange={handleTextFieldChange}
                sx={{ width: 220, marginRight: 1 }}
              />

              <FormControl
                sx={{ width: 220, marginRight: 1 }}
              >
                <InputLabel id="role_id_label">Rolü</InputLabel>
                <Select
                  labelId="role_id_label"
                  id="role_id"
                  name="role_id"
                  value={usersFilter.role_id}
                  label="Rolü"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="">Seçiniz</MenuItem>

                  {
                    state.globals.formDatas.userRoles.map((item: any) => {

                      return (
                        <MenuItem key={"role_id_" + item.id} value={item.id}>{item.name}</MenuItem>
                      )
                    })

                  }

                </Select>
              </FormControl>

              <FormControl
                sx={{ width: 220, marginRight: 1 }}
              >
                <InputLabel id="user_type_label">Yetkili Türü</InputLabel>
                <Select
                  labelId="user_type_label"
                  id="user_type"
                  name="user_type"
                  value={usersFilter.user_type}
                  label="Yetkili Türü"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="">Seçiniz</MenuItem>

                  {
                    state.globals.formDatas.userTypes.map((item: any) => {

                      return (
                        <MenuItem key={"user_type_" + item.id} value={item.id}>{item.name}</MenuItem>
                      )
                    })

                  }

                </Select>
              </FormControl>

              <FormControl
                sx={{ width: 220 }}
              >
                <InputLabel id="accountStatus-label">Hesap Durumu</InputLabel>
                <Select
                  labelId="accountStatus-label"
                  id="accountStatus"
                  name="accountStatus"
                  value={usersFilter.accountStatus}
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
                (usersFilter.name !== "" || usersFilter.email !== "" || usersFilter.role_id !== "" || usersFilter.user_type !== "" || usersFilter.accountStatus !== "") &&
                <Button variant="contained" startIcon={<DeleteIcon />} sx={{ height: 56, marginLeft: "0!important", marginRight: "8px!important" }}
                  onClick={handleClearFilter}>
                  Temizle
                </Button>
              }
            </div>
          </div>
  
      </Grid>
      {
          authCtx.user.scopes.includes("user.create") &&
          <Grid  sx={{ display: "flex", alignItems: "flex-end" }}>
            <div className="add-actions">
              <Button onClick={() => navigate(state.globals.urls.userCreate)} variant="contained" color="success" startIcon={<Add />}>
                Yetkili Ekle
              </Button>
            </div>
          </Grid>
        }
      <TableContainer component={Paper}>
        <Table>

          <TableHead01 headCells={headCells} orderBy={usersPool.orderBy} sort={usersPool.sort} sortChange={handleRequestSort} />

          <TableBody>

            {
              !showSpinner && usersPool.items.length > 0 &&
              usersPool.items.map((row, index) => {
                return (

                  <TableRow key={"users" + index}>
                    <TableCell component="th" scope="row">
                      {row.created_at.toLocaleDateString("tr")}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.name}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.phone}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.email}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.user_type}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.role}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.accountStatus}
                    </TableCell>
                    <TableCell align="right" style={{ width: 160 }}>

                      <div style={{ display: "flex", justifyContent: "flex-end" }}>

                        {
                          authCtx.user.scopes.includes("user.update") && usersFilter.accountStatus !== "0" &&
                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleEditView(row.id, "userEdit")}>
                            <EditIcon color="primary" />
                          </IconButton>
                        }
                        {
                          (!authCtx.user.scopes.includes("user.update") && authCtx.user.scopes.includes("user.viewAny")) &&

                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleEditView(row.id, "userView")}>
                            <RemoveRedEyeIcon />
                          </IconButton>
                        }
                        {
                          (authCtx.user.scopes.includes("user.restore") && usersFilter.accountStatus === "0") &&

                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleRestore(row.id)}>
                            <AutorenewIcon color="primary" />
                          </IconButton>
                        }
                        {
                          (authCtx.user.scopes.includes("user.delete") && usersFilter.accountStatus !== "0") &&
                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleDelete(row.id)}>
                            <DeleteIcon sx={{ color: pink[500] }} />
                          </IconButton>
                        }
                        {
                          (authCtx.user.scopes.includes("user.forceDelete") && usersFilter.accountStatus === "0") &&
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
              !showSpinner && usersPool.items.length === 0 &&

              <TableRow>
                <TableCell colSpan={8}>
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
                <TableCell colSpan={8}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            }

          </TableBody>
          {
            !showSpinner &&

            <TableFooter01 colSpan={8} length={usersPool.totalCount} rowsPerPage={usersPool.perPage} page={usersPool.page}
              handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} disablePagination={disablePagination} />

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

export default UsersPage
