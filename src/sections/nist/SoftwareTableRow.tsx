import React, { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, TableCell, MenuItem } from '@mui/material';
// @types
import { UserManager } from 'src/@types/user';
// components
import Iconify from 'src/components/Iconify';
import { TableMoreMenu } from 'src/components/table';
import { Softwares } from 'src/@types/softwares';

// ----------------------------------------------------------------------------

type Props = {
    row: Softwares;
    selected: boolean;
    onEditRow: VoidFunction;
    onSelectRow: VoidFunction;
    onDeleteRow: VoidFunction;
};

export default function SoftwareTableRow({
    row,
    selected,
    onEditRow,
    onSelectRow,
    onDeleteRow,
}: Props) {
    const theme = useTheme();

    const { id, name, version, owner, vendor, installDate, support, license } = row;

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
            <TableCell align="left">{version}</TableCell>
            <TableCell align="left">{owner}</TableCell>
            <TableCell align="left">{vendor}</TableCell>
            <TableCell align="left">{installDate}</TableCell>
            <TableCell align="left">{support}</TableCell>
            <TableCell align="left">{license}</TableCell>

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