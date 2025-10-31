
import { useState } from 'react'
import '../Pages/login.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';



const login = ({ onlogin }) => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, seterrors] = useState({});

  const navigate = useNavigate();

  const ourdata = {
    User: "Vibhas",
    Pass: "123456",
    Actuve: true
  }



  function handleChange(e) {


    if (e.target.name == 'username') {
      setUsername(e.target.value)


    } else {
      setPassword(e.target.value)
    }


  }
async function validate() {
  const temp = {};

  if (!username.trim().length) {
    temp.username = "Username field is required!";
  }
  if (!password.trim().length) {
    temp.password = "Password is required!";
  }

  if (Object.keys(temp).length > 0) return temp;

  const name = username;
  try {
    const result = await axios.post(`http://localhost:4000/api/login`, { name, password });


   
    if (result.data.user) {
    
      return { user: result.data.user };
    }


    if (result.data === "Failed") temp.notFound = "User not found!";
    if (result.data === "Inactive") temp.active = "This user is not active.";
    if (result.data === "Invalid") temp.active = "Invalid username or password.";

    return temp;
  } catch (err) {
    console.error("Login error:", err);
    temp.server = "Server error — please try again later.";
    return temp;
  }
}

  async function handleLogin(e) {
    e.preventDefault();

    const result = await validate();
  seterrors(result);

  // ✅ If we got a user object
  if (result.user) {
    const userData = result.user;

    localStorage.setItem("user", JSON.stringify(userData));

    onlogin(userData);
    navigate("/dash");
    }


  }



  return (
    <>
      <div className="login-Wrapper">
        <div className="login-card">
          <h2 className="login-title">Ineventory Login</h2>

          <form action="" className='login-form' onSubmit={handleLogin}>
            <input type="text"
              placeholder='Enter a Username eg. Vibhas'
              className='login-input'

              name='username'
              onChange={(e) => (setUsername(e.target.value))}
              value={username}

            />



            {errors.username ? <p className='error'>{errors.username}</p> : ""}


            <input
              type="password"
              className='login-input'
              placeholder='Enter a Password eg.123'
              name='password'
              onChange={(e) => (setPassword(e.target.value))}
              value={password}

            />
            {errors.active ? <p className='error'>{errors.active}</p> : ""}
            {errors.password ? <p className='error'>{errors.password}</p> : " "}
            {errors.notFound ? <p className='error'>{errors.notFound}</p> : ""}
            <button type='submit' className='login-btn'>Log In</button>

          </form>
        </div>
      </div>
    </>
  )
}
export default login
