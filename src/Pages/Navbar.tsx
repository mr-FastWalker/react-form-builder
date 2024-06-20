import { styled, alpha } from '@mui/system';
import { Button, Divider, Typography} from "@mui/material";
import {useNavigate} from "react-router";

const NavbarStyled = styled('div', {
  name: 'Navbar',
  slot: 'Root',
})({
  minWidth: '260px',
  backgroundColor: '#131a39',
  padding: '16px',
  minHeight: '100vh',
  position: 'relative',
});

const NavbarContentStyled = styled('div', {
  name: 'Navbar',
  slot: 'content',
})({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  position: 'fixed',
});

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <NavbarStyled>
      <NavbarContentStyled>
        <Typography color="white" variant="h6">Simple Form Builder</Typography>
        <Divider color="white"/>
        <Button sx={{'&:hover': {backgroundColor: alpha('#fff', 0.1)} }} onClick={() => navigate('/input')}>Input data</Button>
        <Button sx={{'&:hover': {backgroundColor: alpha('#fff', 0.1)} }} onClick={() => navigate('/constructor')}>Constructor</Button>
        <Button sx={{'&:hover': {backgroundColor: alpha('#fff', 0.1)} }} onClick={() => navigate('/sc')}>Show components</Button>
      </NavbarContentStyled>
    </NavbarStyled>
  )
};