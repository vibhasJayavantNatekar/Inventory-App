import Sidebar from '../Components/sidebar'
import '../Pages/Dashboard.css'
import Topbar from '../Components/Topbar'
import Cards from '../Components/Cards'
import { useEffect, useState } from 'react'
import axios from 'axios'


const Dashboard = ({ onlogout ,role, user }) => {


  const [ProductsData, setProductsData] = useState([])


  async function getdata() {
    const products = await axios.get(`http://localhost:4000/api/products`)
    setProductsData(products.data.products);

  }

  useEffect(() => {

    getdata()

  }, [])



  return (
    <>


      <div className='dashboard-wrapper'>

        <Sidebar onlogout={onlogout}  role={role}/>


        <div className="main-content">
          <Topbar data={"Dashboard"} onlogout={onlogout} user={user} />

          <div className="cards">
            <Cards />

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

                  </tr>


                ))}

              </tbody>


            </table>
          </div>
        </div>

      </div>



    </>
  )
}

export default Dashboard