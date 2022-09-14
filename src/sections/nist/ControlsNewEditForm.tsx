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
import { Controls, ControlsRequest } from '../../@types/controls';
import { dispatch, useSelector } from '../../redux/store';
import { addControls, updateControls } from 'src/redux/slices/controls';
import { UserState } from 'src/@types/nistuser';
import { getUsers } from '../../redux/slices/user';

// ----------------------------------------------------------------------------------------

type FormValuesProps = Controls;

type Props = {
    isEdit: boolean;
    currentControl?: Controls;
};

export default function ControlsNewEditForm({ isEdit, currentControl }: Props) {
    const navigate = useNavigate();
    const { users } = useSelector((state: { user: UserState }) => state.user);

    const { enqueueSnackbar } = useSnackbar();

    const NewControlsSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        subcategory: Yup.string().required('Sub-category is required'),
    });

    
    const defaultValues = useMemo(
        () => ({
            id: currentControl?.id || '',
            name: currentControl?.name || '',
            subcategory: currentControl?.subcategory || '',
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentControl]
    );

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(NewControlsSchema),
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
        console.log(currentControl);
        if (isEdit && currentControl) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, currentControl]);
    useEffect(() => {
        dispatch(getUsers());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onSubmit = async (data: FormValuesProps) => {
        try {
            if (isEdit && currentControl) {
                const update: ControlsRequest = {
                    id: data.id,
                    name: data.name,
                    subcategory: data.subcategory,
                };
                dispatch(updateControls(update));
            }
            if (!isEdit) {
                const newcontrol: ControlsRequest = {
                    id: data.id,
                    name: data.name,
                    subcategory: data.subcategory,
                };
                dispatch(addControls(newcontrol));
                reset();
            }

            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
            navigate(PATH_DASHBOARD.nist.controls);
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
                            <RHFTextField name="subcategory" label="Sub Category" />
                        </Box>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}></Stack>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            {!isEdit ? 'Create Control' : 'Save Changes'}
                        </LoadingButton>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
