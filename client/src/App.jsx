import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UsersMyRequestes from './UsersMyRequests'
import EditUsers from './EditUsers'
import CreateUsersForm from './CreateUsersForm'
import Navbar from './Navbar'
import SignUp from './SignUp'
import LogIn from './LogIn'
import TravelerForm from './TravelerForm'
import Profile from './Profile'
import RequestDetails from './RequestDetails'
import Notifications from './Notifications'

function App() {
  const userId = localStorage.getItem('userId'); 

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
        <Route path='/become-traveler' element={<TravelerForm/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path="/buyer-requests/:senderRequestId" element={< RequestDetails/>} />
        <Route path='/notifications' element={<Notifications userId={userId} />}></Route>


      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
