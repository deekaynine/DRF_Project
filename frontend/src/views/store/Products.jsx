import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import apiInstance from "../../utils/axios"

function Products() {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState([])

  useEffect(() => {
    apiInstance.get(`products/`).then((res) => {
      setProducts(res.data)
      console.log(res.data)
    })
  }, [])

  useEffect(() => {
    apiInstance.get(`category/`).then((res) => {
      setCategory(res.data)
      console.log(res.data)
    })
  }, [])

  return (
    <>
      <main className="mt-5">
        <div className="container">
          <section className="text-center">
            <div className="row">
              {products?.map((p, index) => (
                <div className="col-lg-4 col-md-6 mb-4" key={index}>
                  <div className="card">
                    <div
                      className="bg-image hover-zoom ripple"
                      data-mdb-ripple-color="light"
                    >
                      <Link to={`/detail/${p.slug}/`}>
                        <img
                          src={p.image}
                          className="w-100"
                          style={{
                            width: "100%",
                            height: "250px",
                            objectFit: "cover",
                          }}
                        />
                      </Link>
                    </div>
                    <div className="card-body">
                      <a href="" className="text-reset">
                        <h5 className="card-title mb-3">{p.title}</h5>
                      </a>
                      <a href="" className="text-reset">
                        <p>{p.category?.title}</p>
                      </a>
                      <div className="d-flex justify-content-center">
                        <p className="mb-3">${p.price}</p>
                        <p className="mb-3 text-muted">
                          <strike>${p.og_price}</strike>
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary me-1 mb-1"
                      >
                        Add to cart
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger px-3 me-1 mb-1"
                      >
                        <i className="fas fa-times" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Categories */}
            <div className="row">
              {category?.map((c, index) => (
                <div className="col-lg-2" key={index}>
                  <img
                    src={c.image}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    alt=""
                  />
                  <h6>{c.title}</h6>
                </div>
              ))}
            </div>
          </section>
          {/*Section: Wishlist*/}
        </div>
      </main>
    </>
  )
}

export default Products
