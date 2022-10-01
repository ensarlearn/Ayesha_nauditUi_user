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
import { DepartmentState } from '../../../../@types/department';
import { getDepartment } from '../../../../redux/slices/department';
import { dispatch } from '../../../../redux/store';
import DepartmentNewEditForm from 'src/sections/hr/department/DepartmentNewEditForm';

// ----------------------------------------------------------------------

export default function DepartmentCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const { departments } = useSelector((state: { department: DepartmentState }) => state.department);

  const currentDepartment = departments.find((Department) => paramCase(Department.id) === id);

  useEffect(() => {
    dispatch(getDepartment());
  }, []);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
        heading={!isEdit ? 'Create a new Department' : 'Edit Department'}
        links={[
          { name: 'HR', href: PATH_DASHBOARD.hr.root },
          { name: 'HR Department', href: PATH_DASHBOARD.hr.department },
          { name: !isEdit ? 'New Department' : capitalCase(id) },
        ]}
      />

      <DepartmentNewEditForm isEdit={isEdit} currentDepartment={currentDepartment} />
    </Container>
  );
}
