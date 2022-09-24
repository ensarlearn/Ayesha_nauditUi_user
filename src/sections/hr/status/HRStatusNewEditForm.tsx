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
import { HRStatus, HRStatusRequest } from '../../../@types/hrstatus';
import { dispatch, useSelector } from '../../../redux/store';
import { addHRStatus, updateHRStatus } from '../../../redux/slices/hrstatus';
import { UserState } from '../../../@types/nistuser';
import { getUsers } from '../../../redux/slices/user';
import { SoftwaresState } from 'src/@types/softwares';
import { getManufacturers, getSoftwares } from 'src/redux/slices/software';
import { HOST_API } from '../../../config';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

//type FormValuesProps = HRStatus;

interface FormValuesProps extends Partial<HRStatus> {
  softwareids: string[];
  //imageurl: File | any;
}

type Props = {
  isEdit: boolean;
  currentHRStatus?: HRStatus;
};

export default function HRStatusNewEditForm({ isEdit, currentHRStatus }: Props) {
  const navigate = useNavigate();
  const { users } = useSelector((state: { user: UserState }) => state.user);

  const { enqueueSnackbar } = useSnackbar();

  const [dropdownuser, setDropdownUser] = useState(currentHRStatus?.user.id || '');

  const NewUserSchema = Yup.object().shape({
    title: Yup.string().required('title is required'),
    description: Yup.string().required('description is required'),
    workDate: Yup.string().required('WorkDate is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentHRStatus?.id || '',
      title: currentHRStatus?.title || '',
      description: currentHRStatus?.description || '',
      workDate: currentHRStatus?.workDate,
      userid: currentHRStatus?.user.id || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentHRStatus]
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
    if (isEdit && currentHRStatus) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentHRStatus]);

  useEffect(() => {
    dispatch(getUsers());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: FormValuesProps) => {
    const request: HRStatusRequest = {
      title: data.title,
      description: data.description,
      workDate: format(new Date(data.workDate || ''), 'yyyy-mm-dd'),
      userId: dropdownuser,
    };

    try {
      if (isEdit && currentHRStatus) {
        request.id = data.id;
        dispatch(updateHRStatus(request));
      }
      if (!isEdit) {
        dispatch(addHRStatus(request));
        reset();
      }

      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.hr.status);
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
              <RHFTextField name="title" label="Title" />
              <RHFTextField name="description" label="Description" />

              <Controller
                name="workDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="workDate"
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />

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
                {!isEdit ? 'Create HR Status' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
