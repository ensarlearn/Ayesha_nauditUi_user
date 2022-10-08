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
import { LinkedinAccountState } from '../../../../@types/linkedinaccount';
import { getLinkedinAccount } from '../../../../redux/slices/linkedinaccount';
import { dispatch } from '../../../../redux/store';
import LinkedinAccountNewEditForm from 'src/sections/hr/linkedinaccount/LinkedinAccountNewEditForm';

// ----------------------------------------------------------------------

export default function LinkedinAccountCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const { linkedinAccounts } = useSelector((state: { linkedinaccount: LinkedinAccountState }) => state.linkedinaccount);

  const currentLinkedinAccount = linkedinAccounts.find((LinkedinAccount) => paramCase(LinkedinAccount.id) === id);

  useEffect(() => {
    dispatch(getLinkedinAccount());
  }, []);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
        heading={!isEdit ? 'Create a new Linkedin Account' : 'Edit Linkedin Account'}
        links={[
          { name: 'Linkedin', href: PATH_DASHBOARD.linkedin.root },
          { name: 'Linkedin Account', href: PATH_DASHBOARD.linkedin.linkedinaccount },
          { name: !isEdit ? 'New Linkedin Account' : capitalCase(id) },
        ]}
      />

      <LinkedinAccountNewEditForm isEdit={isEdit} currentLinkedinAccount={currentLinkedinAccount} />
    </Container>
  );
}
