import React from 'react';

export const CartContextTemp = React.createContext();

export const CartContextTempProvider = ({ children }) => {
    const [cart, setCart] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const [totalItems, setTotalItems] = React.useState(0);

    const addToCart = (product) => {
        //clone product first
        let a = { ...product };

        a.defaultQty = a.qty;
        a.qty = 1;
        a.total = a.price * a.qty;
      
        setCart([...cart, a]);

    };

    const addToCartNew = (product) => {
         //clone product first
         let a = { ...product };

         a.defaultQty = a.qty;
         a.qty = 1;
         a.total = a.price * a.qty;
         a.isNew = true;
         setCart([...cart, a]);
    }


    const addListToCart = (products) => {
        console.log(products)
        let newCart = [];
        products.forEach((product) => {
            let a = { ...product };
            a.defaultQty = a.qty;
            a.qty = a.qty;
            a.total = a.price * a.qty;
            a.isNew = false;
            newCart.push(a);
        })
        setCart(newCart);
    };

   

    const removeFromCart = (product) => {
        const newCart = cart.filter((item) => item.id !== product.id);
        setCart(newCart);
    };

    const plusQty = (p) => {
        let product = {...p}
        const newCart = cart.map((item) => {
            if (item.id === product.id) {
                item.qty = parseInt(item.qty) + 1;
                item.total = item.price * item.qty;
            }
            return item;
        });
        setCart(newCart);
    }
    const editQty = (p, qty) => {
        let product = {...p}
        const newCart = cart
            .map((item) => {
                if (item.id === product.id) {
                    item.qty = parseInt(qty);
                    item.total = item.price * item.qty;
                }
                return item;
            })
            .filter((item) => item.qty > 0);
        setCart(newCart);
    };

    const minusQty = (p) => {
        let product = {...p}
        const newCart = cart
            .map((item) => {
                if (item.id === product.id) {
                    item.qty = parseInt(item.qty) - 1;
                    item.total = item.price * item.qty;
                }
                return item;
            })
            .filter((item) => item.qty > 0);
        setCart(newCart);
    };

    const priceEdit = (product, price) => {
        const newCart = cart
            .map((item) => {
                if (item.id === product.id) {
                    item.price = parseInt(price);
                    item.total = parseInt(item.price) * parseInt(item.qty);
                }
                return item;
            })
            .filter((item) => item.qty > 0);
        setCart(newCart);
    }

    const clearCart = () => {
        setCart([]);
    };

    const calculateTotal = () => {
        let total = 0;
        let totalItems = 0;
        cart.forEach((item) => {
            total += parseInt(item.price) * parseInt(item.qty); 
            totalItems += 1;
        });
        setTotal(total);
        setTotalItems(totalItems);
    };

    React.useEffect(() => {
        calculateTotal();
    }, [cart]);

    return (
        <CartContextTemp.Provider
            value={{
                cart,
                total,
                totalItems,
                addToCart,
                removeFromCart,
                clearCart,
                plusQty,
                minusQty,
                editQty,
                priceEdit,
                setCart,
                addListToCart,
                addToCartNew
            }}
        >
            {children}
        </CartContextTemp.Provider>
    );
}

export const useCartTemp = () => React.useContext(CartContextTemp);

export default CartContextTemp;