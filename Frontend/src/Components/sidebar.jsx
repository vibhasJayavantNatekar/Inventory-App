import { useState } from 'react'
import '../Components/sidebar.css'
import { FaBars, FaBox, FaHome, FaProductHunt, FaSignOutAlt, FaSupple, FaTags, FaTruck, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { TbReport } from 'react-icons/tb'


const sidebar = ({onlogout ,role}) => {

   const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setshowLogoutConfirm] = useState(false)

  return (
    <>

     <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </div>

   <aside className={`sidebar-Wrapper ${isOpen ? 'active' : ''}`}>
        <div className="sidebar">
            <h2 className="sidebar-title">Inventory</h2>

            <ul className="sidebar-list" onClick={() => setIsOpen(false)}>
                <li><Link to={'/dash'} ><FaHome/>Dashboard  </Link></li>
                <li> <Link to={'/product'} > <FaBox/> Products </Link> </li>
                <li> <Link to={'/supplier'} > <FaTruck/> Supplier </Link></li>
                <li> <Link to={'/category'}><FaTags/> Category</Link> </li>
 
              {role == "Admin"?
                <li> <Link to={'/users'}> <FaUser/> Users </Link></li>
                :""
              }

                <li><Link to={'/reports'}><TbReport/> Reports </Link></li>
                <li onClick={()=>(setshowLogoutConfirm(true))} >   <FaSignOutAlt/> Log Out</li>
            </ul>
        </div>
    </aside>



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
                                        onlogout(); 
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

export default sidebar