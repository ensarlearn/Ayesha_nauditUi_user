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
import { SystemsTableToolbar, SystemTableRow } from '../../../../sections/nist';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { useSelector } from 'react-redux';

import { dispatch } from '../../../../redux/store';
import { deleteSystems, getSystems, postUploadFile } from '../../../../redux/slices/systems';
import { Systems, SystemsState } from '../../../../@types/systems';
import useSettings from 'src/hooks/useSettings';
import InvoiceAnalytic from 'src/sections/@dashboard/invoice/InvoiceAnalytic';
import { sumBy } from 'lodash';
import SystemsAnalytic from 'src/sections/nist/systems/SystemsAnalytic';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'os', label: 'OS', align: 'left' },
  { id: 'cpu', label: 'CPU', align: 'left' },
  { id: 'ram', label: 'RAM', align: 'left' },
  { id: 'hardDisk', label: 'Hard Disk', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function SystemsList() {
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

  const { systems } = useSelector((state: { systems: SystemsState }) => state.systems);
  useEffect(() => {
    dispatch(getSystems());
  }, []);

  const [filterName, setFilterName] = useState('');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id: string) => {
    dispatch(deleteSystems(id));
  };

  const handleEditRow = (id: string) => {
    navigate(PATH_DASHBOARD.nist.systemsedit(id));
  };

  const dataFiltered = applySortFilter({
    systems,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && !!filterName;

  const getWindowsSystems = () => systems.filter((item) => item.os?.includes('Windows')).length;
  const handleOnChange = (e: any) => {
    const file = e.target.files[0];
    dispatch(postUploadFile(file));
  };
  return (
    <Page title="System: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Systems"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.nist.root },
            { name: 'Systems' },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.nist.systemsnew}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Systems
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
              <SystemsAnalytic
                title="Total"
                total={systems.length}
                title2="Systems"
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />
              <SystemsAnalytic
                title="Windows"
                total={getWindowsSystems()}
                title2="Systems"
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />
            </Stack>
          </Scrollbar>
        </Card>
        <Card>
          <SystemsTableToolbar filterName={filterName} onFilterName={handleFilterName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={systems.length}
                  numSelected={selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <SystemTableRow
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
                    emptyRows={emptyRows(page, rowsPerPage, systems.length)}
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
  systems,
  comparator,
  filterName,
}: {
  systems: Systems[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const stabilizedThis = systems.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  systems = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    systems = systems.filter(
      (item: Record<string, any>) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return systems;
}
