import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  Stack,
  Divider,
  useTheme,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useTable, { getComparator, emptyRows } from '../../../../hooks/useTable';

// components
import Page from '../../../../components/Page';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import { TableNoData, TableEmptyRows, TableHeadCustom } from '../../../../components/table';
// sections
//import { TimeoffTableToolbar, TimeoffTableRow } from '../../../../sections/timeoff/timeoff';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { useSelector } from 'react-redux';

import { dispatch } from '../../../../redux/store';
import { deleteTimeoff, getTimeoff } from '../../../../redux/slices/timeoff';
import { Timeoff, TimeoffState } from '../../../../@types/timeoff';
import useSettings from 'src/hooks/useSettings';


import TimeoffAnalytic from 'src/sections/timeoff/timeoff/TimeoffAnalytic';
import TimeoffTableToolbar from 'src/sections/timeoff/timeoff/TimeoffTableToolbar';
import TimeoffTableRow from 'src/sections/timeoff/timeoff/TimeoffTableRow';

const TABLE_HEAD = [
  { id: 'employee', label: 'Employee', align: 'left' },
  { id: 'leaveType', label: 'Leave Type', align: 'left' },
  { id: 'fromDate', label: 'From Date', align: 'left' },
  { id: 'toDate', label: 'To Date', align: 'left' },
  { id: 'noOfDays', label: 'No Of Days', align: 'left' },
  { id: 'Reason', label: 'Reason', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'left' },

  { id: '' },
];

// ----------------------------------------------------------------------

export default function TimeoffList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    onSelectRow,
    //
    onSort,

    onChangePage,
    onChangeRowsPerPage,
  } = useTable();
  const theme = useTheme();
  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const { timeoffs } = useSelector((state: { timeoff: TimeoffState }) => state.timeoff);
  useEffect(() => {
    dispatch(getTimeoff());
  }, []);

  const [filterName, setFilterName] = useState('');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id: string) => {
    dispatch(deleteTimeoff(id));
  };

  const handleEditRow = (id: string) => {
    navigate(PATH_DASHBOARD.timeoff.timeoffedit(id));
  };

  const dataFiltered = applySortFilter({
    timeoffs,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleOnChange = (e: any) => {
    const file = e.target.files[0];
    //dispatch(postUploadFile(file));
  };

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && !!filterName;

  return (
    <Page title="Timeoff: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Timeoff"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.timeoff.root },
            { name: 'Timeoff' },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.timeoff.timeoffnew}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Timeoff
            </Button>
          }
          // action2={
          //   <Button variant="contained" component="label">
          //     Import
          //     <input
          //       hidden
          //       type={'file'}
          //       id={'csvFileInput'}
          //       accept={'.csv'}
          //       onChange={handleOnChange}
          //     />
          //   </Button>
          // }
        />

        <Card sx={{ mb: 5 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <TimeoffAnalytic
                title="Total"
                total={timeoffs.length}
                title2="Timeoff"
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />
            </Stack>
          </Scrollbar>
        </Card>
        <Card>
          <TimeoffTableToolbar filterName={filterName} onFilterName={handleFilterName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={timeoffs.length}
                  numSelected={selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TimeoffTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, timeoffs.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  timeoffs,
  comparator,
  filterName,
}: {
  timeoffs: Timeoff[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const stabilizedThis = timeoffs.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  timeoffs = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    timeoffs = timeoffs.filter(
      (item: Record<string, any>) =>
        item.status.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return timeoffs;
}
