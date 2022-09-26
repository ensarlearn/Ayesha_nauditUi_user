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
import { HRSubtask, HRSubtaskRequest } from '../../../@types/hrsubtask';
import { HRTaskState } from '../../../@types/hrtask';

import { dispatch, useSelector } from '../../../redux/store';
import { addHRSubtask, updateHRSubtask } from '../../../redux/slices/hrsubtask';
import { UserState } from '../../../@types/nistuser';
import { getUsers } from '../../../redux/slices/user';
import { SoftwaresState } from 'src/@types/softwares';
import { getManufacturers, getSoftwares } from 'src/redux/slices/software';
import { HOST_API } from '../../../config';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

//type FormValuesProps = HRSubtask;

interface FormValuesProps extends Partial<HRSubtask> {
  // softwareids: string[];
  //imageurl: File | any;
}

type Props = {
  isEdit: boolean;
  currentHRSubtask?: HRSubtask;
};

export default function HRSubtaskNewEditForm({ isEdit, currentHRSubtask }: Props) {
  const navigate = useNavigate();
  const { users } = useSelector((state: { user: UserState }) => state.user);
  const { hrTasks } = useSelector((state: { hrtask: HRTaskState }) => state.hrtask);

  const { enqueueSnackbar } = useSnackbar();

  const [dropdowntask, setDropdownTask] = useState(currentHRSubtask?.task.id || '');

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentHRSubtask?.id || '',
      name: currentHRSubtask?.name || '',
      taskid: currentHRSubtask?.task.id || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentHRSubtask]
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
    if (isEdit && currentHRSubtask) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentHRSubtask]);



  const onSubmit = async (data: FormValuesProps) => {
    const request: HRSubtaskRequest = {
      name: data.name,
      taskId: dropdowntask,

    };

    try {
      if (isEdit && currentHRSubtask) {
        request.id = data.id;
        dispatch(updateHRSubtask(request));
      }
      if (!isEdit) {
        dispatch(addHRSubtask(request));
        reset();
      }

      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.hr.subtask);
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeTask = (event: any) => {
    setDropdownTask(event.target.value);
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
                name={dropdowntask}
                value={dropdowntask}
                label="Task"
                placeholder="Task"
                onChange={onChangeTask}
              >
                <option value="" />
                {hrTasks.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="name" label="Name" />

            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create HR Subtask' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
