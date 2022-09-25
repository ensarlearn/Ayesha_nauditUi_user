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
import { HRTimesheetAttendanceState } from '../../../../@types/hrtimesheetattendance';
import { getHRTimesheetAttendance } from '../../../../redux/slices/hrtimesheetattendance';
import { dispatch } from '../../../../redux/store';
import HRTimesheetAttendanceNewEditForm from '../../../../sections/hr/timesheetattendance/HRTimesheetAttendanceNewEditForm';

// ----------------------------------------------------------------------

export default function TimesheetAttendanceCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const { hrTimesheetAttendances } = useSelector((state: { hrtimesheetattendance: HRTimesheetAttendanceState }) => state.hrtimesheetattendance);

  const currentHRTimesheetAttendance = hrTimesheetAttendances.find((HRTimesheetAttendance) => paramCase(HRTimesheetAttendance.id) === id);

  useEffect(() => {
    dispatch(getHRTimesheetAttendance());
  }, []);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
        heading={!isEdit ? 'Create a new TimesheetAttendance' : 'Edit TimesheetAttendance'}
        links={[
          { name: 'HR', href: PATH_DASHBOARD.hr.root },
          { name: 'HRTimesheetAttendance', href: PATH_DASHBOARD.hr.timesheetattendance },
          { name: !isEdit ? 'New TimesheetAttendance' : capitalCase(id) },
        ]}
      />

      <HRTimesheetAttendanceNewEditForm isEdit={isEdit} currentHRTimesheetAttendance={currentHRTimesheetAttendance} />
    </Container>
  );
}
