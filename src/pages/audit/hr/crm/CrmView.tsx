import { paramCase } from 'change-case';
import { useLocation, useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
// _mock_
// components
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// sections
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CrmState } from '../../../../@types/crm';
import { getCrm } from '../../../../redux/slices/crm';
import { dispatch } from '../../../../redux/store';
import CrmDetails from '../../../../sections/hr/crm/CrmDetails';

// ----------------------------------------------------------------------

export default function CrmView() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const { crms } = useSelector(
    (state: { crm: CrmState }) => state.crm
  );

  const currentCrm = crms.find(
    (Crm) => paramCase(Crm.id) === id
  );

  useEffect(() => {
    dispatch(getCrm());
  }, []);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
        heading="Linkedin Account"
        links={[
          { name: 'Linkedin', href: PATH_DASHBOARD.linkedin.root },
          { name: 'Linkedin Account', href: PATH_DASHBOARD.linkedin.crm },
          { name: 'View' },
        ]}
      />
      <CrmDetails currentCrm={currentCrm} />
    </Container>
  );
}
