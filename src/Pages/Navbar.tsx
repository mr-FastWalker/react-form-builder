import React from 'react';
import { styled } from '@mui/system';
import {Button, Divider, Typography} from "@mui/material";
import {useNavigate} from "react-router";

const NavbarStyled = styled('div', {
  name: 'Navbar',
  slot: 'Root',
})({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  minWidth: '260px',
  backgroundColor: '#131a39',
  padding: '16px',
  minHeight: '100vh',
});

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <NavbarStyled>
      <Typography color="white" variant="h6">Simple Form Builder</Typography>
      <Divider color="white"/>
      <Button onClick={() => navigate('/input')}>Input data</Button>
      <Button onClick={() => navigate('/constructor')}>Constructor</Button>
      <Button onClick={() => navigate('/sc')}>Show components</Button>
    </NavbarStyled>
  )
};