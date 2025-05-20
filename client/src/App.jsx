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
import MoreInfo from './MoreInfo'
import MySenderRequests from './MySenderRequests'
import MyTravelingData from './MyTravelingData'
import ViewMore from './pages/ViewMore'
import Home from './Home'
import RoomId from './RoomId'
import Chats from './Chats'
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import OnGoingTasks from './OnGoingTasks'
import ReceiverDetails from './ReceiverDetails'

function App() {
  const userId = localStorage.getItem('userId'); 
  const { roomId } = useParams();
  const storedUsername = localStorage.getItem('username');
  const socket = io('http://localhost:3002'); // Your actual backend URL

  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      
      <Routes>

        <Route path='/' element={<UsersMyRequestes/>}></Route>
        <Route path='/Home' element={<Home/>}></Route>
        <Route path='/create' element={<CreateUsersForm/>}></Route>
        <Route path='/edit/:id' element={<EditUsers/>}></Route>
        <Route path='/register' element={<SignUp/>}></Route>
        <Route path='/login' element={<LogIn/>}></Route>
        <Route path='/become-traveler' element={<TravelerForm/>}></Route>
        <Route path='/profile/:id' element={<Profile/>}></Route>
        {/* <Route path="/buyer-requests/:senderRequestId" element={< RequestDetails/>} /> */}
        <Route path='/notifications' element={<Notifications userId={userId} />}></Route>
        <Route path="/more_info/:id" element={<MoreInfo/>} /> 
        <Route path='/mySenderRequests/:id' element={<MySenderRequests/>}></Route>
        <Route path='/travelingData/:id' element={<MyTravelingData/>}></Route>
        <Route path='/view_more/:id' element={<ViewMore/>}></Route>
        <Route path="/chat/:roomId" element={<Chats socket={socket} username={storedUsername} room={roomId}/>} />
        <Route path='/onGoingTasks/:id' element={<OnGoingTasks/>}></Route>
        <Route path="/receiver/:id" element={<ReceiverDetails />} />


        



      </Routes>
      
      </BrowserRouter>
    </div>
  )
}

export default App
