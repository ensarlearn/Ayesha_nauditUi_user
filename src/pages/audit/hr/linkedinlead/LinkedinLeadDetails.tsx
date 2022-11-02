import { useParams, useNavigate } from 'react-router-dom';
// @mui
import {
  Container,
  Box,
  Card,
  Grid,
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
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
import { styled } from '@mui/material/styles';
import { LinkedinLead } from '../../../.././@types/linkedinlead';


type Props = {
  isView: boolean;
  currentLinkedinLead?: LinkedinLead;
};
// ----------------------------------------------------------------------

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

export default function LinkedinLeadDetails({ isView, currentLinkedinLead }: Props) {

  console.log(currentLinkedinLead?.user.id)
//   const {  } = row;
// console.log('....', row)
  const { themeStretch } = useSettings();
  const navigate = useNavigate();

  const { id } = useParams();
  const handleEdit =  () => {
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
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Website Link</TableCell>
                    <TableCell align="right">LinkedIn Link</TableCell>
                    <TableCell align="right">Sent</TableCell>
                    <TableCell align="right">Sent From</TableCell>
                    <TableCell align="right">Response Type</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {/* {items.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell align="left">
                      <Box sx={{ maxWidth: 560 }}>
                        <Typography variant="subtitle2">{row.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                          {row.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">{row.quantity}</TableCell>
                    <TableCell align="right">{fCurrency(row.price)}</TableCell>
                    <TableCell align="right">{fCurrency(row.price * row.quantity)}</TableCell>
                  </TableRow>
                ))} */}

                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
}
