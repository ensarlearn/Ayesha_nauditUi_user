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
import { Features, FeaturesRequest } from '../../@types/features';
import { dispatch, useSelector } from '../../redux/store';
import { addFeatures, updateFeatures } from 'src/redux/slices/feature';
import { UserState } from '../../@types/nistuser';
import { getUsers } from '../../redux/slices/user';

// ----------------------------------------------------------------------

type FormValuesProps = Features;

type Props = {
  isEdit: boolean;
  currentFeature?: Features;
};

export default function FeaturesNewEditForm({ isEdit, currentFeature }: Props) {
  const navigate = useNavigate();
  const { users } = useSelector((state: { user: UserState }) => state.user);

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    software: Yup.string().required('Software is required'),
    hostLocation: Yup.string().required('Hostlocation is required'),
    owner: Yup.string().required('Owner is required'),
    reviewCycle: Yup.string().required('Review cycle is required'),
  });

//   const [dropdownuser, setDropdownUser] = useState(currentFeature?.user.id || '');

  const defaultValues = useMemo(
    () => ({
      id: currentFeature?.id || '',
      name: currentFeature?.name || '',
      software: currentFeature?.software || '',
      hostLocation: currentFeature?.hostLocation || '',
      owner: currentFeature?.owner || '',
      reviewCycle: currentFeature?.reviewCycle || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentFeature]
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
    console.log(currentFeature);
    if (isEdit && currentFeature) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentFeature]);
  useEffect(() => {
    dispatch(getUsers());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onSubmit = async (data: FormValuesProps) => {
    try {
      if (isEdit && currentFeature) {
        const update: FeaturesRequest = {
          id: data.id,
          name: data.name,
          software: data.software,
          hostLocation: data.hostLocation,
          owner: data.owner,
          reviewCycle: data.reviewCycle,
        };
        dispatch(updateFeatures(update));
      }
      if (!isEdit) {
        const newfeature: FeaturesRequest = {
          id: data.id,
          name: data.name,
          software: data.software,
          hostLocation: data.hostLocation,
          owner: data.owner,
          reviewCycle: data.reviewCycle,
        };
        dispatch(addFeatures(newfeature));
        reset();
      }

      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.nist.features);
    } catch (error) {
      console.error(error);
    }
  };
//   const onChangeUser = (event: any) => {
//     setDropdownUser(event.target.value);
//   };

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
              <RHFTextField name="software" label="Software" />
              <RHFTextField name="hostLocation" label="Hostlocation" />
              <RHFTextField name="owner" label="Owner" />
              <RHFTextField name="reviewCycle" label="Reviewcycle" />
              {/* <RHFSelect
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
              </RHFSelect> */}
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
