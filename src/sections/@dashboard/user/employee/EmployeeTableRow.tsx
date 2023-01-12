import { useState } from 'react';
// @mui
import { TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// @types
import { UserManager } from '../../../../@types/user';
// components
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { role } from 'src/_mock/role';

// ----------------------------------------------------------------------

type Props = {
  row: UserManager;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onViewRow: VoidFunction;
};

export default function EmployeeTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {

  const { firstName, lastName, role, email, employeeId, mobile, joinDate } = row;
  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {firstName + ' ' + lastName}
        </Typography>
      </TableCell>

      <TableCell align="left">{employeeId}</TableCell>
      <TableCell align="left">{email}</TableCell>
      <TableCell align="left">{mobile}</TableCell>
      <TableCell align="left">{joinDate}</TableCell>
      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>{role}</TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
