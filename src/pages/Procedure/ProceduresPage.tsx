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
import { ProceduresPool, initialProceduresPool, Procedure, ProceduresFilter, initialProceduresFilter } from "../../models/Procedures";
import { headCells } from "./head-cells";
import ConfirmDialog from "../../components/Dialogs/SoftDeleteDialog";
import AuthContext from '../../store/auth-context';
import { useNavigate } from 'react-router-dom';

const ProceduresPage = () => {
  const navigate = useNavigate();
  const authCtx: any = useContext(AuthContext);
  const [state, dispatch] = useStore(true);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [isInit, setIsInit] = useState<boolean>(true);
  const [filterTimeout, setFilterTimeout] = useState<any>(null);
  const [proceduresPool, setProceduresPool] = useState<ProceduresPool>(initialProceduresPool);
  const [proceduresFilter, setProceduresFilter] = useState<ProceduresFilter>(initialProceduresFilter);
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
      name: 'Prosedürler'
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
  }, [proceduresPool.page, proceduresPool.perPage, proceduresPool.sort, proceduresPool.orderBy]);


  useEffect(() => {
    if (filterTimeout !== null) {
      clearTimeout(filterTimeout);
    }
    setFilterTimeout(setTimeout(function () {
      setProceduresPool({
        ...proceduresPool,
        page: 0
      });
      if (proceduresPool.page === 0) {
        getFilteredData();
      }
    }, 250));

  }, [proceduresFilter]);

  const getFilteredData = async () => {
 
    const sort = (proceduresPool.orderBy === "asc" ? "-" : "") + proceduresPool.sort;

    let fetchUrl = state.globals.routes.procedures + "?sort=" + sort + "&page=" + (proceduresPool.page + 1) + "&per_page=" + proceduresPool.perPage;
 
    if (proceduresFilter.procedureStatus === "0") {
      fetchUrl += ("&deleted=1");
    }
     
    const result: any = await fetch(fetchUrl)
    const resData: any = await result.json();
    
    if (result.ok) {
      let procedures: Procedure[] = [];

      resData.data.map((item: any) => (
        procedures.push({
          id: item.id, 
          name: item.name,
          accreditation: item.accreditation.name,
          standard: item.standard.name
        })
      ));

      setProceduresPool({
        ...proceduresPool,
        totalCount: resData.total,
        items: procedures
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
    setProceduresPool({
      ...proceduresPool,
      page: newPage
    });
  };

  const handleChangeRowsPerPage = (event: any) => {
    var perPage = parseInt(event.target.value, 10);
    setProceduresPool({
      ...proceduresPool,
      page: 0,
      perPage
    });
  };

  const handleEditView = (id: number, mode: string) => {
    const url = state.globals.urls[mode].replace(":id", id.toString());
    navigate(url);
  };
 
  const handleSelectChange = (event: SelectChangeEvent) => {
    setProceduresFilter({
      ...proceduresFilter,
      [event.target.name]: event.target.value
    });
  };

  const handleClearFilter = () => {
    setProceduresFilter(initialProceduresFilter);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string,
  ) => {
    const isAsc = proceduresPool.sort === property && proceduresPool.orderBy === 'asc';

    setProceduresPool({
      ...proceduresPool,
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
      deleteProcedure();
    }
    else if (dialog.type === "restore") {
      restoreProcedure();
    }
  };

  const deleteProcedure = () => {
    let fetchUrl = state.globals.routes.procedures + "/" + dialog.itemId;
    if (proceduresFilter.procedureStatus === "0") {
      fetchUrl = state.globals.routes.procedures + "/" + dialog.itemId + "/force-delete";
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
    if (proceduresFilter.procedureStatus === "0") {
      setDialog(
        {
          isDialogOpen: true,
          title: "Sil",
          desc: "Prosedürü kalıcı olarak silmek istediğinize emin misiniz?",
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
          desc: "Prosedürü silmek istediğinize emin misiniz?",
          cancelText: "İptal",
          agreeText: "Evet",
          itemId: id,
          type: "delete"
        }
      );
    }

  };

  const restoreProcedure = () => {
    let fetchUrl = state.globals.routes.procedures + "/" + dialog.itemId + "/restore";


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
        title: "Prosedür Aktif Etme",
        desc: "Prosedürü aktif etmek istediğinize emin misiniz?",
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
                
              <FormControl
                sx={{ width: 220 }}
              >
                <InputLabel id="procedureStatus-label">Durumu</InputLabel>
                <Select
                  labelId="procedureStatus-label"
                  id="procedureStatus"
                  name="procedureStatus"
                  value={proceduresFilter.procedureStatus}
                  label="Durumu"
                  onChange={handleSelectChange}
                >
                <MenuItem value="">Seçiniz</MenuItem>
              {
                state.globals.formDatas.status.map((item: any) => {

                  return (
                    <MenuItem key={"procedureStatus_" + item.id} value={item.id}>{item.title}</MenuItem>
                  )
                })

              }
                </Select>
              </FormControl>

            </div>
            <div className="filter-actions">
              {
                (proceduresFilter.procedureStatus !== "") &&
                <Button variant="contained" startIcon={<DeleteIcon />} sx={{ height: 56, marginLeft: "0!important", marginRight: "8px!important" }}
                  onClick={handleClearFilter}>
                  Temizle
                </Button>
              }
            </div>
          </div>
 
       

      </Grid>
      {
          authCtx.user.scopes.includes("procedure_definition.create") &&
          <Grid  sx={{ display: "flex", alignItems: "flex-end" }}>
            <div className="add-actions">
              <Button onClick={() => navigate(state.globals.urls.procedureCreate)} variant="contained" color="success" startIcon={<Add />}>
              PROSEDÜR EKLE
              </Button>
            </div>
          </Grid>
        }
      <TableContainer component={Paper}>
        <Table>

          <TableHead01 headCells={headCells} orderBy={proceduresPool.orderBy} sort={proceduresPool.sort} sortChange={handleRequestSort} />

          <TableBody>

            {
              !showSpinner && proceduresPool.items.length > 0 &&
              proceduresPool.items.map((row, index) => {
                return (

                  <TableRow key={"procedures" + index}>
                    <TableCell component="th" scope="row">
                      {row.accreditation}
                    </TableCell>
                    <TableCell style={{ width: 260 }}>
                      {row.standard}
                    </TableCell>
                    <TableCell style={{ width: 260 }}>
                      {row.name}
                    </TableCell>
                  
                    <TableCell align="right" style={{ width: 160 }}>

                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    
                        {
                          authCtx.user.scopes.includes("procedure_definition.update") && proceduresFilter.procedureStatus !== "0" &&
                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleEditView(row.id, "procedureEdit")}>
                            <EditIcon color="primary" />
                          </IconButton>
                        }
                        {
                          (!authCtx.user.scopes.includes("procedure_definition.update") && authCtx.user.scopes.includes("procedure_definition.viewAny")) &&

                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleEditView(row.id, "procedureView")}>
                            <RemoveRedEyeIcon />
                          </IconButton>
                        }
                        {
                          (authCtx.user.scopes.includes("procedure_definition.restore") && proceduresFilter.procedureStatus === "0") &&

                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleRestore(row.id)}>
                            <AutorenewIcon color="primary" />
                          </IconButton>
                        }
                        {
                          (authCtx.user.scopes.includes("procedure_definition.delete") && proceduresFilter.procedureStatus !== "0") &&
                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleDelete(row.id)}>
                            <DeleteIcon sx={{ color: pink[500] }} />
                          </IconButton>
                        }
                        {
                          (authCtx.user.scopes.includes("procedure_definition.forceDelete") && proceduresFilter.procedureStatus === "0") &&
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
              !showSpinner && proceduresPool.items.length === 0 &&

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
            <TableFooter01 colSpan={9} length={proceduresPool.totalCount} rowsPerPage={proceduresPool.perPage} page={proceduresPool.page}
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

export default ProceduresPage
