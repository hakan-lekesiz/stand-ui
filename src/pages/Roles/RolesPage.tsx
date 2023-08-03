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
import { RolesPool, initialRolesPool, Role, RolesFilter, initialRolesFilter } from "../../models/Roles";
import { headCells } from "./head-cells";
import ConfirmDialog from "../../components/Dialogs/SoftDeleteDialog";
import AuthContext from '../../store/auth-context';
import { useNavigate } from 'react-router-dom';

const RolesPage = () => {
  const navigate = useNavigate();
  const authCtx: any = useContext(AuthContext);
  const [state, dispatch] = useStore(true);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [isInit, setIsInit] = useState<boolean>(true);
  const [filterTimeout, setFilterTimeout] = useState<any>(null);
  const [rolesPool, setRolesPool] = useState<RolesPool>(initialRolesPool);
  const [rolesFilter, setRolesFilter] = useState<RolesFilter>(initialRolesFilter);
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
      name: 'Roller'
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
  }, [rolesPool.page, rolesPool.perPage, rolesPool.sort, rolesPool.orderBy]);


  useEffect(() => {
    if (filterTimeout !== null) {
      clearTimeout(filterTimeout);
    }
    setFilterTimeout(setTimeout(function () {
      setRolesPool({
        ...rolesPool,
        page: 0
      });
      if (rolesPool.page === 0) {
        getFilteredData();
      }
    }, 250));

  }, [rolesFilter]);

  const getFilteredData = async () => {
 
    let fetchUrl = state.globals.routes.roles;
 
    if (rolesFilter.accountStatus === "0") {
      fetchUrl += ("?deleted=1");
    }
    

    const result: any = await fetch(fetchUrl)
    const resData: any = await result.json();
 
    if (result.ok) {
      let roles: Role[] = [];

      resData.map((item: any) => (
        roles.push({
          id: item.id,
          created_at: new Date(item.created_at),
          name: item.name,
          user_type: item.user_type.name,
          accountStatus: item.deleted_by === null ? "Aktif" : "Silinmiş",
        })
      ));

      setRolesPool({
        ...rolesPool,
        //totalCount: resData.total,
        items: roles
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
    setRolesPool({
      ...rolesPool,
      page: newPage
    });
  };

  const handleChangeRowsPerPage = (event: any) => {
    var perPage = parseInt(event.target.value, 10);
    setRolesPool({
      ...rolesPool,
      page: 0,
      perPage
    });
  };

  const handleEditView = (id: number, mode: string) => {
    const url = state.globals.urls[mode].replace(":id", id.toString());
    navigate(url);
  };

  const handleTextFieldChange = (event: any) => {

    setRolesFilter({
      ...rolesFilter,
      [event.target.id]: event.target.value
    });
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setRolesFilter({
      ...rolesFilter,
      [event.target.name]: event.target.value
    });
  };

  const handleClearFilter = () => {
    setRolesFilter(initialRolesFilter);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string,
  ) => {
    const isAsc = rolesPool.sort === property && rolesPool.orderBy === 'asc';

    setRolesPool({
      ...rolesPool,
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
      deleteRole();
    }
    else if (dialog.type === "restore") {
      restoreRole();
    }
  };

  const deleteRole = () => {
    let fetchUrl = state.globals.routes.roles + "/" + dialog.itemId;
    if (rolesFilter.accountStatus === "0") {
      fetchUrl = state.globals.routes.roles + "/" + dialog.itemId + "/force-delete";
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
    if (rolesFilter.accountStatus === "0") {
      setDialog(
        {
          isDialogOpen: true,
          title: "Sil",
          desc: "Rolü kalıcı olarak silmek istediğinize emin misiniz?",
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
          desc: "Rolü silmek istediğinize emin misiniz?",
          cancelText: "İptal",
          agreeText: "Evet",
          itemId: id,
          type: "delete"
        }
      );
    }

  };

  const restoreRole = () => {
    let fetchUrl = state.globals.routes.roles + "/" + dialog.itemId + "/restore";


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
        title: "Rolü Aktif Etme",
        desc: "Rolü aktif etmek istediğinize emin misiniz?",
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

      {/* <Grid container spacing={0} xs={12} md={12} lg={12}>
        
          <div className="search-area">
            <div className="filter-inputs">
             
              <FormControl
                sx={{ width: 220 }}
              >
                <InputLabel id="accountStatus-label">Durumu</InputLabel>
                <Select
                  labelId="accountStatus-label"
                  id="accountStatus"
                  name="accountStatus"
                  value={rolesFilter.accountStatus}
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
                rolesFilter.accountStatus !== "" &&
                <Button variant="contained" startIcon={<DeleteIcon />} sx={{ height: 56, marginLeft: "0!important", marginRight: "8px!important" }}
                  onClick={handleClearFilter}>
                  Temizle
                </Button>
              }
            </div>
          </div>
  
      </Grid> */}
      {
          authCtx.user.scopes.includes("role.manage") &&
          <Grid  sx={{ display: "flex", alignItems: "flex-end" }}>
            <div className="add-actions">
              <Button onClick={() => navigate(state.globals.urls.roleCreate)} variant="contained" color="success" startIcon={<Add />}>
                Rol Ekle
              </Button>
            </div>
          </Grid>
        }
      <TableContainer component={Paper}>
        <Table>

          <TableHead01 headCells={headCells} orderBy={rolesPool.orderBy} sort={rolesPool.sort} sortChange={handleRequestSort} />

          <TableBody>

            {
              !showSpinner && rolesPool.items.length > 0 &&
              rolesPool.items.map((row, index) => {
                return (

                  <TableRow key={"roles" + index}>
                    <TableCell component="th" scope="row">
                      {row.created_at.toLocaleDateString("tr")}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.name}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.user_type}
                    </TableCell> 
                    <TableCell style={{ width: 160 }}>
                      {row.accountStatus}
                    </TableCell>
                    <TableCell align="right" style={{ width: 160 }}>

                      <div style={{ display: "flex", justifyContent: "flex-end" }}>

                        {
                          authCtx.user.scopes.includes("role.manage") && rolesFilter.accountStatus !== "0" &&
                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleEditView(row.id, "roleEdit")}>
                            <EditIcon color="primary" />
                          </IconButton>
                        }
                        {
                          ( authCtx.user.scopes.includes("role.manage")) &&

                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleEditView(row.id, "roleView")}>
                            <RemoveRedEyeIcon />
                          </IconButton>
                        }
                        {
                          (authCtx.user.scopes.includes("role.manage") && rolesFilter.accountStatus === "0") &&

                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleRestore(row.id)}>
                            <AutorenewIcon color="primary" />
                          </IconButton>
                        }
                        {
                          (authCtx.user.scopes.includes("role.manage") && rolesFilter.accountStatus !== "0") &&
                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleDelete(row.id)}>
                            <DeleteIcon sx={{ color: pink[500] }} />
                          </IconButton>
                        }
                        {
                          (authCtx.user.scopes.includes("role.manage") && rolesFilter.accountStatus === "0") &&
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
              !showSpinner && rolesPool.items.length === 0 &&

              <TableRow>
                <TableCell colSpan={5}>
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
                <TableCell colSpan={5}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            }

          </TableBody>
          {/* {
            !showSpinner &&

            <TableFooter01 colSpan={5} length={rolesPool.totalCount} rowsPerPage={rolesPool.perPage} page={rolesPool.page}
              handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} disablePagination={disablePagination} />

          } */}
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

export default RolesPage
