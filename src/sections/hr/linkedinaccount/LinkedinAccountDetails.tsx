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
import { LinkedinAccount } from '../../../@types/linkedinaccount';

type Props = {
  currentLinkedinAccount?: LinkedinAccount;
};

export default function LinkedinAccountDetails({ currentLinkedinAccount }: Props) {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();

  const { id } = useParams();
  const handleEdit = () => {
    navigate(PATH_DASHBOARD.linkedin.linkedinaccountedit(id));
  };
  return (
    <Page title="Linkedin: Account">
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
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell>
                      {currentLinkedinAccount?.firstName} {currentLinkedinAccount?.lastName}
                    </TableCell>
                    <TableCell> {currentLinkedinAccount?.email} </TableCell>
                    <TableCell>{currentLinkedinAccount?.password} </TableCell>
                    <TableCell>
                      {currentLinkedinAccount?.user?.firstName}{' '}
                      {currentLinkedinAccount?.user?.lastName}{' '}
                    </TableCell>
                    <TableCell>{currentLinkedinAccount?.type} </TableCell>
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
