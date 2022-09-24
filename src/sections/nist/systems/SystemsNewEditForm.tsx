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
import { Systems, SystemsRequest } from '../../../@types/systems';
import { dispatch, useSelector } from '../../../redux/store';
import { addSystems, postUploadImage, updateSystems } from '../../../redux/slices/systems';
import { UserState } from '../../../@types/nistuser';
import { getUsers } from '../../../redux/slices/user';
import { SoftwaresState } from 'src/@types/softwares';
import { getManufacturers, getSoftwares } from 'src/redux/slices/software';
import { HOST_API } from '../../../config';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

//type FormValuesProps = Systems;

interface FormValuesProps extends Partial<Systems> {
  softwareids: string[];
  //imageurl: File | any;
}

type Props = {
  isEdit: boolean;
  currentSystem?: Systems;
};

export default function SystemsNewEditForm({ isEdit, currentSystem }: Props) {
  const navigate = useNavigate();
  const { users } = useSelector((state: { user: UserState }) => state.user);

  const { softwares, manufacturers } = useSelector(
    (state: { softwares: SoftwaresState }) => state.softwares
  );

  const { enqueueSnackbar } = useSnackbar();

  const [previewImage, setPreviewImage] = useState();
  const [dropdownuser, setDropdownUser] = useState(currentSystem?.user.id || '');
  const [dropdownmanufacturer, setDropdownManufacturer] = useState(
    currentSystem?.manufacturer.id || ''
  );

  const [imageurl, setImageurl] = useState('');

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    macAddress: Yup.string().required('MACAddress is required'),
    os: Yup.string().required('OS is required'),
    cpu: Yup.string().required('CPU is required'),
    ram: Yup.string().required('RAM is required'),
    hardDisk: Yup.string().required('HardDisk is required'),
    purchasedDate: Yup.string().required('PurchasedDate is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentSystem?.id || '',
      name: currentSystem?.name || '',
      macAddress: currentSystem?.macAddress || '',
      os: currentSystem?.os || '',
      cpu: currentSystem?.cpu || '',
      ram: currentSystem?.ram || '',
      hardDisk: currentSystem?.hardDisk || '',
      purchasedDate: currentSystem?.purchasedDate,
      userid: currentSystem?.user.id || '',
      softwareids: currentSystem?.systemSoftware.map((st) => st.name),
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
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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
    dispatch(getSoftwares());
    dispatch(getUsers());
    dispatch(getManufacturers());
    if (currentSystem?.fileDB) {
      setImageurl(`${HOST_API}/v1/systems/files/${currentSystem?.fileDB.id}`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: FormValuesProps) => {
    const request: SystemsRequest = {
      name: data.name,
      macAddress: data.macAddress,
      os: data.os,
      cpu: data.cpu,
      ram: data.ram,
      hardDisk: data.hardDisk,
      purchasedDate: format(new Date(data.purchasedDate || ''), 'yyyy-mm-dd'),
      userId: dropdownuser,
      manufacturerId: dropdownmanufacturer,
      softwareIds: data.softwareids,
    };

    try {
      if (isEdit && currentSystem) {
        request.id = data.id;
        dispatch(updateSystems(request));
      }
      if (!isEdit) {
        dispatch(addSystems(request));
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

  const onChangeManufacturer = (event: any) => {
    setDropdownManufacturer(event.target.value);
  };

  //store images in databases
  const handleOnChange = (e: any) => {
    const file = e.target.files[0];
    console.log(file);
    dispatch(postUploadImage(currentSystem?.id || '', file));

    setPreviewImage(e.target.files[0]);
    setImageurl('');
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
              <RHFTextField name="macAddress" label="MAC Address" />
              <RHFTextField name="os" label="OS" />
              <RHFTextField name="cpu" label="CPU" />
              <RHFTextField name="ram" label="RAM" />
              <RHFTextField name="hardDisk" label="Hard Disk" />
              <Controller
                name="purchasedDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Purchased Date"
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
              <RHFSelect
                name={dropdownmanufacturer}
                value={dropdownmanufacturer}
                label="Manufacturer"
                placeholder="Manufacturer"
                onChange={onChangeManufacturer}
              >
                <option value="" />
                {manufacturers.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </RHFSelect>
              <Controller
                name="softwareids"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    freeSolo
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={softwares.map((option) => option.name)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option}
                          size="small"
                          label={option}
                        />
                      ))
                    }
                    renderInput={(params) => <TextField label="Softwares" {...params} />}
                  />
                )}
              />
            </Box>
            {isEdit && (
              <Box>
                <Button variant="contained" component="label">
                  Import
                  <input
                    hidden
                    type={'file'}
                    name="images"
                    accept="image/*"
                    onChange={handleOnChange}
                  />
                </Button>
                {imageurl && <Image src={imageurl} ratio="16/9" />}
                {previewImage && <Image src={URL.createObjectURL(previewImage)} ratio="16/9" />}
              </Box>
            )}

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create System' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
