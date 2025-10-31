import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Login from './Pages/login'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import Products from './Pages/Products'
import Supplier from './Pages/Supplier'
import Category from './Pages/Category'
import Users from './Pages/Users'
import Reports from './Pages/Reports'
import Userinfo from './Pages/Userinfo'

function App() {
  

  const [islogin, setislogin] = useState(false)
   const [user, setUser] = useState(null);
   const [role, setrole] = useState("")
 

  const handlelogin = (userData) => {
   
    setUser(userData); 
    setislogin(true)

  }
  const handlelogout = () => {

    setislogin(false)
    
  }

  useEffect(() => {
     const savedUser = localStorage.getItem('user');
     if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setrole(parsed.role);
      setislogin(true);
    }

  }, [])
  

  return (
    <>


      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login onlogin={handlelogin} />} />

          <Route path='/dash' element={islogin ? <Dashboard onlogout={handlelogout} user={user} role={role} /> : <Navigate to="/" />} />


          <Route path='/product' element={islogin ? <Products onlogout={handlelogout}  user={user} role={role}/> : <Navigate to='/' />} />
          <Route path='/supplier' element={islogin ? <Supplier onlogout={handlelogout} user={user} role={role}  /> : <Navigate to='/' />} />
          <Route path="/category" element={islogin ? <Category onlogout={handlelogout} user={user} role={role}  /> : <Navigate to='/' />} />
          <Route path="/reports" element={islogin ? <Reports onlogout={handlelogout} user={user}  role={role} /> : <Navigate to='/' />} />
       {role === 'Admin' && (
          <Route
            path="/users"
            element={islogin ? <Users onlogout={handlelogout} user={user} role={role} /> : <Navigate to="/" />}
          />
        )}
        <Route path="/userinfo" element={islogin ? <  Userinfo onlogout={handlelogout} user={user} /> : <Navigate to='/' />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
