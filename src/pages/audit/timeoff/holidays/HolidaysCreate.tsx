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
import { HolidaysState } from '../../../../@types/holidays';
import { getHolidays } from '../../../../redux/slices/holidays';
import { dispatch } from '../../../../redux/store';
import HolidaysNewEditForm from '../../../../sections/timeoff/holidays/HolidaysNewEditForm';

// ----------------------------------------------------------------------

export default function HolidaysCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const { holidays } = useSelector((state: { holidays: HolidaysState }) => state.holidays);

  const currentHoliday = holidays.find((holiday) => paramCase(holiday.id) === id);

  useEffect(() => {
    dispatch(getHolidays());
  }, []);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
        heading={!isEdit ? 'Create a new Holiday' : 'Edit Holiday'}
        links={[
          { name: 'TIMEOFF', href: PATH_DASHBOARD.timeoff.root },
          { name: 'Holidays', href: PATH_DASHBOARD.timeoff.holidays },
          { name: !isEdit ? 'New Holiday' : capitalCase(id) },
        ]}
      />

      <HolidaysNewEditForm isEdit={isEdit} currentHoliday={currentHoliday} />
    </Container>
  );
}
