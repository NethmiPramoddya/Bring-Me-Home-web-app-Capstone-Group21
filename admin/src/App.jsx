import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ManageSender from './pages/ManageSender'
import AdminWallets from './pages/AdminWallets'
import DashBoard from './pages/DashBoard'
import AdminUsers from './pages/Users'
import AdminTravelers from './pages/AdminTravelers'
import AdminSenderRequests from './pages/AdminSenderRequests'



function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/'element={<DashBoard/>}></Route>
          <Route path='/manageSenders'element={<ManageSender/>}></Route>
          <Route path='/withdrawal'element={<AdminWallets/>}></Route>
          <Route path='/users'element={<AdminUsers/>}></Route>
          <Route path='/travelers'element={<AdminTravelers/>}></Route>
          <Route path='/sender-requests'element={<AdminSenderRequests/>}></Route>
          
          

          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
