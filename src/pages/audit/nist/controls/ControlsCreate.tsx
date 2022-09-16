import { capitalCase, paramCase } from "change-case";
import { useLocation, useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from 'src/routes/paths';
// hooks
import useSettings from 'src/hooks/useSettings';
// _mock_
// components
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
// sections
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ControlsState } from 'src/@types/controls';
import { getControls } from 'src/redux/slices/controls';
import { dispatch } from 'src/redux/store';
import ControlsNewEditForm from 'src/sections/nist/ControlsNewEditForm';

// -----------------------------------------------------------------------------

export default function ControlsCreate() {
    const { themeStretch } = useSettings();

    const { pathname } = useLocation();

    const { id = '' } = useParams();

    const isEdit = pathname.includes('controlsedit');

    const { controls } = useSelector((state: { controls: ControlsState }) => state.controls);

    const currentControl = controls.find((control) => paramCase(control.id) === id);

    useEffect(() => {
        dispatch(getControls());
    }, []);

    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
            heading={!isEdit ? 'Create a new control' : 'Edit control' }
            links={[
                { name: 'NIST', href: PATH_DASHBOARD.nist.root },
                { name: 'Controls', href: PATH_DASHBOARD.nist.controls },
                { name: !isEdit ? 'New Control' : capitalCase(id) },
            ]}
            />

            <ControlsNewEditForm isEdit={isEdit} currentControl = {currentControl} />
        </Container>
    );
}

