import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ManageSender from './pages/ManageSender'
import AdminWallets from './pages/AdminWallets'

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/manageSenders'element={<ManageSender/>}></Route>
          <Route path='/withdrawal'element={<AdminWallets/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
