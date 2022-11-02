import { useState } from 'react';
// @mui
import { TableRow, TableCell, MenuItem } from '@mui/material';
// @types
// components
import Iconify from '../../../components/Iconify';
import { TableMoreMenu } from '../../../components/table';
import { LinkedinLead } from '../../../@types/linkedinlead';
import { capitalCase } from 'change-case';

// ----------------------------------------------------------------------

type Props = {
  row: LinkedinLead;
  selected: boolean;
  onViewRow: VoidFunction;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function LinkedinLeadTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onViewRow,
  onDeleteRow,
}: Props) {
  const { leadName, websiteLink, linkedinLink, sent, user, responseType } = row;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell align="left">{capitalCase(leadName)}</TableCell>
      <TableCell align="left">{websiteLink}</TableCell>
      <TableCell align="left">{linkedinLink}</TableCell>
      <TableCell align="left">{capitalCase(sent)}</TableCell>
      <TableCell align="left">
        {user?.firstName} {user?.lastName}
      </TableCell>
      <TableCell align="left">{capitalCase(responseType)}</TableCell>

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
