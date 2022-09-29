import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
// _mock_
import { _userList } from '../../../../_mock';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// sections
import EmployeeNewEditForm from 'src/sections/@dashboard/user/employee/EmployeeNewEditForm';

// ----------------------------------------------------------------------
import { useSelector } from 'react-redux';
import { EmployeeState } from '../../../../@types/employee';


export default function EmployeeCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { name = '' } = useParams();
  const { id = '' } = useParams();


  const isEdit = pathname.includes('edit');

  // const currentEmployee = _userList.find((user) => paramCase(user.name) === name);

  const { employees } = useSelector((state: { employee: EmployeeState }) => state.employee);

  const currentEmployee = employees.find((Employee) => paramCase(Employee.id) === id);
  return (
    <Page title="Employee: Create a new employee">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new employee' : 'Edit employee'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Employee', href: PATH_DASHBOARD.user.employee },
            { name: !isEdit ? 'New employee' : capitalCase(name) },
          ]}
        />

        <EmployeeNewEditForm isEdit={isEdit} currentEmployee={currentEmployee} />
      </Container>
    </Page>
  );
}
