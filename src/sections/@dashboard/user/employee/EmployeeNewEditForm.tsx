import * as Yup from 'yup';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel } from '@mui/material';
// utils
import { fData } from '../../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// @types
import { Employee } from '../../../../@types/employee';
import { RoleState } from '../../../../@types/role';
// _mock
import { countries } from '../../../../_mock';
// components
import Label from '../../../../components/Label';
import { dispatch, useSelector } from '../../../../redux/store';
import { getRole } from '../../../../redux/slices/role';

import {
  FormProvider,
  RHFSelect,

  RHFTextField,
  RHFUploadAvatar,
} from '../../../../components/hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = Employee;

type Props = {
  isEdit: boolean;
  currentEmployee?: Employee;
};

export default function EmployeeNewEditForm({ isEdit, currentEmployee }: Props) {
  const navigate = useNavigate();
  const { roles } = useSelector((state: { role: RoleState }) => state.role);

  const { enqueueSnackbar } = useSnackbar();

  const [dropdownrole, setDropdownRole] = useState(currentEmployee?.roleId?.id || '');
  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required').email(),
    employeeId: Yup.string().required('Employee ID is required'),
    mobile: Yup.string().required('Mobile is required'),
    joinDate: Yup.string().required('Join Date is required'),
  });

  console.log('curent employee before', currentEmployee)
  const defaultValues = useMemo(
    () => ({
      firstName: currentEmployee?.firstName || '',
      lastName: currentEmployee?.lastName || '',
      email: currentEmployee?.email || '',
      mobile: currentEmployee?.mobile || '',
      employeeId: currentEmployee?.employeeId || '',
      joinDate: currentEmployee?.joinDate || '',
      role: currentEmployee?.roleId || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentEmployee]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
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
    if (isEdit && currentEmployee) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentEmployee]);

  useEffect(() => {
    dispatch(getRole());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.user.employee);
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeRole = (event: any) => {
    setDropdownRole(event.target.value);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>

        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
              }}
            >
              <RHFTextField name="firstName" label="First Name" />
              <RHFTextField name="lastName" label="Last Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="employeeId" label="Employee Id" />
              <RHFTextField name="mobile" label="Mobile" />
              <RHFTextField name="joinDate" label="Join Date" />
              <RHFSelect
                name={dropdownrole}
                value={dropdownrole}
                label="Role"
                placeholder="Role"
                onChange={onChangeRole}
              >
                <option value="" />
                {roles.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </RHFSelect>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
