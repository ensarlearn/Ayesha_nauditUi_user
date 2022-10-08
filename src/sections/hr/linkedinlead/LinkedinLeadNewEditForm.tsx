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
import { LinkedinLead, LinkedinLeadRequest } from '../../../@types/linkedinlead';
import { dispatch, useSelector } from '../../../redux/store';
import { addLinkedinLead, updateLinkedinLead } from '../../../redux/slices/linkedinlead';
import { UserState } from '../../../@types/nistuser';
import { getUsers } from '../../../redux/slices/user';
import { SoftwaresState } from 'src/@types/softwares';
import { getManufacturers, getSoftwares } from 'src/redux/slices/software';
import { HOST_API } from '../../../config';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

//type FormValuesProps = LinkedinLead;

interface FormValuesProps extends Partial<LinkedinLead> {
  softwareids: string[];
  //imageurl: File | any;
}

type Props = {
  isEdit: boolean;
  currentLinkedinLead?: LinkedinLead;
};

export default function LinkedinLeadNewEditForm({ isEdit, currentLinkedinLead }: Props) {
  const navigate = useNavigate();
  const { users } = useSelector((state: { user: UserState }) => state.user);

  const { enqueueSnackbar } = useSnackbar();


  const NewUserSchema = Yup.object().shape({
    websiteLink: Yup.string().required('website link is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentLinkedinLead?.id || '',
      websiteLink: currentLinkedinLead?.websiteLink || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLinkedinLead]
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
    if (isEdit && currentLinkedinLead) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentLinkedinLead]);



  const onSubmit = async (data: FormValuesProps) => {
    const request: LinkedinLeadRequest = {
      websiteLink: data.websiteLink,

    };

    try {
      if (isEdit && currentLinkedinLead) {
        request.id = data.id;
        dispatch(updateLinkedinLead(request));
      }
      if (!isEdit) {
        dispatch(addLinkedinLead(request));
        reset();
      }

      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.linkedin.linkedinlead);
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
              <RHFTextField name="websiteLink" label="WebsiteLink" />

            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Linkedin Lead' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
