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
import TableHead01 from "../../components/Table/TableHead01";
import TableFooter01 from "../../components/Table/TableFooter01";
import { useStore } from '../../store/store';
import { LocationsPool, initialLocationsPool, ILocation } from "../../models/Locations";
import { headCells } from "./head-cells-locations";
import ConfirmDialog from "../../components/Dialogs/SoftDeleteDialog";
import AuthContext from '../../store/auth-context';
import { useParams, useNavigate } from 'react-router-dom';

const Step2LocationList = (props: any) => {
  const navigate = useNavigate();
  const authCtx: any = useContext(AuthContext);
  const [state, dispatch] = useStore(true);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [isInit, setIsInit] = useState<boolean>(true);
  const [filterTimeout, setFilterTimeout] = useState<any>(null);
  const [locationsPool, setLocationsPool] = useState<LocationsPool>(initialLocationsPool);
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

    getFilteredData();

  }, [locationsPool.page, locationsPool.perPage, locationsPool.sort, locationsPool.orderBy]);

  useEffect(() => {
    if (props.locationListRefresher > 0) {
      getFilteredData();
    }
  }, [props.locationListRefresher]);


  const getFilteredData = async () => {

    setShowSpinner(true);

    const sort = (locationsPool.orderBy === "asc" ? "-" : "") + locationsPool.sort;
    let fetchUrl = state.globals.routes.location + "?sort=" + sort + "&page=" + (locationsPool.page + 1) + "&per_page=" + locationsPool.perPage + "&client_id=" + id;

    const result: any = await fetch(fetchUrl)
    const resData: any = await result.json();
 

    if (result.ok) {
      let locations: ILocation[] = [];

      resData.data.map((item: any) => (
        locations.push({
          id: item.id,
          created_at: new Date(item.created_at),
          name: item.name,
          location_definition: item.location_definition.name,
          city_district: item.city.name + " / " + item.district.name,
          employee_count: item.employee_count,
          branch_agent: item.branch_agent,
          phone_number: item.phone_number
        })
      ));

      setLocationsPool({
        ...locationsPool,
        totalCount: resData.total,
        items: locations
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
    setLocationsPool({
      ...locationsPool,
      page: newPage
    });
  };

  const handleChangeRowsPerPage = (event: any) => {
    var perPage = parseInt(event.target.value, 10);
    setLocationsPool({
      ...locationsPool,
      page: 0,
      perPage
    });
  };

  const handleEditView = (id: number) => {
    props.handleEdit(id);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string,
  ) => {
    const isAsc = locationsPool.sort === property && locationsPool.orderBy === 'asc';

    setLocationsPool({
      ...locationsPool,
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
      deleteLocation();
    }
    else if (dialog.type === "restore") {
      restoreLocation();
    }
  };

  const deleteLocation = () => {
    let fetchUrl = state.globals.routes.location + "/" + dialog.itemId;

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
        desc: "Lokasyonu silmek istediğinize emin misiniz?",
        cancelText: "İptal",
        agreeText: "Evet",
        itemId: id,
        type: "delete"
      });

  };

  const restoreLocation = () => {
    let fetchUrl = state.globals.routes.location + "/" + dialog.itemId + "/restore";


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

      <TableContainer component={Paper}>
        <Table>

          <TableHead01 headCells={headCells} orderBy={locationsPool.orderBy} sort={locationsPool.sort} sortChange={handleRequestSort} />

          <TableBody>

            {
              !showSpinner && locationsPool.items.length > 0 &&
              locationsPool.items.map((row, index) => {
                return (

                  <TableRow key={"locations" + index}>
                    <TableCell component="th" scope="row">
                      {row.created_at ? row.created_at.toLocaleDateString("tr") : ""}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.name}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.location_definition}
                    </TableCell>

                    <TableCell style={{ width: 160 }}>
                      {row.city_district}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.employee_count}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.branch_agent}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {row.phone_number}
                    </TableCell>

                    <TableCell align="right" style={{ width: 160 }}>

                      <div style={{ display: "flex", justifyContent: "flex-end" }}>

                        {
                          authCtx.user.scopes.includes("location.update") &&
                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleEditView(row.id ? row.id : 0)}>
                            <EditIcon color="primary" />
                          </IconButton>
                        }
                        {
                          (!authCtx.user.scopes.includes("location.update") && authCtx.user.scopes.includes("location.viewAny")) &&

                          <IconButton sx={{ minWidth: "auto" }} onClick={() => handleEditView(row.id ? row.id : 0)}>
                            <RemoveRedEyeIcon />
                          </IconButton>
                        }

                        {
                          authCtx.user.scopes.includes("location.delete") &&

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
              !showSpinner && locationsPool.items.length === 0 &&

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
            <TableFooter01 colSpan={8} length={locationsPool.totalCount} rowsPerPage={locationsPool.perPage} page={locationsPool.page}
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

export default Step2LocationList
