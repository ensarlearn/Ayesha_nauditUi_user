import { useState } from 'react';
import { format } from 'date-fns';
import dayjs from 'dayjs';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, TableCell, MenuItem } from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
import { TableMoreMenu } from '../../../components/table';
import { Holidays } from 'src/@types/holidays';

// ----------------------------------------------------------------------

type Props = {
  row: Holidays;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function HolidaysTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const theme = useTheme();

  const { id, title, dates } = row;

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
      <TableCell align="left">{title}</TableCell>
      <TableCell>{format(new Date(row.dates), 'dd - MMM')}</TableCell>
      <TableCell>{dayjs(dates).format('dddd')}</TableCell>

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
