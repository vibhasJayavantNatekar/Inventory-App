import '../Components/Topbar.css'
import { FaAccessibleIcon, FaArrowAltCircleDown, FaUserCircle, FaUserPlus } from 'react-icons/fa'
import { FaArrowDown, FaArrowPointer, FaCircleUser, FaDropbox, FaUserLarge } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import Userinfo from '../Pages/Userinfo'
import { useState } from 'react'

const Topbar = ({ data, onlogout ,user }) => {

  const [showuserinfo, setshowuserinfo] = useState(false)
  const handleCloseUserinfo = () => setshowuserinfo(false);

  const navigate = useNavigate()



  return (
    <>
     
      <div className="topbar">
        <h2 className="topbar-title">{data}</h2>
        <div
          className="user-info"
          onClick={() => setshowuserinfo(true)}
        >
          <div className="user-container">
            <span><FaUserLarge /></span>
            <h5 className="user-name">{user.name}</h5>
          </div>
        </div>
      </div>
      {showuserinfo && (
        <div className="userinfo-overlay" onClick={() => setshowuserinfo(false)}>
          <div
            className="userinfo-modal"
            onClick={e => e.stopPropagation()} 
          >
            <Userinfo onlogout={onlogout} onclose={handleCloseUserinfo} user={user}/>
          </div>
        </div>
      )}

    </>
  )
}

export default Topbar