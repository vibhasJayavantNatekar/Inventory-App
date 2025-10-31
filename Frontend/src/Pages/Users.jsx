import React, { useEffect } from 'react'
import { useState } from 'react'
import Sidebar from '../Components/sidebar'
import Topbar from '../Components/Topbar'
import { FaFileExport } from 'react-icons/fa'
import axios from 'axios'


const Users = ({ onlogout ,user,role }) => {


    const [showExport, setshowExport] = useState(false)
    const [showForm, setshowForm] = useState(false)
    const [edit, setEdit] = useState(null)
    const [error, seterror] = useState("")
    const [form, setform] = useState({ name: "", email: "", role: "", active: false, password: "" })

 
    const [UsersData, setUsersData] = useState([])

    async function getdata() {
        const users = await axios.get(`http://localhost:4000/api/users`)

        setUsersData(users.data.users)
    }

    
async function exportExcel() {
  try {
    const response = await axios.get("http://localhost:4000/api/users/get-excel", {
      responseType: "blob", 
    });

    const fileURL = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", "users_list.xlsx"); // file name
    document.body.appendChild(link);
    link.click();
    link.remove();

    alert("✅ Excel file downloaded successfully!");
  } catch (error) {
    console.error("Excel download failed:", error);
    alert("❌ Failed to download Excel file.");
  }
}

 
    async function handleDelete(c_id) {

        if (window.confirm("Are you want to Delete;")) {
            await axios.delete(`http://localhost:4000/api/users/${c_id}`)
            console.log("deleted");
        }
        getdata();

    }

     async function exportPdf() {
  try {
    const response = await axios.get("http://localhost:4000/api/users/get-pdf", {
      responseType: "blob", 
    });

    const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", "Users_list.pdf"); 
    document.body.appendChild(link);
    link.click(); 
    link.remove(); 

    alert("✅ PDF downloaded successfully!");
  } catch (error) {
    console.error("PDF download failed:", error);
    alert("❌ Failed to download PDF.");
  }
}

    const addform = async (e) => {
        e.preventDefault();
   
        if (!form.name || !form.email || !form.role || !form.password) {
            seterror("All fileds are required")
            return
        }

        const name = form.name
        const email = form.email
        const role = form.role
        const password = form.password
        const active = form.active

        if (edit) {
            await axios.put(`http://localhost:4000/api/users/${edit._id}`,  { name, email, password, active, role })
        } else {
            await axios.post(`http://localhost:4000/api/users/`, { name, email, password, active, role })
        }

        console.log("form");
        setshowForm(false)
        setEdit(null)
        getdata()




    }

    useEffect(() => {
        if (edit) {
            setform({
                name: edit.name,
                email: edit.email,
                role: edit.role,
                password: edit.password,
                active: edit.active,
            });
        } else {
            setform({ name: "", email: "", role: "", password: "", active: false  });

        }

        getdata();

    }, [edit])



    return (

        <>

            <div className=" wrapper">

                <Sidebar onlogout={onlogout} role={role} />


                <div className=" main-content">
                    <Topbar data={"Users"} onlogout={onlogout}  user={user}/>

                    <div className="actionButtons">
                        <button className="add-btn" onClick={() => (setshowForm(true) || setform({name:"",email:"",role:"",password:""}))}>+ ADD Users</button>


                        <div className="export-dropdown-wrapper">
                            <button className="export-btn" onClick={() => (setshowExport(!showExport))}>
                                <FaFileExport /> Export ▼
                            </button>
                            {showExport && (
                                <ul className="export-dropdown">
                                    <li onClick={() => exportExcel() }>Export to Excel</li>
                                    <li onClick={() => exportPdf()}>Export to PDF</li>
                                </ul>
                            )}
                        </div>

                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name </th>
                                    <th>Emaill</th>
                                    <th>Role</th>
                                    <th>Status</th>

                                    <th colSpan={2}>Actions</th>


                                </tr>


                            </thead>

                            <tbody>

                                {UsersData.map(u => (
                                    <tr key={u._id}>
                                        <td>{u.userID}</td>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.role}</td>
                                     
                                        <td>{u.active ? "Active" : "Inactive"}</td>


                                        <td className='btn-edit' onClick={() => { setEdit(u) || setshowForm(true) }}>Edit</td>
                                        <td className='btn-delete' onClick={() => { handleDelete(u._id) }}>Delete</td>

                                    </tr>


                                ))}

                            </tbody>


                        </table>
                    </div>

                    {showForm && (

                        <div className="form-wrapper">
                            <div className="form product-form">
                                <h2 >{edit ? "Edit Users" : "Add Users "}</h2>

                                <form onSubmit={addform}>

                                    <input
                                        type="text"
                                        placeholder='Name'
                                        name='name'
                                        value={form.name}
                                        onChange={(e) => (setform({ ...form, name: e.target.value }))}

                                    />




                                    <input type="text" name="email" id="email" placeholder='Email' value={form.email} onChange={(e) => (setform({ ...form, email: e.target.value }))}
                                    />

                                    <select name="role" id="role" value={form.role} onChange={(e) => (setform({ ...form, role: e.target.value }))}>
                                        <option value="">Role</option>


                                        <option value="Admin">Admin </option>
                                        <option value="Staff">Staff</option>
                                        <option value="Viewer">Viewer</option>

                                    </select>

                                    <input type="password" name="password" id="password" placeholder='Password' value={form.password} onChange={(e) => (setform({ ...form, password: e.target.value }))}
                                    />


                                    <input
                                        type="checkbox"
                                        name="status"
                                        id="status"
                                        checked={form.active}
                                        onChange={(e) => setform({ ...form, active: e.target.checked })}
                                    />

                                    <label htmlFor="status">Active</label>





                                    {error && <p className='error'>All Fields Are required...</p>}

                                    <div className="form-btn">
                                        <button type='button' className='cancel-btn' onClick={() => (setshowForm(false) || setEdit(null))} >Cancle </button>
                                        <button type='submit' className='submit-btn' > Submit</button>
                                    </div>

                                </form>
                            </div>
                        </div>

                    )

                    }

                </div>

            </div>

        </>
    )
}

export default Users