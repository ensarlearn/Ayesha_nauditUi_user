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
import { HRSubtaskState } from '../../../../@types/hrsubtask';
import { getHRSubtask } from '../../../../redux/slices/hrsubtask';
import { dispatch } from '../../../../redux/store';
import HRSubtaskNewEditForm from 'src/sections/hr/subtask/HRSubtaskNewEditForm';

// ----------------------------------------------------------------------

export default function SubtaskCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const { hrSubtasks } = useSelector((state: { hrsubtask: HRSubtaskState }) => state.hrsubtask);

  const currentHRSubtask = hrSubtasks.find((HRSubtask) => paramCase(HRSubtask.id) === id);

  useEffect(() => {
    dispatch(getHRSubtask());
  }, []);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
        heading={!isEdit ? 'Create a new Subtask' : 'Edit Subtask'}
        links={[
          { name: 'HR', href: PATH_DASHBOARD.hr.root },
          { name: 'HRSubtask', href: PATH_DASHBOARD.hr.subtask },
          { name: !isEdit ? 'New Subtask' : capitalCase(id) },
        ]}
      />

      <HRSubtaskNewEditForm isEdit={isEdit} currentHRSubtask={currentHRSubtask} />
    </Container>
  );
}
