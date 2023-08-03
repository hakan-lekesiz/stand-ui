import React, { useEffect, useState, useContext } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableRow, Paper, CircularProgress, Box, Typography, Snackbar, IconButton, TextField,
  Grid, InputLabel, MenuItem, FormControl, Button, Select
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { pink } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import TableHead01 from "../../components/Table/TableHead01";
import TableFooter01 from "../../components/Table/TableFooter01";
import { useStore } from '../../store/store';
import { NotesPool, initialNotesPool, INote, initialNotesFilter, NotesFilter } from "../../models/INotes";
import { headCells } from "./head-cells";
import ConfirmDialog from "../../components/Dialogs/SoftDeleteDialog";
import AuthContext from '../../store/auth-context';
import { useParams } from 'react-router-dom';
import { SelectChangeEvent } from '@mui/material/Select';
import NoteAddEdit from "./AddEdit";
import { ICurrentPage } from '../../models/ICurrentPage';

const NoteList = (props: any) => {
  const authCtx: any = useContext(AuthContext);
  const [state, dispatch] = useStore(true);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [isInit, setIsInit] = useState<boolean>(true);
  const [filterTimeout, setFilterTimeout] = useState<any>(null);
  const [notesFilter, setNotesFilter] = useState<NotesFilter>(initialNotesFilter);
  const [notesPool, setNotesPool] = useState<NotesPool>(initialNotesPool);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [editingNote, setEditingNote] = useState<any>(null);
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

    const currentPage: ICurrentPage = {
      name: "Notlar"
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
  }, [notesPool.page, notesPool.perPage, notesPool.sort, notesPool.orderBy]);

  useEffect(() => {

    if (filterTimeout !== null) {
      clearTimeout(filterTimeout);
    }
    setFilterTimeout(setTimeout(function () {
      setNotesPool({
        ...notesPool,
        page: 0
      });
      if (notesPool.page === 0) {
        getFilteredData();
      }
    }, 250));

  }, [notesFilter]);

  const getFilteredData = async () => {
    setEditingNote(null);
    setShowSpinner(true);

    const sort = (notesPool.orderBy === "asc" ? "-" : "") + notesPool.sort;
    let fetchUrl = state.globals.routes.note + "?sort=" + sort + "&page=" + (notesPool.page + 1) + "&per_page=" + notesPool.perPage;

    if (props.notable_type) {
      fetchUrl += "&notable_id=" + id + "&notable_type=" + props.notable_type;
    }
    else {
      if (notesFilter.content !== "") {
        fetchUrl += ("&content=" + notesFilter.content);
      }
      if (notesFilter.module !== "") {
        fetchUrl += ("&notable_type=" + notesFilter.module);
      }
      if (notesFilter.completed !== "") {
        fetchUrl += ("&completed=" + notesFilter.completed);
      }
    }

    const result: any = await fetch(fetchUrl)
    const resData: any = await result.json();


    if (result.ok) {
      let notes: INote[] = [];
      resData.data.map((item: any) => (
        notes.push({
          id: item.id,
          created_at: new Date(item.created_at),
          remind_at: item.remind_at,
          content: item.content,
          authorized_person: item.user ? item.user.name : "",
          completed: (item.completed || item.completed === 0) ? item.completed.toString() : "null",
          notable_type: item.notable_type,
          notable_id: item.notable_id.toString()
        })
      ));

      setNotesPool({
        ...notesPool,
        totalCount: resData.total,
        items: notes
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
    setNotesPool({
      ...notesPool,
      page: newPage
    });
  };

  const handleChangeRowsPerPage = (event: any) => {
    var perPage = parseInt(event.target.value, 10);
    setNotesPool({
      ...notesPool,
      page: 0,
      perPage
    });
  };

  const handleEditView = (note: INote) => {
    setEditingNote(note);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string,
  ) => {
    const isAsc = notesPool.sort === property && notesPool.orderBy === 'asc';

    setNotesPool({
      ...notesPool,
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
      deleteNote();
    }
    else if (dialog.type === "restore") {
      restoreNote();
    }
  };

  const deleteNote = () => {
    let fetchUrl = state.globals.routes.note + "/" + dialog.itemId;

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
        desc: "Notu silmek istediğinize emin misiniz?",
        cancelText: "İptal",
        agreeText: "Evet",
        itemId: id,
        type: "delete"
      });

  };

  const restoreNote = () => {
    let fetchUrl = state.globals.routes.note + "/" + dialog.itemId + "/restore";


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

  const handleSelectChange = (event: SelectChangeEvent) => {
    setNotesFilter({
      ...notesFilter,
      [event.target.name]: event.target.value
    });
  };

  const handleTextFieldChange = (event: any) => {

    setNotesFilter({
      ...notesFilter,
      [event.target.name]: event.target.value
    });
  };

  const handleClearFilter = () => {
    setNotesFilter(initialNotesFilter);
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
        (props.notable_type || editingNote !== null) &&

        <Grid container spacing={0} xs={12} md={12} lg={12}>

          <div className="search-area" style={{ display: "block" }}>
            <NoteAddEdit editingNote={editingNote} notable_type={props.notable_type} getFilteredData={() => getFilteredData()} />
          </div>

        </Grid>
      }

      {
        !props.notable_type &&
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
                  value={notesFilter.module}
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
                <InputLabel>Not Durumu</InputLabel>
                <Select
                  sx={{ width: "90%" }}
                  labelId="completed-label"
                  id="completed"
                  name="completed"
                  value={notesFilter.completed}
                  onChange={handleSelectChange}
                >
                  {
                    state.globals.formDatas.noteIsCompletedOptions.map((item: any) => {

                      return (
                        <MenuItem key={"completed" + item.id} value={item.id.toString()}>{item.title}</MenuItem>
                      )
                    })

                  }
                </Select>
              </Grid>
              <Grid xs={2}>
                <InputLabel>İçerik</InputLabel>

                <TextField
                  fullWidth
                  id="content"
                  name="content"
                  autoComplete="new-password"
                  value={notesFilter.content}
                  onChange={handleTextFieldChange}
                />

              </Grid>

            </Grid>

            <div className="filter-actions">
              {
                (notesFilter.module !== "" || notesFilter.content !== "" || notesFilter.completed !== "") &&
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

          <TableHead01 headCells={headCells} orderBy={notesPool.orderBy} sort={notesPool.sort} sortChange={handleRequestSort} />

          <TableBody>

            {
              !showSpinner && notesPool.items.length > 0 &&
              notesPool.items.map((row, index) => {
                return (

                  <TableRow key={"notes" + index}>
                    <TableCell component="th" scope="row">
                      {row.content}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.remind_at}
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
                          authCtx.user.scopes.includes("note.update") &&
                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleEditView(row)}>
                            <EditIcon color="primary" />
                          </IconButton>
                        }
                        {
                          (!authCtx.user.scopes.includes("note.update") && authCtx.user.scopes.includes("note.viewAny")) &&

                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleEditView(row)}>
                            <RemoveRedEyeIcon />
                          </IconButton>
                        }

                        {
                          authCtx.user.scopes.includes("note.delete") &&

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
              !showSpinner && notesPool.items.length === 0 &&

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
          {
            !showSpinner &&
            <TableFooter01 colSpan={5} length={notesPool.totalCount} rowsPerPage={notesPool.perPage} page={notesPool.page}
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

export default NoteList
