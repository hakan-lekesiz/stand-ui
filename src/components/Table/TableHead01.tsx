import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { HeadCell } from '../../models/HeadCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';
import Box from '@mui/material/Box';

const TableHead01 = (props: any) => {
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      props.sortChange(event, property);
    };

  return (

    <TableHead>
      <TableRow>
        {props.headCells.map((headCell: HeadCell) => (

          headCell.sort ? (
            <TableCell
              key={headCell.id}
              align={headCell.align === "left" ? "left" : "right"}
              sortDirection={props.orderBy}>
              <TableSortLabel
                active={props.sort === headCell.id}
                direction={props.sort === headCell.id ? props.orderBy : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                <Typography variant="h1"
                  sx={{
                    fontSize: '17px',
                    fontWeight: '600'
                  }}
                >
                  {headCell.label}
                </Typography>
                {props.sort === headCell.id &&
                  <Box component="span" sx={visuallyHidden}>
                    {props.orderBy === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                }
              </TableSortLabel>

            </TableCell>
          ) : (
            <TableCell
              key={headCell.id}
              align={headCell.align === "left" ? "left" : "right"}>
              <Typography variant="h1"
                sx={{
                  fontSize: '17px',
                  fontWeight: '600'
                }}
              >
                {headCell.label}
              </Typography>
            </TableCell>
          )

        ))}
        {
          props.showCrud !== false &&

          <TableCell align="right" key={"islemler"} sortDirection={false}>

            <Typography variant="h1"
              sx={{
                fontSize: '17px',
                fontWeight: '600'
              }}
            >
              {"İşlemler"}
            </Typography>
          </TableCell>
        }
      </TableRow>
    </TableHead>
  );
};

export default TableHead01;

