import { capitalCase, paramCase } from 'change-case';
import { useLocation, useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// hooks
import useSettings from 'src/hooks/useSettings';
// _mock_
// components
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
// sections
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SoftwaresState } from 'src/@types/softwares';
import { getSoftwares } from 'src/redux/slices/software';
import { dispatch } from 'src/redux/store';
import SoftwaresNewEditForm from 'src/sections/nist/SoftwaresNewEditForm';

// ------------------------------------------------------------------------------------------

export default function SoftwaresCreate() {
    const { themeStretch } = useSettings();

    const { pathname } = useLocation();

    const { id = '' } = useParams();

    const isEdit = pathname.includes('softwareedit');

    const { softwares } = useSelector((state: { softwares: SoftwaresState }) => state.softwares);

    const currentSoftware = softwares.find((software) => paramCase(software.id) === id);

    useEffect(() => {
        dispatch(getSoftwares());
    }, []);

    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
            heading={!isEdit ? 'Create a new software' : 'Edit software'}
            links={[
                { name: 'NIST', href: PATH_DASHBOARD.nist.root },
                { name: 'Softwares', href: PATH_DASHBOARD.nist.softwares },
                { name: !isEdit ? 'New software' : capitalCase(id) },
            ]}
            />

            <SoftwaresNewEditForm isEdit={isEdit} currentSoftware={currentSoftware} />
        </Container>
    );
}