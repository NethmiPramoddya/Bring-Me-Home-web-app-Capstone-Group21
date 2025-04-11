import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UsersMyRequestes from './UsersMyRequests'
import EditUsers from './EditUsers'
import CreateUsersForm from './CreateUsersForm'
import Navbar from './Navbar'
import SignUp from './SignUp'
import { LogIn } from 'lucide-react'

function App() {
  

  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<UsersMyRequestes/>}></Route>
        <Route path='/create' element={<CreateUsersForm/>}></Route>
        <Route path='/edit/:id' element={<EditUsers/>}></Route>
        <Route path='/register' element={<SignUp/>}></Route>
        <Route path='/login' element={<LogIn/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
