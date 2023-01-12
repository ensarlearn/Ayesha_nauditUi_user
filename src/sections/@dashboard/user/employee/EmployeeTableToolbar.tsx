import { Stack, InputAdornment, TextField, MenuItem , Button} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { useState, useEffect } from 'react';
import { getRole } from '../../../../redux/slices/role';
import { dispatch, useSelector } from '../../../../redux/store';
import { RoleState } from 'src/@types/role';
import { RHFSelect } from 'src/components/hook-form';
// import fil from 'date-fns/esm/locale/fil/index.js';
// import {}

// ----------------------------------------------------------------------

type Props = {
  isFiltered: boolean;
  optionsRole: string[];
  filterName: string;
  filterRole: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterRole: (event: React.ChangeEvent<HTMLInputElement>) => void;

}

export default function EmployeeTableToolbar({
  isFiltered,
  filterName,
  filterRole,
  onFilterName,
  onFilterRole,
  optionsRole,
  // onChangeRole,
}: Props) {

  const [dropdownrole, setDropdownRole] = useState(filterName);
  // const { roles } = useSelector((state: { role: RoleState }) => state.role);
  const onChangeRole = (event: any) => {
  setDropdownRole(event.target.value);
  };

  useEffect(() => {
  dispatch(getRole());
  }, []);

  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        select
        label="Role"
        name={dropdownrole}
        value={filterRole}
        onChange={onFilterRole}
        SelectProps={{
        MenuProps: {
        sx: { '& .MuiPaper-root': { maxHeight: 260 } },
  },
  }}
        sx={{
        maxWidth: { sm: 240 },
        textTransform: 'capitalize',
        }}
      >
 {/* <option value="" />
 {roles.map((option: any) => (
 <option key={option.id} value={option.id}>
 {option.name}
 </option>
))} */}

  {optionsRole.map((option) => (
  <MenuItem
  key={option}
  value={option}
  sx={{
  mx: 1,
  my: 0.5,
  borderRadius: 0.75,
  typography: 'body2',
  textTransform: 'capitalize',

 }}
 >
{option}
 </MenuItem>
))}

 </TextField>
 <TextField
  fullWidth
  value={filterName}
  onChange= {onFilterName}
  placeholder="Search Employee..."
  InputProps={{
  startAdornment: (
<InputAdornment position="start">
 <Iconify
 icon={'eva:search-fill'}
 sx={{ color: 'text.disabled', width: 20, height: 20 }}
 />
</InputAdornment>
 ),

 }}
 />
</Stack>
 );

}
