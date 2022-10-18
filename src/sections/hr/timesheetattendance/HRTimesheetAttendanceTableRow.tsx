import { useState } from 'react';
// @mui
import { TableRow, TableCell, MenuItem } from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
import { TableMoreMenu } from '../../../components/table';
import { HRTimesheetAttendance } from '../../../@types/hrtimesheetattendance';
import { capitalCase } from 'change-case';

// ----------------------------------------------------------------------

type Props = {
  row: HRTimesheetAttendance;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function HRTimesheetAttendanceTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {

  const { hours, remarks, workDate, project, task, subtask, user } = row;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell align="left">{capitalCase(user?.firstName)}</TableCell>
      <TableCell align="left">{capitalCase(project?.name)}</TableCell>
      <TableCell align="left">{capitalCase(task?.name)}</TableCell>
      <TableCell align="left">{capitalCase(subtask?.name)}</TableCell>
      <TableCell align="left">{hours} Hrs</TableCell>
      <TableCell align="left">{capitalCase(remarks)}</TableCell>
      <TableCell align="left">{workDate}</TableCell>

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
