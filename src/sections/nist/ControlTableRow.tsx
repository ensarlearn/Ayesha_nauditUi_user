import React, { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, TableCell, MenuItem } from '@mui/material';
// @types
import { UserManager } from 'src/@types/user';
// components
import Iconify from 'src/components/Iconify';
import { TableMoreMenu } from 'src/components/table';
import { Controls } from 'src/@types/controls';

// ----------------------------------------------------------------------------

type Props = {
    row: Controls;
    selected: boolean;
    onEditRow: VoidFunction;
    onSelectRow: VoidFunction;
    onDeleteRow: VoidFunction;
};

export default function ControlTableRow({
    row,
    selected,
    onEditRow,
    onSelectRow,
    onDeleteRow,
}: Props) {
    const theme = useTheme();

    const { id, name } = row;

    const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setOpenMenuActions(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpenMenuActions(null);
    };

    return (
        <TableRow hover selected={selected}>
            <TableCell align="left">{id}</TableCell>
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
    )
}