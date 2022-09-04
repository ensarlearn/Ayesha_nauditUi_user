// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button } from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
import useSettings from '../../../hooks/useSettings';
// _mock_
import {
  _appFeatured,
  _appAuthors,
  _appInstalled,
  _appRelated,
  _appInvoices,
} from '../../../_mock';
// components
import Page from '../../../components/Page';
// sections
import {
  AppWidget,
  AppWelcome,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppWidgetSummary,
  AppCurrentDownload,
  AppTopInstalledCountries,
} from '../../../sections/@dashboard/general/app';
// assets
import { SeoIllustration } from '../../../assets';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();

  const theme = useTheme();

  const { themeStretch } = useSettings();

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppWelcome
              title={`Welcome Audit! \n ${user?.displayName}`}
              description="Ensar Audit"
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
