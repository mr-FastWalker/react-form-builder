import React, {useState} from "react";
import {Route, Routes} from "react-router-dom";
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
import {makeFieldsList} from "./Pages/inputData/utility.ts";
import {mockupInputData} from "./Pages/inputData/constants.ts";
import {InputField} from "./Pages/inputData/types.ts";

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
  const [fieldsList, setFieldsList] = useState<InputField[]>(makeFieldsList(mockupInputData))

  return (
    <>
      <MainLayoutStyled>
        <Navbar/>
        <ContentStyled>
          <Routes>
            <Route path="/sc" element={<ShowCase />} />
            <Route path="/input" element={<InputData fieldsList={fieldsList} setFieldsList={setFieldsList} />} />
            <Route path="/constructor" element={<Constructor fieldsList={fieldsList} setFieldsList={setFieldsList} />} />
          </Routes>
        </ContentStyled>
      </MainLayoutStyled>
    </>
  )
}

export default App
