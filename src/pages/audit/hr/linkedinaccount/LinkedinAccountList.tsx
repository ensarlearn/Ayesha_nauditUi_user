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
//import { LinkedinAccountTableToolbar, LinkedinAccountTableRow } from '../../../../sections/hr/linkedinAccount';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { useSelector } from 'react-redux';

import { dispatch } from '../../../../redux/store';
import {
  deleteLinkedinAccount,
  getLinkedinAccount,
} from '../../../../redux/slices/linkedinaccount';
import { LinkedinAccount, LinkedinAccountState } from '../../../../@types/linkedinaccount';
import useSettings from 'src/hooks/useSettings';

import LinkedinAccountAnalytic from 'src/sections/hr/linkedinaccount/LinkedinAccountAnalytic';
import LinkedinAccountTableToolbar from 'src/sections/hr/linkedinaccount/LinkedinAccountTableToolbar';
import LinkedinAccountTableRow from 'src/sections/hr/linkedinaccount/LinkedinAccountTableRow';
import { Grid } from '@mui/material';
import { _analyticOrderTimeline } from '../../../../_mock';
import { AnalyticsOrderTimeline } from '../../../../sections/@dashboard/general/analytics';
const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'password', label: 'Password', align: 'left' },
  { id: 'firstName', label: 'Assigned To', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'left' },
];

// ----------------------------------------------------------------------

export default function LinkedinAccountList() {
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

  const { linkedinAccounts } = useSelector(
    (state: { linkedinaccount: LinkedinAccountState }) => state.linkedinaccount
  );

  useEffect(() => {
    dispatch(getLinkedinAccount());
  }, []);

  const [filterName, setFilterName] = useState('');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id: string) => {
    dispatch(deleteLinkedinAccount(id));
  };

  const handleEditRow = (id: string) => {
    navigate(PATH_DASHBOARD.linkedin.linkedinaccountedit(id));
  };

  const handleViewRow = (id: string) => {
    navigate(PATH_DASHBOARD.linkedin.linkedinaccountview(id));
  };

  const dataFiltered = applySortFilter({
    linkedinAccounts,
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
    <Page title="LinkedinAccount: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Linkedin Account"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.linkedin.root },
            { name: 'Linkedinaccount', href: PATH_DASHBOARD.linkedin.linkedinaccount },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.linkedin.linkedinaccountnew}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Linkedin Account
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
              <LinkedinAccountAnalytic
                title="Total"
                total={linkedinAccounts.length}
                title2="Linkedin Account"
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
          <LinkedinAccountTableToolbar filterName={filterName} onFilterName={handleFilterName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={linkedinAccounts.length}
                  numSelected={selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <LinkedinAccountTableRow
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
                    emptyRows={emptyRows(page, rowsPerPage, linkedinAccounts.length)}
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
  linkedinAccounts,
  comparator,
  filterName,
}: {
  linkedinAccounts: LinkedinAccount[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const stabilizedThis = linkedinAccounts.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  linkedinAccounts = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    linkedinAccounts = linkedinAccounts.filter(
      (item: Record<string, any>) =>
        item.firstName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return linkedinAccounts;
}
