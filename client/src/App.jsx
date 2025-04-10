import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UsersMyRequestes from './UsersMyRequests'
import EditUsers from './EditUsers'
import CreateUsersForm from './CreateUsersForm'
import Navbar from './Navbar'

function App() {
  

  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<UsersMyRequestes/>}></Route>
        <Route path='/create' element={<CreateUsersForm/>}></Route>
        <Route path='/edit/:id' element={<EditUsers/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
