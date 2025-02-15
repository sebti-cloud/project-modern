import React from 'react'
import Nav from './comp/nav'
import {BrowserRouter} from 'react-roter-dom'

const App = () => {
  return (
    <>
    <BrowserRouter>
    <Nav />
    </BrowserRouter>
    </>
  )
}

export default App