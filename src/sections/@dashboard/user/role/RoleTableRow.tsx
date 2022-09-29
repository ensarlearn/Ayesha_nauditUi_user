import { useState } from 'react';
// @mui
import { TableRow, TableCell, MenuItem } from '@mui/material';

// components
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { Role } from '../../../../@types/role';

// ----------------------------------------------------------------------

type Props = {
  row: Role;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function RoleTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {

  const { name } = row;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>

      <TableCell align="left">{name}</TableCell>

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
