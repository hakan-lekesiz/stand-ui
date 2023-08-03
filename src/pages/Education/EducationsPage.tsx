import React, { useEffect, useState, useContext } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableRow, Paper, CircularProgress, Box, Typography, Snackbar, IconButton, TextField,
  Grid, InputLabel, MenuItem, FormControl, Button, Select, Autocomplete
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
import { EducationsPool, initialEducationsPool, Education, EducationsFilter, initialEducationsFilter } from "../../models/Educations";
import { headCells } from "./head-cells";
import ConfirmDialog from "../../components/Dialogs/SoftDeleteDialog";
import AuthContext from '../../store/auth-context';
import { useNavigate } from 'react-router-dom';

const EducationsPage = () => {
  const navigate = useNavigate();
  const authCtx: any = useContext(AuthContext);
  const [state, dispatch] = useStore(true);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [isInit, setIsInit] = useState<boolean>(true);
  const [filterTimeout, setFilterTimeout] = useState<any>(null);
  const [educationsPool, setEducationsPool] = useState<EducationsPool>(initialEducationsPool);
  const [educationsFilter, setEducationsFilter] = useState<EducationsFilter>(initialEducationsFilter);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [disablePagination, setDisablePagination] = useState<boolean>(false);
  const [clientSearchInputValue, setClientSearchInputValue] = useState<string>("");
  const [clientOptions, setClientOptions] = useState<any[]>([]);

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
      name: 'Eğitim Talebi'
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
  }, [educationsPool.page, educationsPool.perPage, educationsPool.sort, educationsPool.orderBy]);

  useEffect(() => {

    if (filterTimeout !== null) {
      clearTimeout(filterTimeout);
    }
    setFilterTimeout(setTimeout(function () {
      setEducationsPool({
        ...educationsPool,
        page: 0
      });
      if (educationsPool.page === 0) {
        getFilteredData();
      }
    }, 250));

  }, [educationsFilter]);


  useEffect(() => {
    getClients();

  }, [clientSearchInputValue]);

  const getClients = async () => {

    let fetchUrl = state.globals.routes.clients + "?name=" + clientSearchInputValue + "&sort=created_at";

    const result: any = await fetch(fetchUrl)
    const resData: any = await result.json();

    if (result.ok) {
      let clients: any[] = [];
      resData.data.map((item: any) => (
        clients.push({
          id: item.id,
          title: item.name,
        })
      ));
      setClientOptions(clients);
    }
    else {
      setClientOptions([]);
      setErrorMessage(resData.message);
      setShowError(true);
    }
  }

  const getFilteredData = async () => {

    const sort = (educationsPool.orderBy === "asc" ? "-" : "") + educationsPool.sort;

    let fetchUrl = state.globals.routes.educations + "?sort=" + sort + "&page=" + (educationsPool.page + 1) + "&per_page=" + educationsPool.perPage;
    if (educationsFilter.educationStatus === "0") {
      fetchUrl += ("&deleted=1");
    }
    if (educationsFilter.client_id !== "") {
      fetchUrl += ("&client_id=" + JSON.parse(educationsFilter.client_id).id);
    }
    if (educationsFilter.subject_id !== "") {
      fetchUrl += ("&subject_id=" + JSON.parse(educationsFilter.subject_id).id);
    }
    if (educationsFilter.status_id !== "") {
      fetchUrl += ("&status_id=" + JSON.parse(educationsFilter.status_id).id);
    }
    if (educationsFilter.description !== "") {
      fetchUrl += ("&description=" + educationsFilter.description);
    }

    const result: any = await fetch(fetchUrl)
    const resData: any = await result.json();


    if (result.ok) {
      let educations: Education[] = [];

      resData.data.map((item: any) => (
        educations.push({
          id: item.id,
          created_at: new Date(item.created_at),
          clientType: item.client.is_commercial === 1 ? "Kurumsal" : "Bireysel",
          name: item.client.name,
          city_district: "",
          subjectName: item.subject.name,
          phone: item.client.phone,
          amount: item.amount,
          educationStatus: item.status.name,
        })
      ));

      setEducationsPool({
        ...educationsPool,
        totalCount: resData.total,
        items: educations
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

    setEducationsPool({
      ...educationsPool,
      page: newPage
    });
  };

  const handleChangeRowsPerPage = (event: any) => {
    var perPage = parseInt(event.target.value, 10);
    setEducationsPool({
      ...educationsPool,
      page: 0,
      perPage
    });
  };

  const handleEditView = (id: number, mode: string) => {
    const url = state.globals.urls[mode].replace(":id", id.toString());
    navigate(url);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setEducationsFilter({
      ...educationsFilter,
      [event.target.name]: event.target.value
    });
  };

  const handleClearFilter = () => {
    setEducationsFilter(initialEducationsFilter);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string,
  ) => {
    const isAsc = educationsPool.sort === property && educationsPool.orderBy === 'asc';

    setEducationsPool({
      ...educationsPool,
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
      deleteEducation();
    }
    else if (dialog.type === "restore") {
      restoreEducation();
    }
  };

  const deleteEducation = () => {
    let fetchUrl = state.globals.routes.educations + "/" + dialog.itemId;
    if (educationsFilter.educationStatus === "0") {
      fetchUrl = state.globals.routes.educations + "/" + dialog.itemId + "/force-delete";
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
    if (educationsFilter.educationStatus === "0") {
      setDialog(
        {
          isDialogOpen: true,
          title: "Sil",
          desc: "Eğitim talebini kalıcı olarak silmek istediğinize emin misiniz?",
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
          desc: "Eğitim talebini silmek istediğinize emin misiniz?",
          cancelText: "İptal",
          agreeText: "Evet",
          itemId: id,
          type: "delete"
        }
      );
    }

  };

  const restoreEducation = () => {
    let fetchUrl = state.globals.routes.educations + "/" + dialog.itemId + "/restore";


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
        title: "Eğitim talebini Aktif Etme",
        desc: "Eğitim talebini aktif etmek istediğinize emin misiniz?",
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

          <Grid xs={12} sx={{ display: "flex" }}>

            <Grid xs={2}>

              <InputLabel>Müşteri Seç</InputLabel>

              <Autocomplete
                value={educationsFilter.client_id !== "" ? JSON.parse(educationsFilter.client_id) : null}
                onChange={(event: any, newValue: any) => {

                  setEducationsFilter({
                    ...educationsFilter,
                    client_id: newValue ? JSON.stringify(newValue) : ""
                  });

                }}
                onInputChange={(event, newInputValue) => {
                  setClientSearchInputValue(newInputValue);
                }}
                id="clients-select"
                options={clientOptions}
                getOptionLabel={(option) => option.title}
                renderOption={(props, option) => <li {...props}>{option.title}</li>}
                sx={{ width: "90%" }}
                renderInput={(params) => (
                  <TextField {...params}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'off',

                    }}

                  />
                )}

              />

            </Grid>

            <Grid xs={2}
              style={{ marginBottom: "15px" }}
            >
              <InputLabel>Eğitim Konusu</InputLabel>
              <Autocomplete
                value={educationsFilter.subject_id !== "" ? JSON.parse(educationsFilter.subject_id) : null}
                onChange={(event: any, newValue: any) => {
                  setEducationsFilter({
                    ...educationsFilter,
                    subject_id: newValue ? JSON.stringify(newValue) : ""
                  });
                }}
                id="education-subject-select"
                options={state.globals.formDatas.seminarSubjectOptions}
                getOptionLabel={(option) => option.title}
                renderOption={(props, option) => <li {...props}>{option.title}</li>}
                sx={{ width: "90%" }}
                renderInput={(params) => (
                  <TextField {...params}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password',
                    }}
                  />
                )}
            

              />
              
            </Grid>

            <Grid xs={2}
              style={{ marginBottom: "15px" }}
            >
              <InputLabel>Durum</InputLabel>
              <Autocomplete
                value={educationsFilter.status_id !== "" ? JSON.parse(educationsFilter.status_id) : null}
                onChange={(event: any, newValue: any) => {
                  setEducationsFilter({
                    ...educationsFilter,
                    status_id: newValue ? JSON.stringify(newValue) : ""
                  });
                }}
                id="status-select"
                options={state.globals.formDatas.seminarStatusOptions}
                getOptionLabel={(option) => option.title}
                renderOption={(props, option) => <li {...props}>{option.title}</li>}
                sx={{ width: "90%" }}
                renderInput={(params) => (
                  <TextField {...params}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password',
                    }}
                  />
                )}

              />

            </Grid>

            <Grid xs={2}>
              <InputLabel>
                Açıklama
              </InputLabel>
              <TextField
                sx={{ width: "90%" }}
                fullWidth
                id="name"
                name="name"
                autoComplete="off"
                value={educationsFilter.description}
                onChange={(event) => setEducationsFilter({
                  ...educationsFilter,
                  description: event.target.value
                })}

              />

            </Grid>

            <Grid xs={2}>
              <InputLabel>Silinenler</InputLabel>
              <Select
                sx={{ width: "90%" }}
                labelId="educationStatus-label"
                id="educationStatus"
                name="educationStatus"
                value={educationsFilter.educationStatus}
                onChange={handleSelectChange}
              >
                {
                  state.globals.formDatas.status.map((item: any) => {

                    return (
                      <MenuItem key={"educationStatus_" + item.id} value={item.id}>{item.title}</MenuItem>
                    )
                  })

                }
              </Select>
            </Grid>

          </Grid>

          <div className="filter-actions">
            {
              (educationsFilter.educationStatus !== "" || educationsFilter.client_id !== "" || educationsFilter.subject_id !== ""
                || educationsFilter.status_id !== "" || educationsFilter.description !== "") &&
              <Button variant="contained" startIcon={<DeleteIcon />} sx={{ height: 56, marginLeft: "0!important", marginRight: "8px!important" }}
                onClick={handleClearFilter}>
                Temizle
              </Button>
            }
          </div>
        </div>



      </Grid>
      {
        authCtx.user.scopes.includes("seminar.create") &&
        <Grid sx={{ display: "flex", alignItems: "flex-end" }}>
          <div className="add-actions">
            <Button onClick={() => navigate(state.globals.urls.educationCreate)} variant="contained" color="success" startIcon={<Add />}>
              EĞİTİM TALEBİ EKLE
            </Button>
          </div>
        </Grid>
      }
      <TableContainer component={Paper}>
        <Table>

          <TableHead01 headCells={headCells} orderBy={educationsPool.orderBy} sort={educationsPool.sort} sortChange={handleRequestSort} />

          <TableBody>

            {
              !showSpinner && educationsPool.items.length > 0 &&
              educationsPool.items.map((row, index) => {
                return (

                  <TableRow key={"educations" + index}>
                    <TableCell component="th" scope="row">
                      {row.created_at.toLocaleDateString("tr")}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.clientType}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.name}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.city_district}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.subjectName}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.phone}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {parseFloat(row.amount).toLocaleString('tr-TR')} TL
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.educationStatus}
                    </TableCell>
                    <TableCell align="right" style={{ width: 160 }}>

                      <div style={{ display: "flex", justifyContent: "flex-end" }}>

                        {
                          authCtx.user.scopes.includes("seminar.update") && educationsFilter.educationStatus !== "0" &&
                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleEditView(row.id, "educationEdit")}>
                            <EditIcon color="primary" />
                          </IconButton>
                        }
                        {
                          (!authCtx.user.scopes.includes("seminar.update") && authCtx.user.scopes.includes("seminar.viewAny")) &&

                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleEditView(row.id, "educationView")}>
                            <RemoveRedEyeIcon />
                          </IconButton>
                        }
                        {
                          (authCtx.user.scopes.includes("seminar.restore") && educationsFilter.educationStatus === "0") &&

                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleRestore(row.id)}>
                            <AutorenewIcon color="primary" />
                          </IconButton>
                        }
                        {
                          (authCtx.user.scopes.includes("seminar.delete") && educationsFilter.educationStatus !== "0") &&
                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleDelete(row.id)}>
                            <DeleteIcon sx={{ color: pink[500] }} />
                          </IconButton>
                        }
                        {
                          (authCtx.user.scopes.includes("seminar.forceDelete") && educationsFilter.educationStatus === "0") &&
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
              !showSpinner && educationsPool.items.length === 0 &&

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
            <TableFooter01 colSpan={9} length={educationsPool.totalCount} rowsPerPage={educationsPool.perPage} page={educationsPool.page}
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

export default EducationsPage
