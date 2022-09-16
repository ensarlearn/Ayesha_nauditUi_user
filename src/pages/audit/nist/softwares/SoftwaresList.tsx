import {
  Card,
  Container,
  Box,
  TableContainer,
  TablePagination,
  TableBody,
  Table,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Iconify from '../../../../components/Iconify';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Softwares, SoftwaresState } from 'src/@types/softwares';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import { TableEmptyRows, TableHeadCustom, TableNoData } from 'src/components/table';
import useSettings from 'src/hooks/useSettings';
import useTable, { emptyRows, getComparator } from 'src/hooks/useTable';
import useTabs from 'src/hooks/useTabs';
import { deleteSoftwares, getSoftwares } from 'src/redux/slices/software';
import { dispatch } from 'src/redux/store';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Scrollbar from '../../../../components/Scrollbar';
import { SoftwaresTableToolbar, SoftwareTableRow } from 'src/sections/nist';

const ROLE_OPTIONS = ['all', 'ux designer'];

const TABLE_HEAD = [
  { id: 'id', label: 'Id', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'version', label: 'Version', align: 'left' },
  { id: 'owner', label: 'Owner', align: 'left' },
  { id: 'vendor', label: 'Vendor', align: 'left' },
  { id: 'installDate', label: 'Install Date', align: 'left' },
  { id: 'support', label: 'Support', align: 'left' },
  { id: 'license', label: 'License', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'left' },
];

// -------------------------------------------------------------------------

export default function SoftwaresList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const { softwares, createStatus, updateStatus, errorMessage } = useSelector(
    (state: { softwares: SoftwaresState }) => state.softwares
  );
  useEffect(() => {
    dispatch(getSoftwares());
  }, []);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  const [tableData, setTableData] = useState(softwares);

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = (id: string) => {
    const deleteRow = softwares.filter((row) => row.id !== id);
    dispatch(deleteSoftwares(id));
  };

  const handleEditRow = (id: string) => {
    navigate(PATH_DASHBOARD.nist.softwareedit(id));
  };

  const dataFiltered = applySortFilter({
    softwares,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  return (
    <Page title="">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card>
          <HeaderBreadcrumbs
            heading="Test"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.nist.root },
              { name: 'Software' },
              { name: 'List' },
            ]}
            action={
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.nist.softwarenew}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                New Softwares
              </Button>
            }
          />
          <SoftwaresTableToolbar
            filterName={filterName}
            filterRole={filterRole}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            optionsRole={ROLE_OPTIONS}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={softwares.length}
                  numSelected={selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <SoftwareTableRow
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
                    emptyRows={emptyRows(page, rowsPerPage, softwares.length)}
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

// --------------------------------------------------------------------------------

function applySortFilter({
  softwares,
  comparator,
  filterName,
  filterStatus,
  filterRole,
}: {
  softwares: Softwares[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterRole: string;
}) {
  const stabilizedThis = softwares.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  softwares = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    softwares = softwares.filter(
      (item: Record<string, any>) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    softwares = softwares.filter((item: Record<string, any>) => item.role === filterStatus);
  }

  if (filterRole !== 'all') {
    softwares = softwares.filter((item: Record<string, any>) => item.role === filterRole);
  }

  return softwares;
}
