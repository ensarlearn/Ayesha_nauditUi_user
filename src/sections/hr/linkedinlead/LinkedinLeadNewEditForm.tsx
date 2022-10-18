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

  const [dropdownuser, setDropdownUser] = useState(currentLinkedinLead?.user.id || '');

  const NewUserSchema = Yup.object().shape({
    leadName: Yup.string().required('Lead Name is required'),
    linkedinLink: Yup.string().required('Linkedin Link is required'),
    websiteLink: Yup.string().url() ,
  });

  const defaultValues = useMemo(
    () => ({
      id: currentLinkedinLead?.id || '',
      leadName: currentLinkedinLead?.leadName || '',
      websiteLink: currentLinkedinLead?.websiteLink || '',
      linkedinLink: currentLinkedinLead?.linkedinLink || '',
      sent: currentLinkedinLead?.sent || '',
      userid: currentLinkedinLead?.user.id || '',
      responseType: currentLinkedinLead?.responseType || '',
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

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  const onSubmit = async (data: FormValuesProps) => {
    const request: LinkedinLeadRequest = {
      leadName: data.leadName,
      websiteLink: data.websiteLink,
      linkedinLink: data.linkedinLink,
      sent: data.sent,
      userId: dropdownuser,
      responseType: data.responseType,
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
              <RHFTextField name="leadName" label="Lead Name" />
              <RHFTextField name="websiteLink" label="Website Link" />
              <RHFTextField name="linkedinLink" label="LinkedIn Link" />
              <RHFTextField name="sent" label="Sent" />
              <RHFTextField name="responseType" label="Response Type" />
              <RHFSelect
                name={dropdownuser}
                value={dropdownuser}
                label="Sent From"
                placeholder="Sent From"
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
                {!isEdit ? 'Create Linkedin Lead' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
