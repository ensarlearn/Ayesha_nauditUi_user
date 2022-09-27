import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, } from '@mui/material';
// utils
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// _mock
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import { Role, RoleRequest } from '../../../../@types/role';
import { dispatch, useSelector } from '../../../../redux/store';
import { addRole, updateRole } from '../../../../redux/slices/role';
import { UserState } from '../../../../@types/nistuser';

// ----------------------------------------------------------------------

//type FormValuesProps = Role;

interface FormValuesProps extends Partial<Role> {
  softwareids: string[];
  //imageurl: File | any;
}

type Props = {
  isEdit: boolean;
  currentRole?: Role;
};

export default function RoleNewEditForm({ isEdit, currentRole }: Props) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();


  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentRole?.id || '',
      name: currentRole?.name || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentRole]
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
    if (isEdit && currentRole) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentRole]);



  const onSubmit = async (data: FormValuesProps) => {
    const request: RoleRequest = {
      name: data.name,

    };

    try {
      if (isEdit && currentRole) {
        request.id = data.id;
        dispatch(updateRole(request));
      }
      if (!isEdit) {
        dispatch(addRole(request));
        reset();
      }

      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.user.role);
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
                {!isEdit ? 'Create Role' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
