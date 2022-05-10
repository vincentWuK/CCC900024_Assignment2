import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import T1_GA from './T1_GA';
import ErrorPage from './ErrorPage';
import HomePage from './HomePage';
import Others from './Others';
import T2o from './T2o';
import T2_GA from './T2_GA';




function App(props) {
  return (
    <Router>

      <Routes>
          <Route path ='/' element = {<HomePage/>}/>
          <Route path ='/T1_GA' element = {<T1_GA/>}/>
          <Route path ='/T2o' element = {<T2o/>}/>
          <Route path ='/T2_GA' element = {<T2_GA/>}/>
          <Route path ='/Others' element = {<Others/>}/>
          <Route path ='*' element = {<ErrorPage/>}/>
      </Routes>

    </Router>
  )
}

export default App
