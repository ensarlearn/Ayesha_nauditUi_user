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
//import { HRStatusTableToolbar, HRStatusTableRow } from '../../../../sections/hr/status';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { useSelector } from 'react-redux';

import { dispatch } from '../../../../redux/store';
import { deleteHRTimesheetAttendance, getHRTimesheetAttendance } from '../../../../redux/slices/hrtimesheetattendance';
import { HRTimesheetAttendance, HRTimesheetAttendanceState } from '../../../../@types/hrtimesheetattendance';
import useSettings from 'src/hooks/useSettings';
import HRTimesheetAttendanceAnalytic from 'src/sections/hr/timesheetattendance/HRTimesheetAttendanceAnalytic';
import HRTimesheetAttendanceTableToolbar from 'src/sections/hr/timesheetattendance/HRTimesheetAttendanceTableToolbar';
import HRTimesheetAttendanceTableRow from 'src/sections/hr/timesheetattendance/HRTimesheetAttendanceTableRow';

const TABLE_HEAD = [
  { id: 'firstName', label: 'User', align: 'left' },
  { id: 'project', label: 'Project', align: 'left' },
  { id: 'task', label: 'Task', align: 'left' },
  { id: 'subtask', label: 'Sub-Task', align: 'left' },
  { id: 'hours', label: 'Hours', align: 'left' },
  { id: 'remarks', label: 'Remarks', align: 'left' },
  { id: 'workdate', label: 'Work Date', align: 'left' },

  { id: '' },
];

// ----------------------------------------------------------------------

export default function HRTimesheetAttendanceList() {
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

  const { hrTimesheetAttendances } = useSelector((state: { hrtimesheetattendance: HRTimesheetAttendanceState }) => state.hrtimesheetattendance);
  useEffect(() => {
    dispatch(getHRTimesheetAttendance());
  }, []);

  const [filterName, setFilterName] = useState('');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id: string) => {
    dispatch(deleteHRTimesheetAttendance(id));
  };

  const handleEditRow = (id: string) => {
    navigate(PATH_DASHBOARD.hr.timesheetattendanceedit(id));
  };

  const dataFiltered = applySortFilter({
    hrTimesheetAttendances,
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
    <Page title="HRTimesheetAttendance: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="HR Timesheet Attendance"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.hr.root },
            { name: 'HR Timesheet Attendance', href: PATH_DASHBOARD.hr.timesheetattendance },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.hr.timesheetattendancenew}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New HR Timesheet Attendance
            </Button>
          }
          action2={
            <Button variant="contained" component="label">
              Import
              <input
                hidden
                type={'file'}
                id={'csvFileInput'}
                accept={'.csv'}
                onChange={handleOnChange}
              />
            </Button>
          }
        />

        <Card sx={{ mb: 5 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <HRTimesheetAttendanceAnalytic
                title="Total"
                total={hrTimesheetAttendances.length}
                title2="HR Timesheet Attendance"
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />
            </Stack>
          </Scrollbar>
        </Card>
        <Card>
          <HRTimesheetAttendanceTableToolbar filterName={filterName} onFilterName={handleFilterName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={hrTimesheetAttendances.length}
                  numSelected={selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <HRTimesheetAttendanceTableRow
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
                    emptyRows={emptyRows(page, rowsPerPage, hrTimesheetAttendances.length)}
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
  hrTimesheetAttendances,
  comparator,
  filterName,
}: {
  hrTimesheetAttendances: HRTimesheetAttendance[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const stabilizedThis = hrTimesheetAttendances.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  hrTimesheetAttendances = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    hrTimesheetAttendances = hrTimesheetAttendances.filter(
      (item: Record<string, any>) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return hrTimesheetAttendances;
}
