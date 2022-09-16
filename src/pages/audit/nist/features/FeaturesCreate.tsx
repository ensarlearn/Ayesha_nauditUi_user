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
import { FeaturesState } from '../../../../@types/features';
import { getFeatures } from 'src/redux/slices/feature';
import { dispatch } from '../../../../redux/store';
import FeaturesNewEditForm from '../../../../sections/nist/FeaturesNewEditForm';

// -----------------------------------------------------------------------------------------

export default function FeaturesCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('featuresedit');

  const { features } = useSelector((state: { features: FeaturesState }) => state.features);

  const currentFeature = features.find((feature) => paramCase(feature.id) === id);

  useEffect(() => {
    dispatch(getFeatures());
  }, []);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
        heading={!isEdit ? 'Create a new feature' : 'Edit feature'}
        links={[
          { name: 'NIST', href: PATH_DASHBOARD.nist.root },
          { name: 'Features', href: PATH_DASHBOARD.nist.features },
          { name: !isEdit ? 'New feature' : capitalCase(id) },
        ]}
      />

      <FeaturesNewEditForm isEdit={isEdit} currentFeature={currentFeature} />
    </Container>
  );
}
