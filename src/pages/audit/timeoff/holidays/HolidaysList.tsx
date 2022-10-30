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
import HolidaysTableRow from 'src/sections/timeoff/holidays/HolidaysTableRow';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { useSelector } from 'react-redux';

import { dispatch } from '../../../../redux/store';
import { deleteHolidays, getHolidays } from '../../../../redux/slices/holidays';
import { Holidays, HolidaysState } from '../../../../@types/holidays';
import useSettings from 'src/hooks/useSettings';
import { sumBy } from 'lodash';
import HolidaysAnalytic from 'src/sections/timeoff/holidays/HolidaysAnalytic';
import HolidaysTableToolbar from 'src/sections/timeoff/holidays/HolidaysTableToolbar';

const TABLE_HEAD = [
  { id: 'id', label: '#', align: 'left' },
  { id: 'title', label: 'Title', align: 'left' },
  { id: 'dates', label: 'Holiday Date', align: 'left' },
  { id: 'dates', label: 'Day', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function HolidaysList() {
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

  const { holidays } = useSelector((state: { holidays: HolidaysState }) => state.holidays);
  useEffect(() => {
    dispatch(getHolidays());
  }, []);

  const [filterName, setFilterName] = useState('');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id: string) => {
    dispatch(deleteHolidays(id));
  };

  const handleEditRow = (id: string) => {
    navigate(PATH_DASHBOARD.timeoff.holidaysedit(id));
  };

  const dataFiltered = applySortFilter({
    holidays,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && !!filterName;

  return (
    <Page title="Holiday: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Holidays"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.timeoff.root },
            { name: 'Holidays' },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.timeoff.holidaysnew}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Holidays
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
              <HolidaysAnalytic
                title="Total"
                total={holidays.length}
                title2="Holidays"
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />
              {/* <HolidaysAnalytic
                title="Windows"
                total={getWindowsHolidays()}
                title2="Holidays"
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              /> */}
            </Stack>
          </Scrollbar>
        </Card>
        <Card>
          <HolidaysTableToolbar filterName={filterName} onFilterName={handleFilterName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={holidays.length}
                  numSelected={selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <HolidaysTableRow
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
                    emptyRows={emptyRows(page, rowsPerPage, holidays.length)}
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
  holidays,
  comparator,
  filterName,
}: {
  holidays: Holidays[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const stabilizedThis = holidays.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  holidays = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    holidays = holidays.filter(
      (item: Record<string, any>) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return holidays;
}
