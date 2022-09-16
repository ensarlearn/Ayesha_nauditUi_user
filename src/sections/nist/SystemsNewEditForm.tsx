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
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

// _mock
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../components/hook-form';
import { Systems, SystemsRequest } from '../../@types/systems';
import { dispatch, useSelector } from '../../redux/store';
import { addSystems, updateSystems } from '../../redux/slices/systems';
import { UserState } from '../../@types/nistuser';
import { getUsers } from '../../redux/slices/user';

// ----------------------------------------------------------------------

type FormValuesProps = Systems;

type Props = {
  isEdit: boolean;
  currentSystem?: Systems;
};

export default function SystemsNewEditForm({ isEdit, currentSystem }: Props) {
  const navigate = useNavigate();
  const { users } = useSelector((state: { user: UserState }) => state.user);

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    ipaddress: Yup.string().required('IPAddress is required'),
  });

  const [dropdownuser, setDropdownUser] = useState(currentSystem?.user.id || '');

  const defaultValues = useMemo(
    () => ({
      id: currentSystem?.id || '',
      name: currentSystem?.name || '',
      ipaddress: currentSystem?.ipAddress || '',
      os: currentSystem?.os || '',
      userid: currentSystem?.user.id || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSystem]
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
    if (isEdit && currentSystem) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentSystem]);
  useEffect(() => {
    dispatch(getUsers());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onSubmit = async (data: FormValuesProps) => {
    try {
      if (isEdit && currentSystem) {
        const update: SystemsRequest = {
          id: data.id,
          name: data.name,
          ipAddress: data.ipAddress,
          os: data.os,
          userId: dropdownuser,
        };
        dispatch(updateSystems(update));
      }
      if (!isEdit) {
        const newsystem: SystemsRequest = {
          id: data.id,
          name: data.name,
          ipAddress: data.ipAddress,
          os: data.os,
          userId: dropdownuser,
        };
        dispatch(addSystems(newsystem));
        reset();
      }

      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.nist.systems);
    } catch (error) {
      console.error(error);
    }
  };
  const onChangeUser = (event: any) => {
    setDropdownUser(event.target.value);
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
              <RHFTextField name="ipaddress" label="IP Address" />
              <RHFTextField name="os" label="OS" />
              <RHFSelect
                name={dropdownuser}
                value={dropdownuser}
                label="Users"
                placeholder="Users"
                onChange={onChangeUser}
              >
                <option value="" />
                {users.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.firstName} {option.lastName}
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
