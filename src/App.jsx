import { useState, useEffect } from "react";
import Header from "./components/Header";
import Guitar from "./components/Guitar";
import { db } from "./data/db";

function App() {

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


	return (
		<>
			<Header
				cart={cart}
				removeFromCart={removeFromCart}
				decreaseCantidad={decreaseCantidad}
				increaseCantidad={increaseCantidad}
				clearCart={clearCart}
			/>

			<main className="container-xl mt-5">
				<h2 className="text-center">Nuestra Colección</h2>

				<div className="row mt-5">
					{data.map((guitar) => (
						<Guitar 
							key={guitar.id} 
							guitar={guitar}
							setCart={setCart}
							addToCart={addToCart}
						/>
					))}
				</div>
			</main>

			<footer className="bg-dark mt-5 py-5">
				<div className="container-xl">
					<p className="text-white text-center fs-4 mt-4 m-md-0">
						GuitarLA - Todos los derechos Reservados
					</p>
				</div>
			</footer>
		</>
	);
}

export default App;
