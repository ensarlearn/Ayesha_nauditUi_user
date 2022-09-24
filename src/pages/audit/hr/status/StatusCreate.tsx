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
import { HRStatusState } from '../../../../@types/hrstatus';
import { getHRStatus } from '../../../../redux/slices/hrstatus';
import { dispatch } from '../../../../redux/store';
import HRStatusNewEditForm from '../../../../sections/hr/status/HRStatusNewEditForm';

// ----------------------------------------------------------------------

export default function StatusCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const { hrStatuses } = useSelector((state: { hrstatus: HRStatusState }) => state.hrstatus);

  const currentHRStatus = hrStatuses.find((HRStatus) => paramCase(HRStatus.id) === id);

  useEffect(() => {
    dispatch(getHRStatus());
  }, []);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
        heading={!isEdit ? 'Create a new Status' : 'Edit Status'}
        links={[
          { name: 'HR', href: PATH_DASHBOARD.hr.root },
          { name: 'HRStatus', href: PATH_DASHBOARD.hr.status },
          { name: !isEdit ? 'New Status' : capitalCase(id) },
        ]}
      />

      <HRStatusNewEditForm isEdit={isEdit} currentHRStatus={currentHRStatus} />
    </Container>
  );
}
