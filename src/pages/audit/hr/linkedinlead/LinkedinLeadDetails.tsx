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

import Iconify from '../../../../components/Iconify';

// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// _mock_
// hooks
import useSettings from '../../../../hooks/useSettings';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// sections

import Scrollbar from '../../../../components/Scrollbar';
import { LinkedinLead } from "../../../../@types/linkedinlead";


type Props = {
  isView: boolean;
  currentLinkedinLead?: LinkedinLead;
};

export default function LinkedinLeadDetails({ isView, currentLinkedinLead }: Props) {

  const { themeStretch } = useSettings();
  const navigate = useNavigate();

  const { id } = useParams();
  const handleEdit = () => {
    navigate(PATH_DASHBOARD.linkedin.linkedinleadedit(id));
  };
  return (
    <Page title="Linkedin: Lead">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Linkedin Lead"
          links={[
            { name: 'Linkedin', href: PATH_DASHBOARD.linkedin.root },
            { name: 'Linkedinlead', href: PATH_DASHBOARD.linkedin.linkedinlead },
            { name: `Lead-${id}` || '' },
          ]}
        />

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
                    <TableCell>Website Link</TableCell>
                    <TableCell>LinkedIn Link</TableCell>
                    <TableCell>Sent</TableCell>
                    <TableCell>Sent From</TableCell>
                    <TableCell>Response Type</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell> {currentLinkedinLead?.leadName} </TableCell>
                    <TableCell>{currentLinkedinLead?.websiteLink} </TableCell>
                    <TableCell>{currentLinkedinLead?.linkedinLink} </TableCell>
                    <TableCell>{currentLinkedinLead?.sent}</TableCell>
                    <TableCell>
                      {currentLinkedinLead?.user?.firstName} {currentLinkedinLead?.user?.lastName}
                    </TableCell>
                    <TableCell align="left">{currentLinkedinLead?.responseType}</TableCell>
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
