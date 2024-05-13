import React, { useState, useEffect } from "react"
import apiInstance from "../../utils/axios"
import { Link, useNavigate } from "react-router-dom"
import UserData from "../plugin/UserData"
import CartId from "../plugin/CartID"
import useGetAddress from "../plugin/UserCountry"
import Swal from "sweetalert2"

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
})

function Cart() {
  const [cart, setCart] = useState([])
  const [cartTotals, setCartTotals] = useState([])
  const [productQtys, setProductQtys] = useState("")
  const [contactInfo, setContactInfo] = useState({})

  const navigate = useNavigate()
  const userData = UserData()
  const cart_id = CartId()
  const currentAddress = useGetAddress()

  const fetchCartData = (cartId, userId) => {
    const url = userId
      ? `cart-list/${cartId}/${userId}/`
      : `cart-list/${cartId}`
    apiInstance.get(url).then((res) => {
      setCart(res.data)
    })
  }

  const fetchCartTotals = (cartId, userId) => {
    const url = userId
      ? `cart-details/${cartId}/${userId}/`
      : `cart-details/${cartId}`
    apiInstance.get(url).then((res) => {
      setCartTotals(res.data)
    })
  }

  // Fetch Cart list and Cart totals
  useEffect(() => {
    if (cart_id !== null || cart_id !== undefined) {
      if (userData !== undefined) {
        fetchCartData(cart_id, userData?.user_id)
        fetchCartTotals(cart_id, userData?.user_id)
      } else {
        fetchCartData(cart_id, null)
        fetchCartTotals(cart_id, null)
      }
    }
  }, [])

  // Fetch CartItem Qtys
  useEffect(() => {
    const initialQtys = {}
    cart.forEach((c) => {
      initialQtys[c.product?.id] = c.qty
    })

    setProductQtys(initialQtys)
  }, [cart])

  const handleQtyChange = (event, product_id) => {
    const qty = event.target.value
    console.log(qty)

    setProductQtys((prev) => ({
      ...prev,
      [product_id]: qty,
    }))
  }

  const updateCart = async (
    product_id,
    price,
    shipping_amount,
    color,
    size
  ) => {
    const qtyValue = productQtys[product_id]

    const formdata = new FormData()
    formdata.append("product_id", product_id),
      formdata.append("user_id", userData?.user_id),
      formdata.append("qty", qtyValue),
      formdata.append("price", price),
      formdata.append("shipping_amount", shipping_amount),
      formdata.append("country", currentAddress.country),
      formdata.append("size", size),
      formdata.append("color", color),
      formdata.append("cart_id", cart_id)

    const response = await apiInstance.post("cart/", formdata)
    console.log(response.data)
    Toast.fire({
      icon: "success",
      title: response.data.message,
    })
    if (userData !== undefined) {
      fetchCartData(cart_id, userData?.user_id)
      fetchCartTotals(cart_id, userData?.user_id)
    } else {
      fetchCartData(cart_id, null)
      fetchCartTotals(cart_id, null)
    }
  }

  const handleDeleteCartItem = async (itemId) => {
    const url = userData?.user_id
      ? `cart-delete/${cart_id}/${itemId}/${userData?.user_id}/`
      : `cart-delete/${cart_id}/${itemId}/`

    try {
      await apiInstance.delete(url)
      if (userData !== undefined) {
        fetchCartData(cart_id, userData?.user_id)
        fetchCartTotals(cart_id, userData?.user_id)
      } else {
        fetchCartData(cart_id, null)
        fetchCartTotals(cart_id, null)
      }
      Toast.fire({
        icon: "success",
        title: "Item removed From Cart",
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleContactInfo = (event) => {
    console.log(event.target.name)
    const { name, value } = event.target
    setContactInfo((prev) => ({ ...prev, [name]: value }))
    console.log(contactInfo)
  }

  const createCartOrder = async () => {
    if (
      !contactInfo.fullName ||
      !contactInfo.email ||
      !contactInfo.mobile ||
      !contactInfo.address ||
      !contactInfo.city ||
      !contactInfo.state ||
      !contactInfo.country
    ) {
      // If any required field is missing, show an error message or take appropriate action
      Swal.fire({
        icon: "warning",
        title: "Missing Fields!",
        text: "All fields are required before checkout",
      })
      return
    }

    try {
      const formData = new FormData()
      formData.append("full_name", contactInfo.fullName)
      formData.append("email", contactInfo.email)
      formData.append("mobile", contactInfo.mobile)
      formData.append("address", contactInfo.address)
      formData.append("city", contactInfo.city)
      formData.append("state", contactInfo.state)
      formData.append("country", contactInfo.country)
      formData.append("cart_id", cart_id)
      formData.append("user_id", userData ? userData.user_id : 0)

      const response = await apiInstance.post("create-order/", formData)
      Swal.fire({
        icon: "success",
        title: "Order successfully placed",
      })
      console.log(response.data.order_oid)

      navigate(`/checkout/${response.data.order_oid}`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <main className="mt-5">
        <div className="container">
          {/*Main layout*/}
          <main className="mb-6">
            <div className="container">
              {/* Section: Cart */}
              <section className="">
                <div className="row gx-lg-5 mb-5">
                  <div className="col-lg-8 mb-4 mb-md-0">
                    {/* Section: Product list */}
                    <section className="mb-5">
                      {cart.map((c, index) => (
                        <div className="row border-bottom mb-4" key={index}>
                          <div className="col-md-2 mb-4 mb-md-0">
                            <div
                              className="bg-image ripple rounded-5 mb-4 overflow-hidden d-block"
                              data-ripple-color="light"
                            >
                              <Link to={`/detail/${c?.product?.slug}`}>
                                <img
                                  src={c?.product?.image}
                                  className="w-100"
                                  alt=""
                                  style={{
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                  }}
                                />
                              </Link>
                              <a href="#!">
                                <div className="hover-overlay">
                                  <div
                                    className="mask"
                                    style={{
                                      backgroundColor:
                                        "hsla(0, 0%, 98.4%, 0.2)",
                                    }}
                                  />
                                </div>
                              </a>
                            </div>
                          </div>
                          <div className="col-md-8 mb-4 mb-md-0">
                            <Link
                              to={`/detail/${c.product.slug}`}
                              className="fw-bold text-dark mb-4"
                            >
                              {c?.product?.title.slice(0, 20)}...
                            </Link>
                            {c.size != "No Size" && (
                              <p className="mb-0">
                                <span className="text-muted me-2">Size:</span>
                                <span>{c.size}</span>
                              </p>
                            )}
                            {c.color != "No Color" && (
                              <p className="mb-0">
                                <span className="text-muted me-2">Color:</span>
                                <span>{c.color}</span>
                              </p>
                            )}
                            <p className="mb-0">
                              <span className="text-muted me-2">Price:</span>
                              <span>${c.product.price}</span>
                            </p>

                            <p className="mb-0">
                              <span className="text-muted me-2">Vendor:</span>
                              <span>{c.product.vendor.name}</span>
                            </p>
                            <p className="mt-3">
                              <a
                                href=""
                                className="text-danger pe-3 "
                                onClick={() => {
                                  handleDeleteCartItem(c.id)
                                }}
                              >
                                <small>
                                  <i className="fas fa-trash me-2" />
                                  Remove
                                </small>
                              </a>
                            </p>
                          </div>
                          <div className="col-md-2 mb-4 mb-md-0">
                            <div className="col-md-2 mb-4 mb-md-0">
                              <div className="d-flex justify-content-center align-items-center">
                                <div className="form-outline">
                                  <input
                                    style={{ width: " 100px" }}
                                    type="number"
                                    id={`qtyInput-${c.product.id}`}
                                    className="form-control"
                                    onChange={(e) =>
                                      handleQtyChange(e, c.product.id)
                                    }
                                    value={productQtys[c.product?.id]}
                                    min={1}
                                  />
                                </div>
                                <button
                                  className="ms-2 btn btn-primary"
                                  onClick={() =>
                                    updateCart(
                                      c.product.id,
                                      c.product.price,
                                      c.product.shipping_amount,
                                      c.color,
                                      c.size
                                    )
                                  }
                                >
                                  <i className="fas fa-rotate-right"></i>
                                </button>
                              </div>
                              <h5 className="mb-2 mt-3 text-center">
                                <span className="align-middle">
                                  ${c.sub_total}
                                </span>
                              </h5>
                            </div>
                          </div>
                        </div>
                      ))}

                      <>
                        <h5>Your Cart Is Empty</h5>
                        <Link to="/">
                          {" "}
                          <i className="fas fa-shopping-cart"></i> Continue
                          Shopping
                        </Link>
                      </>
                    </section>
                    <div>
                      <h5 className="mb-4 mt-4">Contact Information</h5>
                      {/* 2 column grid layout with text inputs for the first and last names */}
                      <div className="row mb-4">
                        <div className="col">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="full_name">
                              {" "}
                              <i className="fas fa-user"></i> Full Name
                            </label>
                            <input
                              type="text"
                              id=""
                              name="fullName"
                              className="form-control"
                              onChange={(e) => {
                                handleContactInfo(e)
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row mb-4">
                        <div className="col">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example1"
                            >
                              <i className="fas fa-envelope"></i> Email
                            </label>
                            <input
                              type="text"
                              id="form6Example1"
                              className="form-control"
                              name="email"
                              onChange={(e) => {
                                handleContactInfo(e)
                              }}
                            />
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example1"
                            >
                              <i className="fas fa-phone"></i> Mobile
                            </label>
                            <input
                              type="text"
                              id="form6Example1"
                              className="form-control"
                              name="mobile"
                              onChange={(e) => {
                                handleContactInfo(e)
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <h5 className="mb-1 mt-4">Shipping address</h5>

                      <div className="row mb-4">
                        <div className="col-lg-6 mt-3">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example1"
                            >
                              {" "}
                              Address
                            </label>
                            <input
                              type="text"
                              id="form6Example1"
                              className="form-control"
                              name="address"
                              onChange={(e) => {
                                handleContactInfo(e)
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-3">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example1"
                            >
                              {" "}
                              City
                            </label>
                            <input
                              type="text"
                              id="form6Example1"
                              className="form-control"
                              name="city"
                              onChange={(e) => {
                                handleContactInfo(e)
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 mt-3">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example1"
                            >
                              {" "}
                              State
                            </label>
                            <input
                              type="text"
                              id="form6Example1"
                              className="form-control"
                              name="state"
                              onChange={(e) => {
                                handleContactInfo(e)
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-3">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example1"
                            >
                              {" "}
                              Country
                            </label>
                            <input
                              type="text"
                              id="form6Example1"
                              className="form-control"
                              name="country"
                              onChange={(e) => {
                                handleContactInfo(e)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 mb-4 mb-md-0">
                    {/* Section: Summary */}
                    <section className="shadow-4 p-4 rounded-5 mb-4">
                      <h5 className="mb-3">Cart Summary</h5>
                      <div className="d-flex justify-content-between mb-3">
                        <span>Sub total </span>
                        <span>${cartTotals.sub_total?.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Shipping </span>
                        <span>${cartTotals.shipping?.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Tax </span>
                        <span>${cartTotals.tax?.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Servive Fee </span>
                        <span>${cartTotals.service_fee?.toFixed(2)}</span>
                      </div>
                      <hr className="my-4" />
                      <div className="d-flex justify-content-between fw-bold mb-5">
                        <span>Total </span>
                        <span>${cartTotals.total?.toFixed(2)}</span>
                      </div>

                      <button
                        className="btn btn-primary btn-rounded w-100"
                        onClick={createCartOrder}
                      >
                        Proceed to checkout
                      </button>
                    </section>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </main>
    </div>
  )
}

export default Cart
