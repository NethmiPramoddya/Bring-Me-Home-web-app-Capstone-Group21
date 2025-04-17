import React,{useEffect,useState} from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

function Notifications({userId}) {
    const [notifications, setNotifications] = useState([])
    const navigate = useNavigate()

    useEffect(()=>{
        console.log("User ID:", userId);
        if(userId){
            axios.get(`http://localhost:3002/notifications/${userId}`)
            .then(res=>{
                console.log(res.data);
                setNotifications(res.data)})
            .catch(err => console.error("Error fetching notifications:", err))
        }
    },[userId])

  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id} className="py-2 border-b">
                <Link to={notification.link} className="text-blue-600 hover:underline">
                    {notification.content}
                </Link>
                <p className="text-sm text-gray-500">{new Date(notification.dateTime).toLocaleString()}</p>
            </li>
        ))}

        </ul>
      )}
    </div>
  )
}

export default Notifications