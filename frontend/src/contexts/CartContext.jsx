import { createContext, useState, useContext, useEffect } from "react"
import CartId from "../views/plugin/CartID"
import UserData from "../views/plugin/UserData"
import apiInstance from "../utils/axios"

export const CartContext = createContext(null)

// eslint-disable-next-line react/prop-types
export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0)
  const cart_id = CartId()
  const userData = UserData()
  console.log(cartCount)

  useEffect(() => {
    // Getting cart
    const url = userData
      ? `cart-list/${cart_id}/${userData?.user_id}/`
      : `cart-list/${cart_id}/`

    try {
      let fetchCart = () => {
        apiInstance.get(url).then((res) => {
          setCartCount(res.data.results.length)
          console.log(res.data.results.length)
        })
      }

      fetchCart()
    } catch (error) {
      console.log(error)
    }
  }, [])

  console.log(cartCount)
  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("Context must be used within its corresponding provider")
  }
  return context
}
