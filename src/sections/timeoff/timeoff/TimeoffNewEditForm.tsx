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
import { Timeoff, TimeoffRequest } from '../../../@types/timeoff';
import { EmployeeState } from '../../../@types/employee';

import { dispatch, useSelector } from '../../../redux/store';
import { addTimeoff, updateTimeoff } from '../../../redux/slices/timeoff';
import { UserState } from '../../../@types/nistuser';
import { getEmployee } from '../../../redux/slices/employee';
import { SoftwaresState } from 'src/@types/softwares';
import { getManufacturers, getSoftwares } from 'src/redux/slices/software';
import { HOST_API } from '../../../config';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

//type FormValuesProps = Timeoff;

interface FormValuesProps extends Partial<Timeoff> {
  // softwareids: string[];
  //imageurl: File | any;
}

type Props = {
  isEdit: boolean;
  currentTimeoff?: Timeoff;
};

export default function HRTimeoffNewEditForm({ isEdit, currentTimeoff }: Props) {
  const navigate = useNavigate();
  const { employees } = useSelector((state: { employee: EmployeeState }) => state.employee);

  const { enqueueSnackbar } = useSnackbar();

  const [dropdownemployee, setDropdownEmployee] = useState(currentTimeoff?.employees.id || '');

  const NewUserSchema = Yup.object().shape({
    leaveType: Yup.string().required('Leave Type is required'),
    fromDate: Yup.string().required('Leave Type is required'),
    toDate: Yup.string().required('Leave Type is required'),
    reason: Yup.string().required('Reason is required'),
    status: Yup.string().required('Status is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentTimeoff?.id || '',
      leaveType: currentTimeoff?.leaveType || '',
      reason: currentTimeoff?.reason || '',
      status: currentTimeoff?.status || '',
      fromDate: currentTimeoff?.fromDate || '',
      toDate: currentTimeoff?.toDate || '',
      employeesid: currentTimeoff?.employees.id || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTimeoff]
  );

  const methods = useForm({
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
    if (isEdit && currentTimeoff) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentTimeoff]);

  useEffect(() => {
    dispatch(getEmployee());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: FormValuesProps) => {
    const request: TimeoffRequest = {
      leaveType: data.leaveType,
      fromDate: format(new Date(data.fromDate || ''), 'yyyy-mm-dd'),
      toDate: format(new Date(data.toDate || ''), 'yyyy-mm-dd'),
      reason: data.reason,
      status: data.status,
      employeesId: dropdownemployee,

    };

    try {
      if (isEdit && currentTimeoff) {
        request.id = data.id;
        dispatch(updateTimeoff(request));
      }
      if (!isEdit) {
        dispatch(addTimeoff(request));
        reset();
      }

      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.timeoff.timeoff);
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeEmployee = (event: any) => {
    setDropdownEmployee(event.target.value);
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
              <RHFSelect
                name={dropdownemployee}
                value={dropdownemployee}
                label="Employee"
                placeholder="Employee"
                onChange={onChangeEmployee}
              >
                <option value="" />
                {employees.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="leaveType" label="Leave Type" />
              <RHFTextField name="reason" label="Reason" />
              <RHFSelect name="status" label="Status">
                                <option></option>
                                <option>New</option>
                                <option>Approved</option>
                                <option>Pending</option>
                                <option>Declined</option>
              </RHFSelect>
              <Controller
                name="fromDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="From date"
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                    )}
                  />
                )}
              />
              <Controller
                name="toDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="To Date"
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
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Timeoff' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
