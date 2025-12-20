/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState } from 'react'

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import HomePage from './Pages/Home/HomPage';
import LogIn from './Pages/Log in/LogIn';
import Register from './Pages/Register/Resgister';
import './App.css'


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/login" element={<LogIn/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  )
  }

export default App
