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
import { HRTimesheetAttendance, HRTimesheetAttendanceRequest } from '../../../@types/hrtimesheetattendance';
import { dispatch, useSelector } from '../../../redux/store';
import { addHRTimesheetAttendance, updateHRTimesheetAttendance } from '../../../redux/slices/hrtimesheetattendance';
import { UserState } from '../../../@types/nistuser';
import { getUsers } from '../../../redux/slices/user';
import { SoftwaresState } from 'src/@types/softwares';
import { getManufacturers, getSoftwares } from 'src/redux/slices/software';
import { HOST_API } from '../../../config';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

//type FormValuesProps = HRTimesheetAttendance;

interface FormValuesProps extends Partial<HRTimesheetAttendance> {
  softwareids: string[];
  //imageurl: File | any;
}

type Props = {
  isEdit: boolean;
  currentHRTimesheetAttendance?: HRTimesheetAttendance;
};

export default function HRTimesheetAttendanceNewEditForm({ isEdit, currentHRTimesheetAttendance }: Props) {
  const navigate = useNavigate();
  const { users } = useSelector((state: { user: UserState }) => state.user);

  const { enqueueSnackbar } = useSnackbar();

  const [dropdownuser, setDropdownUser] = useState(currentHRTimesheetAttendance?.user.id || '');

  const NewUserSchema = Yup.object().shape({
    hours: Yup.string().required('hours are required'),
    remarks: Yup.string().required('remarks is required'),
    workDate: Yup.string().required('WorkDate is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentHRTimesheetAttendance?.id || '',
      remarks: currentHRTimesheetAttendance?.remarks || '',
      hours: currentHRTimesheetAttendance?.hours || '',
      workDate: currentHRTimesheetAttendance?.workDate,
      // projectsid:currentHRTimesheetAttendance?.projects.id || '',
      userid: currentHRTimesheetAttendance?.user.id || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentHRTimesheetAttendance]
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
    if (isEdit && currentHRTimesheetAttendance) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentHRTimesheetAttendance]);

  useEffect(() => {
    dispatch(getUsers());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: FormValuesProps) => {
    const request: HRTimesheetAttendanceRequest = {
      hours: data.hours,
      remarks: data.remarks,
      // project: data.project[],
      workDate: format(new Date(data.workDate || ''), 'yyyy-mm-dd'),
      userId: dropdownuser,
      // projectId: dropdownuser,
    };

    try {
      if (isEdit && currentHRTimesheetAttendance) {
        request.id = data.id;
        dispatch(updateHRTimesheetAttendance(request));
      }
      if (!isEdit) {
        dispatch(addHRTimesheetAttendance(request));
        reset();
      }

      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.hr.timesheetattendance);
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
              <RHFTextField name="hours" label="Hours" />
              <RHFTextField name="remarks" label="Remarks" />

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
                {!isEdit ? 'Create HR TimesheetAttendance' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
