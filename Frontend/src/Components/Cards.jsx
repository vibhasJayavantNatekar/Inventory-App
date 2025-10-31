import { useEffect, useState } from 'react'
import axios from 'axios'
import '../Components/Cards.css'

const Cards = () => {

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
            <div className="card-container">
                <div className="card-1">
                    Total Products : <span>{ProductsData.length} </span>
                </div>
                <div className="card-2">
                    Inventory Value: <span>₹{ProductsData.reduce((sum, p) => sum + (p.price * p.qty), 0)}</span>
                </div>

                <div className="card-1">
                    Total Quantity: <span>{ProductsData.reduce((sum, p) => sum + p.qty, 0)}</span>
                </div>
            </div>
        </>


    )
}

export default Cards