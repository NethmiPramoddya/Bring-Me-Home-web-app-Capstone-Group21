import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ManageSender from './pages/ManageSender'
import AdminWallets from './pages/AdminWallets'
import DashBoard from './pages/DashBoard'

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/'element={<DashBoard/>}></Route>
          <Route path='/manageSenders'element={<ManageSender/>}></Route>
          <Route path='/withdrawal'element={<AdminWallets/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
