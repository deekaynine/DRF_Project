import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Link } from "react-router-dom"
import apiInstance from "../../utils/axios"

const PAGE_SIZE = 2

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState([])
  const [productsCount, setProductsCount] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1)

  useEffect(() => {
    if (searchParams.get("page")) {
      apiInstance
        .get(`products/?page=${searchParams.get("page")}`)
        .then((res) => {
          setProducts(res.data.results)
          setProductsCount(res.data.count)
          setPageCount(Math.ceil(res.data.count / PAGE_SIZE))
          setCurrentPage(searchParams.get("page"))
        })
    } else {
      apiInstance.get(`products/`).then((res) => {
        setProducts(res.data.results)

        if (res.data.count !== 0) {
          setProductsCount(res.data.count)
          setPageCount(Math.ceil(res.data.count / PAGE_SIZE))
          setCurrentPage(1)
        }
      })
    }
  }, [searchParams.get("page"), currentPage])

  useEffect(() => {
    apiInstance.get(`category/`).then((res) => {
      setCategory(res.data.results)
    })
  }, [])

  let pageCountHolder = []

  for (let i = 1; i <= pageCount; i++) {
    pageCountHolder.push(i)
  }

  return (
    <>
      <main className="mt-5">
        <div className="container">
          <section className="text-center">
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
            <br />
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}

            {pageCount < 5 && pageCount > 0 && (
              <div className="flex w-full border  ">
                {currentPage == 1 ? "" : <>left</>}
                {pageCountHolder.map((page, index) => (
                  <Link
                    key={index}
                    style={{
                      textDecoration: "none",
                      color: "black",
                      marginInline: "3px",
                      "font-size": "12px",
                      content: "border-box",
                    }}
                    to={`http://localhost:5173/?page=${page}`}
                  >
                    <button
                      onClick={() => console.log(currentPage)}
                      className="border px-2 py-2 "
                    >
                      {page}
                    </button>
                  </Link>
                ))}
                {currentPage == 4 ? "" : <>right</>}
              </div>
            )}

            {pageCount >= 5 &&
              currentPage > 3 &&
              currentPage < pageCountHolder.length - 2 && (
                <div className="flex w-full border  ">
                  <>left</>
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "black",
                      marginInline: "3px",
                      "font-size": "12px",
                      content: "border-box",
                    }}
                    to={`http://localhost:5173/?page=${pageCountHolder[0]}`}
                  >
                    <button
                      onClick={() => {
                        console.log(currentPage)
                      }}
                      className="border px-2 py-2 "
                    >
                      {pageCountHolder[0]}
                    </button>
                  </Link>
                  <span>...</span>
                  {pageCountHolder
                    .slice(
                      currentPage - 3,
                      pageCountHolder.length -
                        (pageCountHolder.length - currentPage) +
                        2
                    )
                    .map((page, index) => (
                      <Link
                        key={index}
                        style={{
                          textDecoration: "none",
                          color: "black",
                          marginInline: "3px",
                          "font-size": "12px",
                          content: "border-box",
                        }}
                        to={`http://localhost:5173/?page=${page}`}
                      >
                        <button
                          onClick={() => console.log(currentPage)}
                          className="border px-2 py-2 "
                        >
                          {page}
                        </button>
                      </Link>
                    ))}
                  <span>...</span>
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "black",
                      marginInline: "3px",
                      "font-size": "12px",
                      content: "border-box",
                    }}
                    to={`http://localhost:5173/?page=${pageCountHolder[pageCountHolder.length - 1]}`}
                  >
                    <button
                      onClick={() => {
                        console.log(currentPage)
                      }}
                      className="border px-2 py-2 "
                    >
                      {pageCountHolder[pageCountHolder.length - 1]}
                    </button>
                  </Link>
                  <>right</>
                </div>
              )}

            {pageCount >= 5 && currentPage == 3 && (
              <div className="flex w-full border  ">
                <>left</>
                {pageCountHolder
                  .slice(
                    currentPage - 3,
                    pageCountHolder.length -
                      (pageCountHolder.length - currentPage) +
                      2
                  )
                  .map((page, index) => (
                    <Link
                      key={index}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        marginInline: "3px",
                        "font-size": "12px",
                        content: "border-box",
                      }}
                      to={`http://localhost:5173/?page=${page}`}
                    >
                      <button
                        onClick={() => console.log(currentPage)}
                        className="border px-2 py-2 "
                      >
                        {page}
                      </button>
                    </Link>
                  ))}
                <span>...</span>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "black",
                    marginInline: "3px",
                    "font-size": "12px",
                    content: "border-box",
                  }}
                  to={`http://localhost:5173/?page=${pageCountHolder[pageCountHolder.length - 1]}`}
                >
                  <button
                    onClick={() => {
                      console.log(currentPage)
                    }}
                    className="border px-2 py-2 "
                  >
                    {pageCountHolder[pageCountHolder.length - 1]}
                  </button>
                </Link>
                <>right</>
              </div>
            )}

            {pageCount >= 5 && currentPage == 2 && (
              <div className="flex w-full border  ">
                <span>left</span>
                {pageCountHolder.slice(0, 4).map((page, index) => (
                  <Link
                    key={index}
                    style={{
                      textDecoration: "none",
                      color: "black",
                      marginInline: "3px",
                      "font-size": "12px",
                      content: "border-box",
                    }}
                    to={`http://localhost:5173/?page=${page}`}
                  >
                    <button
                      onClick={() => {
                        console.log(currentPage)
                      }}
                      className="border px-2 py-2"
                    >
                      {page}
                    </button>
                  </Link>
                ))}
                <span>...</span>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "black",
                    marginInline: "3px",
                    "font-size": "12px",
                    content: "border-box",
                  }}
                  to={`http://localhost:5173/?page=${pageCountHolder[pageCountHolder.length - 1]}`}
                >
                  <button
                    onClick={() => {
                      console.log(currentPage)
                    }}
                    className="border px-2 py-2 "
                  >
                    {pageCountHolder[pageCountHolder.length - 1]}
                  </button>
                </Link>
                <span>right</span>
              </div>
            )}

            {pageCount >= 5 && currentPage == 1 && (
              <div className="flex w-full border  ">
                {pageCountHolder.slice(0, 3).map((page, index) => (
                  <Link
                    key={index}
                    style={{
                      textDecoration: "none",
                      color: "black",
                      marginInline: "3px",
                      "font-size": "12px",
                      content: "border-box",
                    }}
                    to={`http://localhost:5173/?page=${page}`}
                  >
                    <button
                      onClick={() => {
                        console.log(currentPage)
                      }}
                      className="border px-2 py-2 "
                    >
                      {page}
                    </button>
                  </Link>
                ))}
                <span>...</span>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "black",
                    marginInline: "3px",
                    "font-size": "12px",
                    content: "border-box",
                  }}
                  to={`http://localhost:5173/?page=${pageCountHolder[pageCountHolder.length - 1]}`}
                >
                  <button
                    onClick={() => {
                      console.log(currentPage)
                    }}
                    className="border px-2 py-2 "
                  >
                    {pageCountHolder[pageCountHolder.length - 1]}
                  </button>
                </Link>
                <span>right</span>
              </div>
            )}
            {pageCount >= 5 && currentPage == pageCountHolder.length && (
              <div className="flex w-full border  ">
                <span>left</span>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "black",
                    marginInline: "3px",
                    "font-size": "12px",
                    content: "border-box",
                  }}
                  to={`http://localhost:5173/?page=${pageCountHolder[0]}`}
                >
                  <button
                    onClick={() => {
                      console.log(currentPage)
                    }}
                    className="border px-2 py-2 "
                  >
                    {pageCountHolder[0]}
                  </button>
                </Link>
                <span>...</span>
                {pageCountHolder.slice(-3).map((page, index) => (
                  <Link
                    key={index}
                    style={{
                      textDecoration: "none",
                      color: "black",
                      marginInline: "3px",
                      "font-size": "12px",
                      content: "border-box",
                    }}
                    to={`http://localhost:5173/?page=${page}`}
                  >
                    <button
                      onClick={() => {
                        console.log(currentPage)
                      }}
                      className="border px-2 py-2 "
                    >
                      {page}
                    </button>
                  </Link>
                ))}
              </div>
            )}
            {pageCount >= 5 && currentPage == pageCountHolder.length - 1 && (
              <div className="flex w-full border  ">
                <>left</>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "black",
                    marginInline: "3px",
                    "font-size": "12px",
                    content: "border-box",
                  }}
                  to={`http://localhost:5173/?page=${pageCountHolder[0]}`}
                >
                  <button
                    onClick={() => {
                      console.log(currentPage)
                    }}
                    className="border px-2 py-2 "
                  >
                    {pageCountHolder[0]}
                  </button>
                </Link>
                <span>...</span>
                {pageCountHolder
                  .slice(
                    currentPage - 3,
                    pageCountHolder.length -
                      (pageCountHolder.length - currentPage) +
                      2
                  )
                  .map((page, index) => (
                    <Link
                      key={index}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        marginInline: "3px",
                        "font-size": "12px",
                        content: "border-box",
                      }}
                      to={`http://localhost:5173/?page=${page}`}
                    >
                      <button
                        onClick={() => console.log(currentPage)}
                        className="border px-2 py-2 "
                      >
                        {page}
                      </button>
                    </Link>
                  ))}
              </div>
            )}
            {pageCount >= 5 && currentPage == pageCountHolder.length - 2 && (
              <div className="flex w-full border  ">
                <>left</>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "black",
                    marginInline: "3px",
                    "font-size": "12px",
                    content: "border-box",
                  }}
                  to={`http://localhost:5173/?page=${pageCountHolder[0]}`}
                >
                  <button
                    onClick={() => {
                      console.log(currentPage)
                    }}
                    className="border px-2 py-2 "
                  >
                    {pageCountHolder[0]}
                  </button>
                </Link>
                <span>...</span>
                {pageCountHolder
                  .slice(
                    currentPage - 3,
                    pageCountHolder.length -
                      (pageCountHolder.length - currentPage) +
                      2
                  )
                  .map((page, index) => (
                    <Link
                      key={index}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        marginInline: "3px",
                        "font-size": "12px",
                        content: "border-box",
                      }}
                      to={`http://localhost:5173/?page=${page}`}
                    >
                      <button
                        onClick={() => console.log(currentPage)}
                        className="border px-2 py-2 "
                      >
                        {page}
                      </button>
                    </Link>
                  ))}
              </div>
            )}

            <br />
          </section>
          {/*Section: Wishlist*/}
        </div>
      </main>
    </>
  )
}

export default Products
