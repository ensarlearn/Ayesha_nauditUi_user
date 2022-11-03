import { paramCase } from 'change-case';
import { useLocation, useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
// hooks
import useSettings from '../../../../hooks/useSettings';
// _mock_
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LinkedinLeadState } from '../../../../@types/linkedinlead';
import { getLinkedinLead } from '../../../../redux/slices/linkedinlead';
import { dispatch } from '../../../../redux/store';
import LinkedinLeadDetails from './LinkedinLeadDetails';
// ----------------------------------------------------------------------

export default function LinkedinLeadView() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isView = pathname.includes('edit');

  const { linkedinLeads } = useSelector(
    (state: { linkedinlead: LinkedinLeadState }) => state.linkedinlead
  );

  const currentLinkedinLead = linkedinLeads.find(
    (LinkedinLead) => paramCase(LinkedinLead.id) === id
  );

  useEffect(() => {
    dispatch(getLinkedinLead());
  }, []);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <LinkedinLeadDetails isView={!isView} currentLinkedinLead={currentLinkedinLead} />
    </Container>
  );
}
