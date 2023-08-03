import React, { useEffect, useState, useContext } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableRow, Paper, CircularProgress, Box, Typography,
  Grid, Button
} from '@mui/material';
import TableHead01 from "../Table/TableHead01";
import TableFooter01 from "../Table/TableFooter01";
import { useStore } from '../../store/store';
import { RevisionsPool, initialRevisionsPool, Revision } from "../../models/Revisions";
import { headCells } from "./head-cells";

const Revisions = (props: any) => {
  const [state] = useStore(true);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [isInit, setIsInit] = useState<boolean>(true);
  const [revisionsPool, setRevisionsPool] = useState<RevisionsPool>(initialRevisionsPool);
  const [disablePagination, setDisablePagination] = useState<boolean>(false);
  const [showRevisions, setShowRevisions] = useState<boolean>(false);

  useEffect(() => {
    getFilteredData();
  }, []);

  useEffect(() => {
    if (isInit) {
      setIsInit(false);
    }
    else {
      getFilteredData();
    }
  }, [revisionsPool.page, revisionsPool.perPage]);

  const getFilteredData = async () => {
    let fetchUrl = state.globals.routes.revisions + "/" + props.model + "/" + props.id;
    fetchUrl = fetchUrl + "?sort=desc&page=" + (revisionsPool.page + 1) + "&per_page=" + revisionsPool.perPage;
    const result: any = await fetch(fetchUrl)
    const resData: any = await result.json();

    if (result.ok) {
      let revisions: Revision[] = [];

      resData.data.map((item: any, index: number) => (
        revisions.push({
          id: index,
          created_at: new Date(item.created_at),
          key: item.key,
          old_value: item.old_value,
          new_value: item.new_value,
          user: item.user.name, 
        })
      ));
 
      setRevisionsPool({
        ...revisionsPool,
        totalCount: resData.total,
        items: revisions
      });

    }
    else {
    }

    setShowSpinner(false);
    setTimeout(function () {
      setDisablePagination(false);
    }, 300);

  };

  const handleChangePage = (event: any, newPage: any) => {
    setDisablePagination(true);
    setRevisionsPool({
      ...revisionsPool,
      page: newPage
    });
  };

  const handleChangeRowsPerPage = (event: any) => {
    var perPage = parseInt(event.target.value, 10);
    setRevisionsPool({
      ...revisionsPool,
      page: 0,
      perPage
    });
  };

  return (
    <>

      <Grid sx={{ mt: 3 }}>
       
          <Button sx={{ mb: 1 }} onClick={() => setShowRevisions(!showRevisions)} variant="contained" color="primary">
            {showRevisions ? "İşlem Geçmişleri Gizle" : "İşlem Geçmişleri Göster"}
          </Button>
       
      </Grid>
      {
        showRevisions &&
        <TableContainer component={Paper}>
          <Table>

            <TableHead01 showCrud={false} headCells={headCells} orderBy={revisionsPool.orderBy} sort={revisionsPool.sort} sortChange={console.log("sort")} />

            <TableBody>

              {
                !showSpinner && revisionsPool.items.length > 0 &&
                revisionsPool.items.map((row, index) => {
                  return (

                    <TableRow key={"revisions" + index}>
                      <TableCell component="th" scope="row">
                        {row.created_at.toLocaleDateString("tr")}
                      </TableCell>
                      <TableCell style={{ width: 160 }}>
                        {row.key}
                      </TableCell>
                      <TableCell style={{ width: 160 }}>
                        {row.old_value}
                      </TableCell>
                      <TableCell style={{ width: 160 }}>
                        {row.new_value}
                      </TableCell>
                      <TableCell style={{ width: 160 }}>
                        {row.user}
                      </TableCell>
                    
                    </TableRow>

                  );
                })
              }
              {
                !showSpinner && revisionsPool.items.length === 0 &&

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

              <TableFooter01 colSpan={5} length={revisionsPool.totalCount} rowsPerPage={revisionsPool.perPage} page={revisionsPool.page}
                handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} disablePagination={disablePagination} />

            }
          </Table>
        </TableContainer>
      }


    </>
  );
}

export default Revisions
