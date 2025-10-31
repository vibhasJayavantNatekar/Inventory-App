import { useState } from 'react'
import Sidebar from '../Components/sidebar'
import Topbar from '../Components/Topbar'
import { FaFileExport } from 'react-icons/fa'

import axios from 'axios'
import { useEffect } from 'react'

const Category = ({ onlogout ,user ,role }) => {

    const [showExport, setshowExport] = useState(false)
    const [showForm, setshowForm] = useState(false)
  
    
    const [edit, setEdit] = useState(null)
    const [error, seterror] = useState("")
    const [form, setform] = useState({ name: "", des: "" })

   

    const [CategoryData, setCategoryData] = useState([])


    async function getdata() {
        const categories = await axios.get(`http://localhost:4000/api/categories`)
        setCategoryData(categories.data.category)
    }

    async function handleDelete(c_id) {
        if (window.confirm("Are you want to Delete;")) {
            await axios.delete(`http://localhost:4000/api/categories/${c_id}`)
            console.log("deleted");
        }
        getdata();

    }

     async function exportPdf() {
  try {
    const response = await axios.get("http://localhost:4000/api/categories/get-pdf", {
      responseType: "blob", 
    });

    const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", "category_list.pdf"); 
    document.body.appendChild(link);
    link.click(); 
    link.remove(); 

    alert("✅ PDF downloaded successfully!");
  } catch (error) {
    console.error("PDF download failed:", error);
    alert("❌ Failed to download PDF.");
  }
}


async function exportExcel() {
  try {
    const response = await axios.get("http://localhost:4000/api/categories/get-excel", {
      responseType: "blob", 
    });

    const fileURL = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", "category_list.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

    alert("✅ Excel file downloaded successfully!");
  } catch (error) {
    console.error("Excel download failed:", error);
    alert("❌ Failed to download Excel file.");
  }
}


    const addform = async (e) => {
        e.preventDefault();
        
        if (!form.name || !form.des) {
            seterror("All fileds are required")
            return
        }
        const name = form.name
        const description = form.des


        if (edit) {
            await axios.put(`http://localhost:4000/api/categories/${edit._id}`, { name, description })

        } else {

            await axios.post(`http://localhost:4000/api/categories/ `, { name, description })

        }


        console.log("form");
        setshowForm(false)
        setEdit(null)

        getdata();

    }

    useEffect(() => {
        if (edit) {
            setform({ name: edit.name, des: edit.description });
        } else {
            setform({ name: "", des: "" });
        }

        getdata();

    }, [edit])



    return (

        <>

            <div className=" wrapper">

                     <Sidebar onlogout={onlogout}  role={role}/>


                <div className=" main-content">
                    <Topbar data={"Category"} onlogout={onlogout}  user={user}/>

                    <div className="actionButtons">
                        <button className="add-btn" onClick={() => (setshowForm(true))}>+ ADD Category</button>


                        <div className="export-dropdown-wrapper">
                            <button className="export-btn" onClick={() => setshowExport(!showExport)}>
                                <FaFileExport /> Export ▼
                            </button>
                            {showExport && (
                                <ul className="export-dropdown">
                                    <li onClick={() => exportExcel()}>Export to Excel</li>
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
                                    <th>Des</th>

                                    <th colSpan={2}>Actions</th>


                                </tr>


                            </thead>

                            <tbody>

                                {CategoryData.map(c => (
                                    <tr key={c._id}>
                                        <td>{c.c_id}</td>
                                        <td>{c.name}</td>
                                        <td>{c.description}</td>


                                        <td className='btn-edit' onClick={() => { setEdit(c) || setshowForm(true) }}>Edit</td>
                                        <td className='btn-delete' onClick={() => { handleDelete(c._id) }}>Delete</td>

                                    </tr>


                                ))}

                            </tbody>


                        </table>
                    </div>

                    {showForm && (

                        <div className="form-wrapper">
                            <div className="form product-form">
                                <h2 >{edit ? "Edit Category" : "Add Category "}</h2>

                                <form onSubmit={addform}>

                                    <input
                                        type="text"
                                        placeholder='Name'
                                        value={form.name}
                                        name='name'
                                        onChange={(e) => (setform({ ...form, name: e.target.value }))}

                                    />




                                    <input type="text" name="des" id="des" placeholder='desScription' value={form.des} onChange={(e) => (setform({ ...form, des: e.target.value }))}
                                    />






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

export default Category