import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";

export default function useCart() {
    
    const initialCart = () => {
		const localStorageCart = localStorage.getItem('cart')
		return localStorageCart ? JSON.parse(localStorageCart) : [] ;
	}

	const [ data ] = useState(db);
	const [cart, setCart] = useState(initialCart);

	const Max_Items = 5; //maximo de elemento a pedir
	const Min_Items = 1; //manimo de elemento a pedir

	useEffect(() => {
		localStorage.setItem('cart', JSON.stringify(cart))
	}, [cart]);

	function addToCart(item) {
		const itemExiste = cart.findIndex((guitar) => guitar.id === item.id)

		if(itemExiste >= 0){

			if(cart[itemExiste].cantidad >= Max_Items) return ;

			const updateCart = [...cart]
			updateCart[itemExiste].cantidad++
			setCart(updateCart)

		}else{
			item.cantidad = 1;
			setCart([...cart, item])
		}
		
	}

	//funcion para quitar un elemento del carrito
	function removeFromCart(id) {
		setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
	}

	//decrementamos en uno la cantidad de cada item  del carrito
	function decreaseCantidad (id) {
		const updateCart = cart.map(item => {
			if(item.id === id && item.cantidad > Min_Items){
				return {
					...item,
					cantidad: item.cantidad - 1 //incrementamos su cantidad
				}
				
			}

			return item
		})
		setCart(updateCart);
	}

	//aumentamos en uno la cantidad de cada item  del carrito
	function increaseCantidad(id) {
		const updateCart = cart.map(item => {

			//identificamos el elemento sobre el cual dimos click
			if(item.id === id && item.cantidad < Max_Items){
				return {
					...item,
					cantidad: item.cantidad + 1 //incrementamos su cantidad
				}
				
			}

			return item //el resto de item los mantenemos sin modificarlos
		})

		setCart(updateCart);
	}

	//Vaciar carrito
	function clearCart() {
		setCart([])
	}

    //state derivado
	const isEmpty = useMemo(() => cart.length === 0, [cart]) ; //al usar useMemo solo ejecuta el primer parametro **cart.length === 0**, cuando detecte algun cambio es su segundo parametro que es cart
	const cartTotal = useMemo(() => cart.reduce( (total, item) => total + (item.cantidad * item.price), 0), [cart]) //igual que el codigo anterior total se calcula cada vez que carrito cambie


    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseCantidad,
        decreaseCantidad,
        clearCart,
        isEmpty,
        cartTotal
    }
}


