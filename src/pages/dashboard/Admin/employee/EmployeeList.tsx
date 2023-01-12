import { ChangeEvent, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
   Box,
  Card,
  Table,
  Tabs,
  Tab,
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
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { useSelector } from 'react-redux';

import { dispatch } from '../../../../redux/store';
import { deleteEmployee, getEmployee } from '../../../../redux/slices/employee';
import { Employee, EmployeeState } from '../../../../@types/employee';
import useSettings from 'src/hooks/useSettings';

import EmployeeAnalytic from 'src/sections/@dashboard/user/employee/EmployeeAnalytic';
import EmployeeTableToolbar from 'src/sections/@dashboard/user/employee/EmployeeTableToolbar';
import EmployeeTableRow from 'src/sections/@dashboard/user/employee/EmployeeTableRow';

const ROLE_OPTIONS = [
 'ROLE_SUPER_ADMIN',
 'ROLE_ADMIN',
 'ROLE_USER',
]

const TABLE_HEAD = [
 { id: 'firstName', label: 'Name', align: 'left' },
 { id: 'employeeId', label: 'Employee ID', align: 'left' },
 { id: 'email', label: 'Email', align: 'left' },
 { id: 'mobile', label: 'Mobile', align: 'left' },
 { id: 'joinDate', label: 'Join Date', align: 'left' },
 { id: 'role', label: 'Role', align: 'left' },
 { id: '', label: 'Actions', align: 'left' },

 // { id: '' },
];

// ----------------------------------------------------------------------

export default function EmployeeList() {
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

 const { employees } = useSelector(
 (state: { employee: EmployeeState }) => state.employee);

 useEffect(() => {
  dispatch(getEmployee());
 }, []);

 const [filterName, setFilterName] = useState('');

 const [filterRole, setFilterRole] = useState('all');

 const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
   setFilterName(event.target.value);
   setPage(0);
 };

 const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement>) => {
  setPage(0);
  setFilterRole(event.target.value);
 };

 const handleDeleteRow = (id: string) => {
  dispatch(deleteEmployee(id));
 };

 const handleEditRow = (id: string) => {
  navigate(PATH_DASHBOARD.user.employeeedit(id));
 };

 const handleViewRow = (id: string) => {
  navigate(PATH_DASHBOARD.user.employeeview(id));
 };
 const dataFiltered = applySortFilter({
  employees,
  comparator: getComparator(order, orderBy),
  filterName,
  filterRole,
 });

 const handleOnChange = (e: any) => {
 const file = e.target.files[0];
 //dispatch(postUploadFile(file));
 };

 const denseHeight = dense ? 52 : 72;

 const isFiltered = filterName !== '' || filterRole !== 'all';

 const isNotFound =
 (!dataFiltered.length && !!filterName) ||
 (!dataFiltered.length && !!filterRole);

 return (
 <Page title=" Employee: List">
 <Container maxWidth={themeStretch ? false : 'lg'}>
 <HeaderBreadcrumbs
 heading=" Employee"
 links={[
 { name: 'Dashboard', href: PATH_DASHBOARD.user.root },
 { name: ' Employee', href: PATH_DASHBOARD.user.employee },
 { name: 'List' },
 ]}
 action={
 <Button
 variant="contained"
 component={RouterLink}
 to={PATH_DASHBOARD.user.employeenew}
 startIcon={<Iconify icon={'eva:plus-fill'} />}
 >
 New Employee
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
 <EmployeeAnalytic
 title="Total"
 total={employees.length}
 title2="Employees"
 icon="ic:round-receipt"
color={theme.palette.info.main}
 />
 </Stack>
</Scrollbar>
</Card>
 <Card>

 <EmployeeTableToolbar
 isFiltered={isFiltered}
 filterName={filterName}
 onFilterName={handleFilterName}
 optionsRole={ROLE_OPTIONS}
 filterRole={filterRole}
 onFilterRole={handleFilterRole}
 />
 <Scrollbar>
  <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
  <Table size={dense ? 'small' : 'medium'}>
  <TableHeadCustom
 order={order}
 orderBy={orderBy}
 headLabel={TABLE_HEAD}
 rowCount={employees.length}
 numSelected={selected.length}
 onSort={onSort}
/>

 <TableBody>
{dataFiltered
 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
 .map((row) => (
   <EmployeeTableRow
 key={row.id}
 row={row}
 selected={selected.includes(row.id)}
 onSelectRow={() => onSelectRow(row.id)}
 onDeleteRow={() => handleDeleteRow(row.id)}
 onViewRow={() => handleViewRow(row.id)}
 onEditRow={() => handleEditRow(row.id)}
 />
 ))}

 <TableEmptyRows
   height={denseHeight}
   emptyRows={emptyRows(page, rowsPerPage, employees.length)}
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
 employees,
 comparator,
 filterName,
 filterRole,
}: {
  employees: Employee[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterRole: string;
}) {
  const stabilizedThis = employees.map((el, index) => [el, index] as const);

stabilizedThis.sort((a, b) => {
   const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
   return a[1] - b[1];
  });

employees = stabilizedThis.map((el) => el[0]);

 if (filterName) {
    employees = employees.filter(
    (item: Record<string, any>) =>
   item.firstName?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
 );
 }

if (filterRole !== 'all') {
  employees =employees.filter(
  (item: Record<string, any>) =>
   item.role === filterRole
   );
 }

return employees;
}


