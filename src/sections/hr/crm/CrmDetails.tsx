import { useParams, useNavigate } from 'react-router-dom';

// @mui
import {
  Container,
  Card,
  Grid,
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  Button,
} from '@mui/material';

import Iconify from '../../../components/Iconify';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// _mock_
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
// sections

import Scrollbar from '../../../components/Scrollbar';
import { Crm } from '../../../@types/crm';

type Props = {
  currentCrm?: Crm;
};

export default function CrmDetails({ currentCrm }: Props) {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();

  const { id } = useParams();
  const handleEdit = () => {
    navigate(PATH_DASHBOARD.linkedin.crmedit(id));
  };
  return (
    <Page title="Crm: Account">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card sx={{ pt: 5, px: 5 }}>
          <Grid container>
            <Button
              color="inherit"
              variant="outlined"
              onClick={handleEdit}
              startIcon={<Iconify icon={'eva:edit-fill'} />}
              sx={{ alignSelf: 'flex-end' }}
            >
              Edit
            </Button>
          </Grid>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 960 }}>
              <Table>
                <TableHead
                  sx={{
                    borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    '& th': { backgroundColor: 'transparent' },
                  }}
                >
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Password</TableCell>
                    <TableCell>Join Date</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell>
                      {currentCrm?.firstName} {currentCrm?.lastName}
                    </TableCell>
                    <TableCell> {currentCrm?.email} </TableCell>
                    <TableCell>{currentCrm?.password} </TableCell>
                    <TableCell>{currentCrm?.joinDate} </TableCell>
                    <TableCell>{currentCrm?.type} </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
}
