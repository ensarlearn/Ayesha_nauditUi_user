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
//import { DepartmentTableToolbar, DepartmentTableRow } from '../../../../sections/hr/department';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { useSelector } from 'react-redux';

import { dispatch } from '../../../../redux/store';
import { deleteDepartment, getDepartment } from '../../../../redux/slices/department';
import { Department, DepartmentState } from '../../../../@types/department';
import useSettings from 'src/hooks/useSettings';


import DepartmentAnalytic from 'src/sections/hr/department/DepartmentAnalytic';
import DepartmentTableToolbar from 'src/sections/hr/department/DepartmentTableToolbar';
import DepartmentTableRow from 'src/sections/hr/department/DepartmentTableRow';
import { Grid } from '@mui/material';
import { _analyticOrderTimeline } from '../../../../_mock';
import {
  AnalyticsOrderTimeline,
} from '../../../../sections/@dashboard/general/analytics';
const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'left' },
];

// ----------------------------------------------------------------------

export default function DepartmentList() {
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

  const { departments } = useSelector((state: { department: DepartmentState }) => state.department);
  useEffect(() => {
    dispatch(getDepartment());
  }, []);

  const [filterName, setFilterName] = useState('');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id: string) => {
    dispatch(deleteDepartment(id));
  };

  const handleEditRow = (id: string) => {
    navigate(PATH_DASHBOARD.hr.departmentedit(id));
  };

  const dataFiltered = applySortFilter({
    departments,
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
    <Page title="Department: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Department"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.hr.root },
            { name: 'Department', href: PATH_DASHBOARD.hr.department },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.hr.departmentnew}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Department
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
              <DepartmentAnalytic
                title="Total"
                total={departments.length}
                title2="Department"
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />
            </Stack>
          </Scrollbar>
        </Card>
        <Card>
          {/* <Grid item xs={12} md={6} lg={4}>
            <AnalyticsOrderTimeline title="Order Timeline" list={_analyticOrderTimeline} />
          </Grid> */}
          <DepartmentTableToolbar filterName={filterName} onFilterName={handleFilterName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={departments.length}
                  numSelected={selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <DepartmentTableRow
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
                    emptyRows={emptyRows(page, rowsPerPage, departments.length)}
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
  departments,
  comparator,
  filterName,
}: {
  departments: Department[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const stabilizedThis = departments.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  departments = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    departments = departments.filter(
      (item: Record<string, any>) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return departments;
}
