import Sidebar from '../Components/sidebar'
import Topbar from '../Components/Topbar'
import { FaFileExport, FaPlus } from 'react-icons/fa'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'

const Supplier = ({onlogout ,user ,role}) => {
    const [showExport, setshowExport] = useState(false)
    const [showForm, setshowForm] = useState(false)
    const [edit, setedit] = useState(null)
    const [error, seterror] = useState("")

 

    const [SupplierData, setSupplierData] = useState([])


    const [form, setform] = useState({ name: "", contact:"", address: "" })

    async function getdata() {
      
        const supplier = await axios.get(`http://localhost:4000/api/suppliers/`)
        setSupplierData(supplier.data.supplier)
        
    }

      async function handleDelete(p_id) {
    
     if(window.confirm("Are want to Delete:")){
    await axios.delete(`http://localhost:4000/api/suppliers/${p_id}`)
     }
    getdata();

  }

   async function exportPdf() {
  try {
    const response = await axios.get("http://localhost:4000/api/suppliers/get-pdf", {
      responseType: "blob", 
    });

    const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", "Supplier_list.pdf"); 
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
    const response = await axios.get("http://localhost:4000/api/suppliers/get-excel", {
      responseType: "blob", 
    });

    const fileURL = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", "Supplier.xlsx"); 
    document.body.appendChild(link);
    link.click();
    link.remove();

    alert("✅ Excel file downloaded successfully!");
  } catch (error) {
    console.error("Excel download failed:", error);
    alert("❌ Failed to download Excel file.");
  }
}


    const addform =  async(e) => {
        e.preventDefault();
        console.log(e);
        if (!form.name || !form.contact || !form.address) {
            seterror("All fileds are required")
            return
        }
        
         const name = form.name
            const  contact = form.contact
            const address = form.address
        if(edit){
             await axios.put(`http://localhost:4000/api/suppliers/${edit._id}`,{name,contact,address})             
            
        }else{
             await axios.post(`http://localhost:4000/api/suppliers/`,{name,contact,address})             

        }
        
        console.log("form");
        setshowForm(false)
        setedit(null)
        seterror("")
        getdata()

    }
 useEffect(() => {
        if (edit) {
            setform({ name: edit.name, contact:edit.contact , address:edit.address });
        } else {
            setform({ name: "", contact:"",address:"" });
        }

        getdata();

    }, [edit])




    return (
        <>
            <div className=" wrapper">

                       <Sidebar onlogout={onlogout} role={role} />


                <div className=" main-content">
                    <Topbar data={"Supplier"} onlogout={onlogout} user={user} />

                    <div className="actionButtons">
                        <button className="add-btn" onClick={() => setshowForm(true) ||  setform({ name: "", contact: "", address: "" })}>+ ADD Supplier</button>


                        <div className="export-dropdown-wrapper">
                            <button className="export-btn" onClick={() => setshowExport(!showExport)}>
                                <FaFileExport /> Export ▼
                            </button>
                            {showExport && (
                                <ul className="export-dropdown">
                                    <li onClick={() => exportExcel()}>Export to Excel</li>
                                    <li onClick={() => exportPdf() }>Export to PDF</li>
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
                                    <th>Contact</th>
                                    <th>Address</th>

                                    <th colSpan={2}>Actions</th>


                                </tr>


                            </thead>

                            <tbody>

                                {SupplierData.map(s => (
                                    <tr key={s._id}>
                                        <td>{s.s_id}</td>
                                        <td>{s.name} </td>
                                        <td>{s.contact}</td>
                                        <td>{s.address}</td>


                                        <td className='btn-edit' onClick={() => {setedit(s) || setshowForm(true) }}>Edit</td>
                                        <td className='btn-delete' onClick={() => { handleDelete(s._id) }}>Delete</td>

                                    </tr>


                                ))}

                            </tbody>


                        </table>
                    </div>

                    {showForm && (

                        <div className="form-wrapper">
                            <div className="form product-form">
                                <h2 >{edit ? "Edit Supplier" : "Add Supplier "}</h2>

                                <form onSubmit={addform}>

                                    <input
                                        type="text"
                                        placeholder='Name'
                                        name='name'
                                        value={form.name}
                                        onChange={(e) => (setform({ ...form, name: e.target.value }))}

                                    />




                                    <input type="text" name="contact"  placeholder='Contact' value={form.contact} onChange={(e) => (setform({ ...form, contact: e.target.value }))}
                                    />


                                    <input type="text" name="contact" placeholder='address' value={form.address} onChange={(e) => (setform({ ...form, address: e.target.value }))}
                                    />



                                    {error && <p className='error'>All Fields Are required...</p>}

                                    <div className="form-btn">
                                        <button type='button' className='cancel-btn' onClick={() => (setshowForm(false) || setedit(null))} >Cancle </button>
                                        <button type='submit' className='submit-btn'   > Submit</button>
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

export default Supplier