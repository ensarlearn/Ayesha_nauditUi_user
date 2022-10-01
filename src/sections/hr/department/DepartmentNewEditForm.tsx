import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker, LoadingButton } from '@mui/lab';
import { Autocomplete, Box, Button, Card, Chip, Grid, Stack, TextField } from '@mui/material';
// utils
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// _mock
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import Image from '../../../components/Image';
import { Department, DepartmentRequest } from '../../../@types/department';
import { dispatch, useSelector } from '../../../redux/store';
import { addDepartment, updateDepartment } from '../../../redux/slices/department';
import { UserState } from '../../../@types/nistuser';
import { getUsers } from '../../../redux/slices/user';
import { SoftwaresState } from 'src/@types/softwares';
import { getManufacturers, getSoftwares } from 'src/redux/slices/software';
import { HOST_API } from '../../../config';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

//type FormValuesProps = Department;

interface FormValuesProps extends Partial<Department> {
  softwareids: string[];
  //imageurl: File | any;
}

type Props = {
  isEdit: boolean;
  currentDepartment?: Department;
};

export default function DepartmentNewEditForm({ isEdit, currentDepartment }: Props) {
  const navigate = useNavigate();
  const { users } = useSelector((state: { user: UserState }) => state.user);

  const { enqueueSnackbar } = useSnackbar();


  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentDepartment?.id || '',
      name: currentDepartment?.name || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDepartment]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentDepartment) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentDepartment]);



  const onSubmit = async (data: FormValuesProps) => {
    const request: DepartmentRequest = {
      name: data.name,

    };

    try {
      if (isEdit && currentDepartment) {
        request.id = data.id;
        dispatch(updateDepartment(request));
      }
      if (!isEdit) {
        dispatch(addDepartment(request));
        reset();
      }

      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.hr.department);
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
              <RHFTextField name="name" label="Name" />

            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Department' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
