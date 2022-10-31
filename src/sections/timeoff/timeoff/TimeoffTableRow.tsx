import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, TableRow, TableCell, MenuItem, Typography, Chip, } from '@mui/material';
// @types
import { UserManager } from '../../../@types/user';
// components
import Iconify from '../../../components/Iconify';
import { TableMoreMenu } from '../../../components/table';
import { Timeoff } from '../../../@types/timeoff';
import { differenceInDays, format, formatDistanceToNow } from 'date-fns';
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineContent } from '@mui/lab';

// ----------------------------------------------------------------------

type Props = {
  row: Timeoff;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function TimeoffTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const theme = useTheme();

  const { leaveType, employees, avatarUrl, fromDate, toDate, reason, status } = row;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>

      <TableCell sx={{ display: 'flex', marginTop: '15px', alignItems: 'center' }}>
        <Avatar alt={employees?.name} src={avatarUrl} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {employees?.name}
        </Typography>
      </TableCell>

      <TableCell align="left">{leaveType}</TableCell>
      <TableCell align="left">{format(new Date(fromDate), 'dd/MM/yyyy')}</TableCell>
      <TableCell align="left">{format(new Date(toDate), 'dd/MM/yyyy')}</TableCell>
      <TableCell>{differenceInDays(new Date(toDate),new Date(fromDate))} Days </TableCell>
      <TableCell align="left">{reason}</TableCell>
      <TableCell>
          <TimelineItem sx={{'&:before': {flex: '0 !important', padding: 0}}}>
              <TimelineDot sx={{ display: 'flex', marginTop: '30px' }}
              color={
                  (row.status === 'Pending' && 'warning') ||
                  (row.status === 'Declined' && 'error') ||
                  (row.status === 'New' && 'info') ||
                  (row.status === 'Approved' && 'success') ||
                  'success'
                    } />
            <TimelineContent sx={{ display: 'flex', marginTop: '0px', alignItems: 'center' }}>{status}</TimelineContent>
          </TimelineItem>
      </TableCell>
      {/* <TableCell align="left">
        <Chip label={status} 
        color={
          (row.status === 'Pending' && 'warning') ||
          (row.status === 'Declined' && 'error') ||
          (row.status === 'New' && 'info') ||
          (row.status === 'Approved' && 'success') ||
          'success'
        }
        />
      </TableCell> */}

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
