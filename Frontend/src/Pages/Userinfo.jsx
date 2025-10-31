
import '../Pages/Userinfo.css'
import { FaEnvelope, FaUserLarge, FaXmark } from 'react-icons/fa6'
import { FaSignOutAlt, FaUserTie } from 'react-icons/fa'
import { useState } from 'react'


const Userinfo = ({ onlogout ,onclose ,user }) => {

    const [showLogoutConfirm, setshowLogoutConfirm] = useState(false)

  
    return (
        <>

          
            <div className="userinfo">

                <button
                    className="userinfo-close"
                    onClick={onclose}
                    aria-label="Close Profile"
                >
                    <FaXmark size={22} />
                </button>

                <div className="profile-header">
                    <div className="profile-picture">
                        <FaUserLarge size={64} />
                    </div>
                    <div className="user-details">
                        <h5 className="user-name"> {user.name }</h5>
                        <p className="user-email"><FaEnvelope /> {user.email}</p>
                        <p className="user-role"><FaUserTie /> {user.role}</p>
                    </div>
                </div>

                <button className="logout-btn" onClick={()=> setshowLogoutConfirm(true)}>
                    <FaSignOutAlt />  Logout
                </button>
            </div>

                {showLogoutConfirm && (
                    <div className="form-wrapper">
                        <div className="form product-form">
                            <h3>Confirm Logout</h3>
                            <p>Do you want to logout?</p>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                                <button type="button" className="cancel-btn" onClick={() => setshowLogoutConfirm(false)}>No</button>
                                <button
                                    type="button"
                                    className="add-btn"
                                    onClick={() => {
                                        setshowLogoutConfirm(false)
                                        onlogout(); // <-- logout works now
                                    }}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                )}






        </>
    )
}

export default Userinfo