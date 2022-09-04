// @mui
import {
  Box,
  Card,
  Stack,
  Button,
  Avatar,
  Tooltip,
  CardProps,
  Typography,
  CardHeader,
  IconButton,
} from '@mui/material';
import { User } from '../../../../@types/nistuser';
import { RHFSelect } from '../../../../components/hook-form';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: User[];
}

export default function SystemsSoftwareList({ title, subheader, list, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Tooltip title="Add Systems">
            <IconButton color="primary" size="large">
              <Iconify icon={'eva:plus-fill'} width={20} height={20} />
            </IconButton>
          </Tooltip>
        }
      />
      <RHFSelect name="name" label="Users" placeholder="Users">
        {list.map((option) => (
          <option key={option.id} value={option.id}>
            {option.firstName} {option.lastName}
          </option>
        ))}
      </RHFSelect>
      <Stack spacing={3} sx={{ p: 3 }}>
        {list.map((systems) => (
          <Stack direction="row" alignItems="center" key={systems.id}>
            <Box sx={{ flexGrow: 1, ml: 2, minWidth: 100 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }} noWrap>
                {systems.firstName}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {systems.email}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
