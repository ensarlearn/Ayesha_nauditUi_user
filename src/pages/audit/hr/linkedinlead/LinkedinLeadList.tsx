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
//import { LinkedinLeadTableToolbar, LinkedinLeadTableRow } from '../../../../sections/hr/linkedinLead';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { useSelector } from 'react-redux';

import { dispatch } from '../../../../redux/store';
import { deleteLinkedinLead, getLinkedinLead } from '../../../../redux/slices/linkedinlead';
import { LinkedinLead, LinkedinLeadState } from '../../../../@types/linkedinlead';
import useSettings from 'src/hooks/useSettings';

import LinkedinLeadAnalytic from 'src/sections/hr/linkedinlead/LinkedinLeadAnalytic';
import LinkedinLeadTableToolbar from 'src/sections/hr/linkedinlead/LinkedinLeadTableToolbar';
import LinkedinLeadTableRow from 'src/sections/hr/linkedinlead/LinkedinLeadTableRow';
import { Grid } from '@mui/material';
import { _analyticOrderTimeline } from '../../../../_mock';
import { AnalyticsOrderTimeline } from '../../../../sections/@dashboard/general/analytics';
const TABLE_HEAD = [
  { id: 'leadName', label: 'Name', align: 'left' },
  { id: 'websiteLink', label: 'Website Link', align: 'left' },
  { id: 'linkedinLink', label: 'LinkedIn Link', align: 'left' },
  { id: 'sent', label: 'Sent', align: 'left' },
  { id: 'user', label: 'Sent From', align: 'left' },
  { id: 'responseType', label: 'Response Type', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'left' },
];

// ----------------------------------------------------------------------

export default function LinkedinLeadList() {
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

  const { linkedinLeads } = useSelector(
    (state: { linkedinlead: LinkedinLeadState }) => state.linkedinlead
  );

  useEffect(() => {
    dispatch(getLinkedinLead());
  }, []);

  const [filterName, setFilterName] = useState('');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id: string) => {
    dispatch(deleteLinkedinLead(id));
  };

  const handleEditRow = (id: string) => {
    navigate(PATH_DASHBOARD.linkedin.linkedinleadedit(id));
  };

  const dataFiltered = applySortFilter({
    linkedinLeads,
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
    <Page title="LinkedinLead: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Linkedin Lead"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.linkedin.root },
            { name: 'Linkedinlead', href: PATH_DASHBOARD.linkedin.linkedinlead },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.linkedin.linkedinleadnew}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Linkedin Lead
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
              <LinkedinLeadAnalytic
                title="Total"
                total={linkedinLeads.length}
                title2="Linkedin Lead"
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
          <LinkedinLeadTableToolbar filterName={filterName} onFilterName={handleFilterName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={linkedinLeads.length}
                  numSelected={selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <LinkedinLeadTableRow
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
                    emptyRows={emptyRows(page, rowsPerPage, linkedinLeads.length)}
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
  linkedinLeads,
  comparator,
  filterName,
}: {
  linkedinLeads: LinkedinLead[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const stabilizedThis = linkedinLeads.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  linkedinLeads = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    linkedinLeads = linkedinLeads.filter(
      (item: Record<string, any>) =>
        item.websiteLink.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return linkedinLeads;
}
