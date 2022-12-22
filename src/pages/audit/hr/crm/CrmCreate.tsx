import { capitalCase, paramCase } from 'change-case';
import { useLocation, useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../../../routes/paths';
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
import CrmNewEditForm from 'src/sections/hr/crm/CrmNewEditForm';

// ----------------------------------------------------------------------

export default function CrmCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const { crms } = useSelector((state: { crm: CrmState }) => state.crm);

  const currentCrm = crms.find((Crm) => paramCase(Crm.id) === id);

  useEffect(() => {
    dispatch(getCrm());
  }, []);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
        heading={!isEdit ? 'Create a new CRM ' : 'Edit CRM'}
        links={[
          { name: 'CRM', href: PATH_DASHBOARD.linkedin.root },
          { name: 'CRM', href: PATH_DASHBOARD.linkedin.crm },
          { name: !isEdit ? 'New CRM' : capitalCase(id) },
        ]}
      />

      <CrmNewEditForm isEdit={isEdit} currentCrm={currentCrm} />
    </Container>
  );
}
