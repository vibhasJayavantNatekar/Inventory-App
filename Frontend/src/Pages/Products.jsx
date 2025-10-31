import  { useEffect } from 'react'
import Sidebar from '../Components/sidebar'
import Topbar from '../Components/Topbar'
import { useState } from 'react'
import { FaFileExport } from 'react-icons/fa'
import axios from 'axios'

const Products = ({ onlogout ,user,role }) => {
  const [showExport, setShowExport] = useState(false)
  const [showForm, setshowForm] = useState(false)
  const [edit, setEdit] = useState(null)
  const [error, seterror] = useState("")
  const [form, setform] = useState({ name: "", category: "", qty: "", price: "", supplier: "" })
  

  const [ProductsData, setProductsData] = useState([])

  const [CategoryData, setCategoryData] = useState([])

  const [SupplierData, setSupplierData] = useState([])

  async function getdata() {

    const products = await axios.get(`http://localhost:4000/api/products`)

    setProductsData(products.data.products);

    const categories = await axios.get(`http://localhost:4000/api/categories`)
 
    setCategoryData(categories.data.category)

    const suppliers = await axios.get(`http://localhost:4000/api/suppliers`)
    setSupplierData(suppliers.data.supplier)


  }
  
 async function exportPdf() {
  try {
    const response = await axios.get("http://localhost:4000/api/products/get-pdf", {
      responseType: "blob", 
    });

    const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", "products_report.pdf"); 
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
    const response = await axios.get("http://localhost:4000/api/products/get-excel", {
      responseType: "blob", 
    });

    const fileURL = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", "products_report.xlsx"); // file name
    document.body.appendChild(link);
    link.click();
    link.remove();

    alert("✅ Excel file downloaded successfully!");
  } catch (error) {
    console.error("Excel download failed:", error);
    alert("❌ Failed to download Excel file.");
  }
}


  async function handleDelete(p_id) {


    if (window.confirm("Are you want to Delete :")) {
      await axios.delete(`http://localhost:4000/api/products/${p_id}`)
    }
    getdata();

  }




  const addform = async (e) => {
    e.preventDefault();
    console.log(e);
    if (!form.name || !form.category || !form.price || !form.qty || !form.supplier) {
      seterror("All fileds are required")
      return
    }
    const name = form.name
    const price = form.price
    const qty = form.qty
    const c_id = form.category
    const s_id = form.supplier
    if (edit) {
      await axios.put(`http://localhost:4000/api/products/${edit._id}`, { name, price, qty, c_id, s_id })

    } else {
      await axios.post("http://localhost:4000/api/products/", { name, price, qty, c_id, s_id })

    }

 
    setshowForm(false)
    setEdit(null)
    seterror("")
    getdata()




  }



  useEffect(() => {
    if (edit) {
      setform({ name: edit.name, category: edit.category, price: edit.price, qty: edit.qty, supplier: edit.supplier });
    } else {
      setform({ name:"",category:"",price:"",qty:"",supplier:"" });
    }

    getdata();

  }, [edit])




  return (
    <>
      <div className=" wrapper">

        <Sidebar onlogout={onlogout} role={role}/>

        <div className=" main-content">
          <Topbar data={"Product"} onlogout={onlogout} user={user} />

          <div className="actionButtons">
            <button className="add-btn" onClick={() => (setshowForm(true) || setform({name:"",category:"",price:"",qty:"",supplier:""}))}>+ADD PRODUCTS</button>


            <div className="export-dropdown-wrapper">
              <button className="export-btn" onClick={() => setShowExport(!showExport)}>
                <FaFileExport /> Export ▼
              </button>
              {showExport && (
                <ul className="export-dropdown">
                  <li onClick={() => exportExcel()  }>Export to Excel</li>
                
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
                  <th>Category </th>
                  <th>Qty </th>
                  <th>Price</th>
                  <th>Supplier</th>
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ProductsData.map(p => (
                  <tr key={p._id}>
                    <td>{p.p_id}</td>
                    <td>{p.name} </td>
                    <td>{p.c_id?.name} </td>
                    <td>{p.qty} </td>
                    <td>{p.price}</td>
                    <td>{p.s_id?.name}</td>
                    <td className='btn-edit' onClick={() => (setEdit(p) || setshowForm(true))}>Edit</td>
                    <td className='btn-delete' onClick={() => { handleDelete(p._id) }}>Delete</td>

                  </tr>


                ))}

              </tbody>
            </table>
          </div>

          {showForm && (

            <div className="form-wrapper">
              <div className="form product-form">
                <h2 >{edit ? "Edit Product" : "AddProduct "}</h2>

                <form onSubmit={addform}>

                  <input
                    type="text"
                    placeholder='Name'
                    name='name'
                    value={form.name}
                    onChange={(e) => (setform({ ...form, name: e.target.value }))}

                  />
                  <select
                    name="Category"
                    value={form.category}

                    onChange={(e) => setform({ ...form, category: e.target.value })}
                  >
                    <option value="">Select Category</option>

                    {CategoryData.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>


                  <input type="number" name="qty" id="qty" placeholder='Qty' value={form.qty} onChange={(e) => (setform({ ...form, qty: e.target.value }))}
                  />
                  <input type="number" name="price" id="price" value={form.price} placeholder='Price' onChange={(e) => (setform({ ...form, price: e.target.value }))}
                  />


                  <select name="Supplier" id="Supplier" value={form.supplier} onChange={(e) => (setform({ ...form, supplier: e.target.value }))}>
                    <option value="">Supplier </option>
                    {SupplierData.map(s => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>


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

export default Products