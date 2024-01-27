import React, { useMemo } from 'react'

export const CartContext = React.createContext()

// export const CartContextProvider = ({ children }) => {
//     const [cart, setCart] = React.useState([]);
//     const [total, setTotal] = React.useState(0);
//     const [totalItems, setTotalItems] = React.useState(0);

//     const addToCart = (product) => {
//         //clone product first
//         let a = { ...product };

//         a.defaultQty = a.qty;
//         a.qty = 1;
//         a.total = a.price * a.qty;
//         setCart([...cart, a]);
//     };

//     const removeFromCart = (product) => {
//         const newCart = cart.filter((item) => item.id !== product.id);
//         setCart(newCart);
//     };

//     const plusQty = (p) => {
//         let product = {...p}
//         const newCart = cart.map((item) => {
//             if (item.id === product.id) {
//                 item.qty = parseInt(item.qty) + 1;
//                 item.total = item.price * item.qty;
//             }
//             return item;
//         });
//         setCart(newCart);
//     }
//     const editQty = (p, qty) => {
//         let product = {...p}
//         const newCart = cart
//             .map((item) => {
//                 if (item.id === product.id) {
//                     item.qty = parseInt(qty);
//                     item.total = item.price * item.qty;
//                 }
//                 return item;
//             })
//             .filter((item) => item.qty > 0);
//         setCart(newCart);
//     };

//     const minusQty = (p) => {
//         let product = {...p}
//         const newCart = cart
//             .map((item) => {
//                 if (item.id === product.id) {
//                     item.qty = parseInt(item.qty) - 1;
//                     item.total = item.price * item.qty;
//                 }
//                 return item;
//             })
//             .filter((item) => item.qty > 0);
//         setCart(newCart);
//     };

//     const priceEdit = (product, price) => {
//         const newCart = cart
//             .map((item) => {
//                 if (item.id === product.id) {
//                     item.price = parseInt(price);
//                     item.total = parseInt(item.price) * parseInt(item.qty);
//                 }
//                 return item;
//             })
//             .filter((item) => item.qty > 0);
//         setCart(newCart);
//     }

//     const clearCart = () => {
//         setCart([]);
//     };

//     const calculateTotal = () => {
//         let total = 0;
//         let totalItems = 0;
//         cart.forEach((item) => {
//             total += parseInt(item.price) * parseInt(item.qty);
//             totalItems += 1;
//         });
//         setTotal(total);
//         setTotalItems(totalItems);
//     };

//     React.useEffect(() => {
//         calculateTotal();
//     }, [cart]);

//     return (
//         <CartContext.Provider
//             value={{
//                 cart,
//                 total,
//                 totalItems,
//                 addToCart,
//                 removeFromCart,
//                 clearCart,
//                 plusQty,
//                 minusQty,
//                 editQty,
//                 priceEdit,
//                 setCart
//             }}
//         >
//             {children}
//         </CartContext.Provider>
//     );
// }

export const CartContextProvider = ({ children }) => {
  const [sales, setSales] = React.useState([[]])
  const [total, setTotal] = React.useState(0)
  const [totalItems, setTotalItems] = React.useState(0)
  const [SSI, setSSI] = React.useState(0)

  const addToCart = (product, salesIndex = 0) => {
    //clone product first
    let a = { ...product }

    a.defaultQty = a.qty
    a.qty = 1
    a.total = a.price * a.qty
    let newSales = [...sales]
    newSales[salesIndex] = [...newSales[salesIndex], a]

    setSales(newSales)
  }

  const removeFromCart = (product, salesIndex = 0) => {
    let newSales = [...sales]
    newSales[salesIndex] = newSales[salesIndex].filter((item) => item.id !== product.id)
    setSales(newSales)
  }

  const plusQty = (p, salesIndex = 0) => {
    let product = { ...p }
    let newSales = [...sales]
    newSales[salesIndex] = newSales[salesIndex].map((item) => {
      if (item.id === product.id) {
        item.qty = parseInt(item.qty) + 1
        item.total = item.price * item.qty
      }
      return item
    })
    setSales(newSales)
  }

  const editQty = (p, qty, salesIndex = 0) => {
    let product = { ...p }
    let newSales = [...sales]
    newSales[salesIndex] = newSales[salesIndex]
      .map((item) => {
        if (item.id === product.id) {
          item.qty = parseInt(qty)
          item.total = item.price * item.qty
        }
        return item
      })
      .filter((item) => item.qty > 0)
    setSales(newSales)
  }

  const minusQty = (p, salesIndex = 0) => {
    let product = { ...p }
    let newSales = [...sales]
    newSales[salesIndex] = newSales[salesIndex]
      .map((item) => {
        if (item.id === product.id) {
          item.qty = parseInt(item.qty) - 1
          item.total = item.price * item.qty
        }
        return item
      })
      .filter((item) => item.qty > 0)
    setSales(newSales)
  }

  const priceEdit = (product, price, salesIndex = 0) => {
    let newSales = [...sales]
    newSales[salesIndex] = newSales[salesIndex]
      .map((item) => {
        if (item.id === product.id) {
          item.price = parseInt(price)
          item.total = parseInt(item.price) * parseInt(item.qty)
        }
        return item
      })
      .filter((item) => item.qty > 0)
    setSales(newSales)
  }

  const clearCart = (salesIndex = 0) => {
    let newSales = [...sales]
    newSales[salesIndex] = []
    setSales(newSales)
  }

  const calculateTotal = (salesIndex = SSI) => {
    let total = 0
    let totalItems = 0
      sales[salesIndex]?.forEach((item) => {
        total += parseInt(item.price) * parseInt(item.qty)
        totalItems += 1
      })
    setTotal(total)
    setTotalItems(totalItems)
  }

//   const calculateTotal = useMemo(() => {
//     let total = 0
//     let totalItems = 0
//     sales[SSI].forEach((item) => {
//         total += parseInt(item.price) * parseInt(item.qty)
//         totalItems += 1
//         })
//     setTotal(total)
//     setTotalItems(totalItems)

//   }, [sales, SSI])

  React.useEffect(() => {
    calculateTotal()
  }, [sales , SSI])

  const cart = useMemo(() => {
    return sales[SSI]
  }, [sales, SSI])

  const setCart = (newSales, salesIndex = 0) => {
    setSales(newSales)
  }

//   return index

  const  newSales = ()=>{
    let newSales = [...sales]
    newSales.push([])
    setSales(newSales)
    setSSI(newSales.length-1)
    return newSales.length-1;
  }

  const removeSale = (index)=>{
    let newSales = [...sales]
    newSales.splice(index, 1)
    setSales(newSales)
    setSSI(0)
  }


  return (
    <CartContext.Provider
      value={{
        sales,
        total,
        totalItems,
        addToCart,
        removeFromCart,
        clearCart,
        plusQty,
        minusQty,
        editQty,
        priceEdit,
        setSales,
        setCart,
        cart,
        SSI,
        setSSI,
        newSales,
        removeSale,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => React.useContext(CartContext)

export default CartContext
