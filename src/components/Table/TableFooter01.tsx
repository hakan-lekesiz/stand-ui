import TableRow from '@mui/material/TableRow';
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import { TableFooter, TableCell } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';

const TableFooter01 = (props: any) => {

  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 50]}
          colSpan={props.colSpan}
          count={props.length}
          rowsPerPage={props.rowsPerPage}
          page={props.page}
          SelectProps={{
            inputProps: {
              'aria-label': 'rows per page',
            },
            native: true,
          }}
          labelRowsPerPage="Sayfa başına satır"
          onPageChange={props.handleChangePage}
          onRowsPerPageChange={props.handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </TableRow>
      <TableRow style={{ position: "relative" }}>
        {
          props.disablePagination &&
          <TableCell colSpan={props.colSpan} className="disablePagination"/>

        }
      </TableRow>
    </TableFooter>
  );
};

export default TableFooter01;
