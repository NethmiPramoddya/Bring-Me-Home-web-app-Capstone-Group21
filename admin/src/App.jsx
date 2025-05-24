import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ManageSender from './pages/ManageSender'
import AdminWallets from './pages/AdminWallets'
import DashBoard from './pages/DashBoard'
import AdminUsers from './pages/Users'

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/'element={<DashBoard/>}></Route>
          <Route path='/manageSenders'element={<ManageSender/>}></Route>
          <Route path='/withdrawal'element={<AdminWallets/>}></Route>
          <Route path='/users'element={<AdminUsers/>}></Route>

          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
