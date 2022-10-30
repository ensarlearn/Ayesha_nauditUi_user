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
import { TimeoffState } from '../../../../@types/timeoff';
import { getTimeoff } from '../../../../redux/slices/timeoff';
import { dispatch } from '../../../../redux/store';
import TimeoffNewEditForm from 'src/sections/timeoff/timeoff/TimeoffNewEditForm';

// ----------------------------------------------------------------------

export default function TimeoffCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const { timeoffs } = useSelector((state: { timeoff: TimeoffState }) => state.timeoff);

  const currentTimeoff = timeoffs.find((Timeoff) => paramCase(Timeoff.id) === id);

  useEffect(() => {
    dispatch(getTimeoff());
  }, []);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
        heading={!isEdit ? 'Create a new Timeoff' : 'Edit Timeoff'}
        links={[
          { name: 'TIMEOFF', href: PATH_DASHBOARD.hr.root },
          { name: 'TIMEOFF Timeoff', href: PATH_DASHBOARD.timeoff.timeoff },
          { name: !isEdit ? 'New Timeoff' : capitalCase(id) },
        ]}
      />

      <TimeoffNewEditForm isEdit={isEdit} currentTimeoff={currentTimeoff} />
    </Container>
  );
}
