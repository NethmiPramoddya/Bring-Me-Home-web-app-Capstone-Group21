import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ManageSender from './pages/ManageSender'

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/manageSenders'element={<ManageSender/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
