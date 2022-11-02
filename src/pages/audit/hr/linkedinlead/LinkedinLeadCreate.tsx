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
import { LinkedinLeadState } from '../../../../@types/linkedinlead';
import { getLinkedinLead } from '../../../../redux/slices/linkedinlead';
import { dispatch } from '../../../../redux/store';
import LinkedinLeadNewEditForm from 'src/sections/hr/linkedinlead/LinkedinLeadNewEditForm';
import LinkedinLeadDetails from './LinkedinLeadDetails';
// ----------------------------------------------------------------------

export default function LinkedinLeadCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');
  const isView = pathname.includes('view');

  const { linkedinLeads } = useSelector((state: { linkedinlead: LinkedinLeadState }) => state.linkedinlead);

  const currentLinkedinLead = linkedinLeads.find((LinkedinLead) => paramCase(LinkedinLead.id) === id);

  useEffect(() => {
    dispatch(getLinkedinLead());
  }, []);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
        heading={!isEdit ? 'Create a new Linkedin Lead' : 'Edit Linkedin Lead'}
        links={[
          { name: 'Linkedin', href: PATH_DASHBOARD.linkedin.root },
          { name: 'Linkedin Lead', href: PATH_DASHBOARD.linkedin.linkedinlead },
          { name: !isEdit ? 'New Linkedin Lead' : capitalCase(id) },
        ]}
      />

      <LinkedinLeadNewEditForm isEdit={isEdit} currentLinkedinLead={currentLinkedinLead} />
      {/* <LinkedinLeadDetails isView={!isEdit} currentLinkedinLead={currentLinkedinLead} /> */}
    </Container>
  );
}
