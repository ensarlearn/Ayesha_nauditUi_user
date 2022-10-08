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
import { LinkedinAccount, LinkedinAccountRequest } from '../../../@types/linkedinaccount';
import { dispatch, useSelector } from '../../../redux/store';
import { addLinkedinAccount, updateLinkedinAccount } from '../../../redux/slices/linkedinaccount';
import { UserState } from '../../../@types/nistuser';
import { getUsers } from '../../../redux/slices/user';
import { SoftwaresState } from 'src/@types/softwares';
import { getManufacturers, getSoftwares } from 'src/redux/slices/software';
import { HOST_API } from '../../../config';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

//type FormValuesProps = LinkedinAccount;

interface FormValuesProps extends Partial<LinkedinAccount> {
  softwareids: string[];
  //imageurl: File | any;
}

type Props = {
  isEdit: boolean;
  currentLinkedinAccount?: LinkedinAccount;
};

export default function LinkedinAccountNewEditForm({ isEdit, currentLinkedinAccount }: Props) {
  const navigate = useNavigate();
  const { users } = useSelector((state: { user: UserState }) => state.user);

  const { enqueueSnackbar } = useSnackbar();

  const [dropdownuser, setDropdownUser] = useState(currentLinkedinAccount?.user.id || '');
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('name is required'),
    email: Yup.string().required('email is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentLinkedinAccount?.id || '',
      name: currentLinkedinAccount?.name || '',
      email: currentLinkedinAccount?.email || '',
      password: currentLinkedinAccount?.password || '',
      type: currentLinkedinAccount?.type || '',
      userid: currentLinkedinAccount?.user.id || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLinkedinAccount]
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
    if (isEdit && currentLinkedinAccount) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentLinkedinAccount]);

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  const onSubmit = async (data: FormValuesProps) => {
    const request: LinkedinAccountRequest = {
      name: data.name,
      email: data.email,
      password: data.password,
      type: data.type,
      userId: dropdownuser,

    };

    try {
      if (isEdit && currentLinkedinAccount) {
        request.id = data.id;
        dispatch(updateLinkedinAccount(request));
      }
      if (!isEdit) {
        dispatch(addLinkedinAccount(request));
        reset();
      }

      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.linkedin.linkedinaccount);
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
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="email" label="Email" />
              <RHFTextField name="password" label="Password" />
              <RHFTextField name="type" label="Type" />
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
                {!isEdit ? 'Create Linkedin Account' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
