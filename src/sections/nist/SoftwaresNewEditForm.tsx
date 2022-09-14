import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
// utils
//routes
import { PATH_DASHBOARD } from 'src/routes/paths';

// _mock
// components
import { FormProvider, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { Softwares, SoftwaresRequest } from '../../@types/softwares';
import { dispatch, useSelector } from '../../redux/store';
import { addSoftwares, updateSoftwares } from 'src/redux/slices/software';
import { UserState } from 'src/@types/nistuser';
import { getUsers } from '../../redux/slices/user';

// ----------------------------------------------------------------------------------------

type FormValuesProps = Softwares;

type Props = {
    isEdit: boolean;
    currentSoftware?: Softwares;
};

export default function SoftwaresNewEditForm({ isEdit, currentSoftware }: Props) {
    const navigate = useNavigate();
    const { users } = useSelector((state: { user: UserState }) => state.user);

    const { enqueueSnackbar } = useSnackbar();

    const NewSoftwaresSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        version: Yup.string().required('Version is required'),
        owner: Yup.string().required('Owner is required'),
        vendor: Yup.string().required('Vendor is required'),
        installDate: Yup.string().required('Install date is required'),
        support: Yup.string().required('Support is required'),
        license: Yup.string().required('License is required')
    });

    
    const defaultValues = useMemo(
        () => ({
            id: currentSoftware?.id || '',
            name: currentSoftware?.name || '',
            version: currentSoftware?.version || '',
            owner: currentSoftware?.owner || '',
            vendor: currentSoftware?.vendor || '',
            installDate: currentSoftware?.installDate || '',
            support: currentSoftware?.support || '',
            license: currentSoftware?.license || '',
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentSoftware]
    );

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(NewSoftwaresSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    useEffect(() => {
        console.log(currentSoftware);
        if (isEdit && currentSoftware) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, currentSoftware]);
    useEffect(() => {
        dispatch(getUsers());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onSubmit = async (data: FormValuesProps) => {
        try {
            if (isEdit && currentSoftware) {
                const update: SoftwaresRequest = {
                    id: data.id,
                    name: data.name,
                    version: data.version,
                    owner: data.owner,
                    vendor: data.vendor,
                    installDate: data.installDate,
                    support: data.support,
                    license: data.license,
                };
                dispatch(updateSoftwares(update));
            }
            if (!isEdit) {
                const newsoftware: SoftwaresRequest = {
                    id: data.id,
                    name: data.name,
                    version: data.version,
                    owner: data.owner,
                    vendor: data.vendor,
                    installDate: data.installDate,
                    support: data.support,
                    license: data.license,
                };
                dispatch(addSoftwares(newsoftware));
                reset();
            }

            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
            navigate(PATH_DASHBOARD.nist.softwares);
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Box
                        sx={{
                            display: 'grid',
                            columnGap: 2,
                            rowGap: 3,
                            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                        }}
                        >
                            <RHFTextField name="name" label="Full Name" />
                            <RHFTextField name="version" label="Version" />
                            <RHFTextField name="owner" label="Owner" />
                            <RHFTextField name="vendor" label="Vendor" />
                            <RHFTextField name="installDate" label="Install Date" />
                            <RHFSelect name="support" label="Support">
                                <option>Yes</option>
                                <option>No</option>
                            </RHFSelect>
                            <RHFTextField name="license" label="License" />

                        </Box>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}></Stack>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            {!isEdit ? 'Create Software' : 'Save Changes'}
                        </LoadingButton>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
