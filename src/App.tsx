import React from "react";
import {Route, Routes} from "react-router-dom";
import {Button, Typography} from "@mui/material";
import {styled} from "@mui/system";
import { Navbar } from "./Pages/Navbar.tsx";
import './App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {ShowCase} from "./Pages/sc";
import {Constructor} from "./Pages/constructor";
import {InputData} from "./Pages/inputData";

const MainLayoutStyled = styled('div', {
  name: 'MainLayoutStyled',
  slot: 'Root',
})({
  display: 'flex',
  flexDirection: 'row',
  // height: '100vh',
  // width: '100vw',
});

const ContentStyled = styled('div', {
  name: 'ContentStyled',
  slot: 'Content',
})({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
  padding: '16px',
});

function App() {

  return (
    <>
      <MainLayoutStyled>
        <Navbar/>
        <ContentStyled>
          <Routes>
            <Route path="/sc" element={<ShowCase />} />
            <Route path="/input" element={<InputData />} />
            <Route path="/constructor" element={<Constructor />} />
          </Routes>
        </ContentStyled>
      </MainLayoutStyled>
    </>
  )
}

export default App
