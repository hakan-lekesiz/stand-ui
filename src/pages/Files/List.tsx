import React, { useEffect, useState, useContext } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableRow, Paper, CircularProgress, Box, Typography, Snackbar, IconButton, Grid, InputLabel, Select, Button, MenuItem,
  TextField
} from '@mui/material';
import { pink } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import TableHead01 from "../../components/Table/TableHead01";
import TableFooter01 from "../../components/Table/TableFooter01";
import { useStore } from '../../store/store';
import { FilesPool, initialFilesPool, IFile, initialFilesFilter, FilesFilter } from "../../models/IFiles";
import { headCells } from "./head-cells";
import ConfirmDialog from "../../components/Dialogs/SoftDeleteDialog";
import AuthContext from '../../store/auth-context';
import { useParams, useNavigate } from 'react-router-dom';
import { SelectChangeEvent } from '@mui/material/Select';

const FileList = (props: any) => {
  const navigate = useNavigate();
  const authCtx: any = useContext(AuthContext);
  const [state, dispatch] = useStore(true);
  const [isInit, setIsInit] = useState<boolean>(true);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [filesPool, setFilesPool] = useState<FilesPool>(initialFilesPool);
  const [filesFilter, setFilesFilter] = useState<FilesFilter>(initialFilesFilter);
  const [filterTimeout, setFilterTimeout] = useState<any>(null);
  const [showError, setShowError] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");
  let { id } = useParams<"id">();
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

    if (isInit) {
      setIsInit(false);
    }
    else {
      getFilteredData();
    }

  }, [filesPool.page, filesPool.perPage, filesPool.sort, filesPool.orderBy]);

  useEffect(() => {

    if (filterTimeout !== null) {
      clearTimeout(filterTimeout);
    }
    setFilterTimeout(setTimeout(function () {
      setFilesPool({
        ...filesPool,
        page: 0
      });
      if (filesPool.page === 0) {
        getFilteredData();
      }
    }, 250));

  }, [filesFilter]);

  useEffect(() => {

    if (state.globals.formDatas.fileTypeOption.length > 0) {
      setShowSpinner(false);
    }
    else {
      setTimeout(() => {
        dispatch('SET_UPDATE');
      }, 1000);
    }


  }, [state]);

  useEffect(() => {

    if (props.fileListRefresher > 0) {
      getFilteredData();
    }
  }, [props.fileListRefresher]);


  const getFilteredData = async () => {

    setShowSpinner(true);

    const sort = (filesPool.orderBy === "asc" ? "-" : "") + filesPool.sort;
    let fetchUrl = state.globals.routes.file + "?sort=" + sort + "&page=" + (filesPool.page + 1) + "&per_page=" + filesPool.perPage;
    if (props.fileable_type) {
      fetchUrl += "&fileable_id=" + id + "&fileable_type=" + props.fileable_type;
    }
    else {
      if (filesFilter.name !== "") {
        fetchUrl += ("&name=" + filesFilter.name);
      }
      if (filesFilter.module !== "") {
        fetchUrl += ("&fileable_type=" + filesFilter.module);
      }
      if (filesFilter.category !== "") {
        fetchUrl += ("&file_type_id=" + filesFilter.category);
      }

    }


    const result: any = await fetch(fetchUrl)
    const resData: any = await result.json();


    if (result.ok) {
      let files: IFile[] = [];
      let filableTitle = "";



      resData.data.map((item: any) => {

        if (item.fileable_type === "client") {
          filableTitle = "Müşteri ";
        }
        else if (item.fileable_type === "seminar") {
          filableTitle = "Eğitim ";
        }
        else if (item.fileable_type === "procedure") {
          filableTitle = "Prosedür ";
        }
        else if (item.fileable_type === "deal") {
          filableTitle = "Teklif ";
        }

        files.push({
          id: item.id,
          created_at: new Date(item.created_at),
          name: item.name,
          fileableName: filableTitle + (item.fileable_type === "seminar" ? item.fileable.subject.name : item.fileable.name),
          extension: item.extension,
          authorized_person: item.user ? item.user.name : "",
          path: item.url,
        })

      });

      setFilesPool({
        ...filesPool,
        totalCount: resData.total,
        items: files
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
    setFilesPool({
      ...filesPool,
      page: newPage
    });
  };

  const handleChangeRowsPerPage = (event: any) => {
    var perPage = parseInt(event.target.value, 10);
    setFilesPool({
      ...filesPool,
      page: 0,
      perPage
    });
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string,
  ) => {
    const isAsc = filesPool.sort === property && filesPool.orderBy === 'asc';

    setFilesPool({
      ...filesPool,
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
      deleteFile();
    }
  };

  const deleteFile = () => {
    let fetchUrl = state.globals.routes.file + "/" + dialog.itemId;

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
    setDialog(
      {
        isDialogOpen: true,
        title: "Sil",
        desc: "Dosyayı silmek istediğinize emin misiniz?",
        cancelText: "İptal",
        agreeText: "Evet",
        itemId: id,
        type: "delete"
      });

  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setFilesFilter({
      ...filesFilter,
      [event.target.name]: event.target.value
    });
  };

  const handleTextFieldChange = (event: any) => {

    setFilesFilter({
      ...filesFilter,
      [event.target.name]: event.target.value
    });
  };

  const handleClearFilter = () => {
    setFilesFilter(initialFilesFilter);
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

      {
        !props.fileable_type &&
        <Grid container spacing={0} xs={12} md={12} lg={12}>

          <div className="search-area">

            <Grid xs={12} sx={{ display: "flex" }}>

              <Grid xs={2}>
                <InputLabel>Modül</InputLabel>
                <Select
                  sx={{ width: "90%" }}
                  labelId="module-label"
                  id="module"
                  name="module"
                  value={filesFilter.module}
                  onChange={handleSelectChange}
                >
                  {
                    state.globals.formDatas.modules.map((item: any) => {

                      return (
                        <MenuItem key={"module" + item.id} value={item.id}>{item.title}</MenuItem>
                      )
                    })

                  }
                </Select>
              </Grid>
              <Grid xs={2}>
                <InputLabel>Döküman Kategorisi</InputLabel>
                <Select
                  sx={{ width: "90%" }}
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={filesFilter.category}
                  onChange={handleSelectChange}
                >
                  {
                    state.globals.formDatas.fileTypeOption.map((item: any) => {

                      return (
                        <MenuItem key={"category" + item.id} value={item.id.toString()}>{item.title}</MenuItem>
                      )
                    })

                  }
                </Select>
              </Grid>
              <Grid xs={2}>
                <InputLabel>Dosya Adı</InputLabel>

                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  autoComplete="new-password"
                  value={filesFilter.name}
                  onChange={handleTextFieldChange}
                />

              </Grid>

            </Grid>

            <div className="filter-actions">
              {
                (filesFilter.module !== "" || filesFilter.category !== "" || filesFilter.name !== "") &&
                <Button variant="contained" startIcon={<DeleteIcon />} sx={{ height: 56, marginLeft: "0!important", marginRight: "8px!important" }}
                  onClick={handleClearFilter}>
                  Temizle
                </Button>
              }
            </div>
          </div>



        </Grid>
      }

      <TableContainer component={Paper}>
        <Table>

          <TableHead01 headCells={headCells} orderBy={filesPool.orderBy} sort={filesPool.sort} sortChange={handleRequestSort} />

          <TableBody>

            {
              !showSpinner && filesPool.items.length > 0 &&
              filesPool.items.map((row, index) => {
                return (

                  <TableRow key={"files" + index}>
                    <TableCell component="th" scope="row">
                      {row.fileableName}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.name}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.extension}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.authorized_person}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.created_at ? row.created_at.toLocaleDateString("tr") : ""}
                    </TableCell>

                    <TableCell align="right" style={{ width: 160 }}>

                      <div style={{ display: "flex", justifyContent: "flex-end" }}>

                        {
                          authCtx.user.scopes.includes("file.viewAny") &&
                          <a href={row.path} target="_blank">
                            <IconButton sx={{ minWidth: "auto" }}>
                              <RemoveRedEyeIcon />
                            </IconButton>
                          </a>
                        }

                        {
                          authCtx.user.scopes.includes("file.delete") &&

                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleDelete(row.id ? row.id : 0)}>
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
              !showSpinner && filesPool.items.length === 0 &&

              <TableRow>
                <TableCell colSpan={6}>
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
                <TableCell colSpan={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            }

          </TableBody>
          {
            !showSpinner &&
            <TableFooter01 colSpan={6} length={filesPool.totalCount} rowsPerPage={filesPool.perPage} page={filesPool.page}
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

export default FileList
