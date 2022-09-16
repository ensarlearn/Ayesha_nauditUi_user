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
import { SystemsState } from '../../../../@types/systems';
import { getSystems } from '../../../../redux/slices/systems';
import { dispatch } from '../../../../redux/store';
import SystemsNewEditForm from '../../../../sections/nist/SystemsNewEditForm';

// ----------------------------------------------------------------------

export default function SystemsCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const { systems } = useSelector((state: { systems: SystemsState }) => state.systems);

  const currentSystem = systems.find((system) => paramCase(system.id) === id);

  useEffect(() => {
    dispatch(getSystems());
  }, []);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
        heading={!isEdit ? 'Create a new user' : 'Edit user'}
        links={[
          { name: 'NIST', href: PATH_DASHBOARD.nist.root },
          { name: 'Systems', href: PATH_DASHBOARD.nist.systems },
          { name: !isEdit ? 'New user' : capitalCase(id) },
        ]}
      />

      <SystemsNewEditForm isEdit={isEdit} currentSystem={currentSystem} />
    </Container>
  );
}
