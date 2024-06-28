import { React, useEffect, useState } from "react"
import { FaCheckCircle, FaShoppingCart, FaSpinner } from "react-icons/fa"
import { Link, useParams } from "react-router-dom"
import Swal from "sweetalert2"
// import "../style/InvoiceStyle.css"
import apiInstance from "../../utils/axios"
// import { addToWishlist } from "../plugin/addToWishlist"
import useGetUserData from "../plugin/UserData"

function VendorShop() {
  const [products, setProduct] = useState([])
  const [vendor, setVendor] = useState([])

  const axios = apiInstance
  const userData = useGetUserData()
  const param = useParams()

  if (useGetUserData()?.vendor_id === 0) {
    window.location.href = "/vendor/register/"
  }

  useEffect(() => {
    axios.get(`vendor-products/${param?.vendor_slug}/`).then((res) => {
      setProduct(res.data.results)
      console.log(res.data.results)
    })
  }, [param])

  useEffect(() => {
    axios.get(`shop/${param?.vendor_slug}/`).then((res) => {
      setVendor(res.data)
      console.log(res.data)
    })
  }, [param])

  const addToWishlist = async (productId, userId) => {
    try {
      const formData = new FormData()
      formData.append("product_id", productId)
      formData.append("user_id", userId)

      const response = await apiInstance.post(
        `customer/wishlist/${userId}`,
        formData
      )
      console.log(response.data)
      Swal.fire({
        icon: "success",
        title: response.data.message,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddToWishlist = async (product_id) => {
    try {
      await addToWishlist(product_id, userData?.user_id)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <main className="mt-5">
      <div className="container">
        <section className="text-center container">
          <div className="row py-lg-5">
            <div className="col-lg-6 col-md-8 mx-auto">
              <img
                src={vendor.image}
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
                alt=""
              />
              <h1 className="fw-light">{vendor.name}</h1>
              <p className="lead text-muted">{vendor.description}</p>
            </div>
          </div>
        </section>
        <section className="text-center">
          <h4 className="mb-4">{products?.length} Product(s) </h4>
          <div className="row">
            {products.map((product, index) => (
              <div className="col-lg-4 col-md-12 mb-4" key={index.id}>
                <div className="card">
                  <div
                    className="bg-image hover-zoom ripple"
                    data-mdb-ripple-color="light"
                  >
                    <Link to={`/detail/${product.slug}`}>
                      <img
                        src={product.image}
                        className="w-100"
                        style={{
                          width: "200px",
                          height: "300px",
                          objectFit: "cover",
                        }}
                      />
                    </Link>
                    <a href="#!">
                      <div className="mask">
                        <div className="d-flex justify-content-start align-items-end h-100">
                          <h5>
                            <span className="badge badge-primary ms-2">
                              New
                            </span>
                          </h5>
                        </div>
                      </div>
                      <div className="hover-overlay">
                        <div
                          className="mask"
                          style={{
                            backgroundColor: "rgba(251, 251, 251, 0.15)",
                          }}
                        />
                      </div>
                    </a>
                  </div>
                </div>
                <div className="card-body">
                  <Link to={`/detail/${product.slug}`} className="text-reset">
                    <h5 className="card-title mb-3 ">
                      {product.title.slice(0, 30)}...
                    </h5>
                  </Link>
                  <Link to="/" className="text-reset">
                    <p>{product?.title}</p>
                  </Link>
                  <h6 className="mb-3">${product.price}</h6>
                  <div className="btn-group">
                    <button
                      onClick={() => handleAddToWishlist(product.id)}
                      type="button"
                      className="btn btn-danger px-3 ms-2 "
                    >
                      <i className="fas fa-heart" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/*Section: Wishlist*/}
      </div>
    </main>
  )
}

export default VendorShop
