import { useState } from 'react';
// @mui
import { TableRow, TableCell, MenuItem } from '@mui/material';
// @types
// components
import Iconify from '../../../components/Iconify';
import { TableMoreMenu } from '../../../components/table';
import { LinkedinAccount } from '../../../@types/linkedinaccount';
import { capitalCase } from 'change-case';

// ----------------------------------------------------------------------

type Props = {
  row: LinkedinAccount;
  selected: boolean;
  onViewRow: VoidFunction;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function LinkedinAccountTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { firstName, lastName, email, password, type, user } = row;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell align="left">
        {capitalCase(firstName)} {capitalCase(lastName)}
      </TableCell>
      <TableCell align="left">{email}</TableCell>
      <TableCell align="left">{password}</TableCell>
      <TableCell align="left">{user?.firstName}</TableCell>
      <TableCell align="left">{capitalCase(type)}</TableCell>

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
                  onViewRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:eye-fill'} />
                View
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
