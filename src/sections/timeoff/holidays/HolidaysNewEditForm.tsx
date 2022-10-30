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
import { Holidays, HolidaysRequest } from '../../../@types/holidays';
import { dispatch, useSelector } from '../../../redux/store';
import { addHolidays, updateHolidays } from '../../../redux/slices/holidays';
import { HolidaysState } from '../../../@types/holidays';
import { format } from 'date-fns';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

//type FormValuesProps = Holidays;

interface FormValuesProps extends Partial<Holidays> {
  holidayids: string[];
  //imageurl: File | any;
}

type Props = {
  isEdit: boolean;
  currentHoliday?: Holidays;
};

export default function HolidaysNewEditForm({ isEdit, currentHoliday }: Props) {
  const navigate = useNavigate();

  const { holidays } = useSelector((state: { holidays: HolidaysState }) => state.holidays);

  const { enqueueSnackbar } = useSnackbar();

  const NewHolidaySchema = Yup.object().shape({
    title: Yup.string().required('Holiday Name Must be required & Unique'),
    dates: Yup.string().required('Date is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentHoliday?.id || '',
      title: currentHoliday?.title,
      dates: currentHoliday?.dates,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentHoliday]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewHolidaySchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentHoliday) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentHoliday]);


  const onSubmit = async (data: FormValuesProps) => {
    const request: HolidaysRequest = {
      title: data.title,
      dates: format(new Date(data.dates || ''), 'yyyy-mm-dd'),
    };

    try {
      if (isEdit && currentHoliday) {
        request.id = data.id;
        dispatch(updateHolidays(request));
      }
      if (!isEdit) {
        dispatch(addHolidays(request));
        reset();
      }

      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.timeoff.holidays);
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
              <RHFTextField name="title" label="Holiday Name" helperText="Holiday Name Should Be Unique" />
              <Controller
                name="dates"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Holiday Date"
                    value={null}
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
                {!isEdit ? 'Submit' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
