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
import { HRProjectState } from '../../../../@types/hrproject';
import { getHRProject } from '../../../../redux/slices/hrproject';
import { dispatch } from '../../../../redux/store';
import HRProjectNewEditForm from '../../../../sections/hr/project/HRProjectNewEditForm';

// ----------------------------------------------------------------------

export default function ProjectCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const { hrProjects } = useSelector((state: { hrproject: HRProjectState }) => state.hrproject);

  const currentHRProject = hrProjects.find((HRProject) => paramCase(HRProject.id) === id);

  useEffect(() => {
    dispatch(getHRProject());
  }, []);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
        heading={!isEdit ? 'Create a new Project' : 'Edit Project'}
        links={[
          { name: 'HR', href: PATH_DASHBOARD.hr.root },
          { name: 'HR Project', href: PATH_DASHBOARD.hr.project },
          { name: !isEdit ? 'New Project' : capitalCase(id) },
        ]}
      />

      <HRProjectNewEditForm isEdit={isEdit} currentHRProject={currentHRProject} />
    </Container>
  );
}
