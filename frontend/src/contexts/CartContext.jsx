import { createContext, useState, useContext, useEffect } from "react"
import CartId from "../views/plugin/CartID"
import UserData from "../views/plugin/UserData"
import apiInstance from "../utils/axios"

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0)
  const cart_id = CartId()
  const userData = UserData()

  useEffect(() => {
    const url = userData
      ? `cart-list/${cart_id}/${userData?.user_id}/`
      : `cart-list/${cart_id}/`
    apiInstance.get(url).then((res) => {
      setCartCount(res.data.length)
    })
  }, [])

  return (
    <CartContext.Provider value={[cartCount, setCartCount]}>
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
