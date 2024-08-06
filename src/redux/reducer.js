import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    carts: []
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.carts.find(cart => cart.id === newItem.id);

            if (existingItem) {
                // If item exists, update its quantity
                existingItem.quantity = (existingItem.quantity || 1) + newItem.quantity;
            } else {
                // If item does not exist, add it to the cart
                state.carts.push(newItem);
            }

            // Ensure to save the updated carts to localStorage
            localStorage.setItem("carts", JSON.stringify(state.carts));
            console.log(state.carts)
        },
        increaseQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const cartItem = state.carts.find(cart => cart.id === id);

            if (cartItem) {
                cartItem.quantity = quantity;
                localStorage.setItem("carts", JSON.stringify(state.carts));
            }
        },
        reduceItem: (state, action) => {
            state.carts = state.carts.filter((cart) => cart.id !== action.payload);
            localStorage.setItem("carts", JSON.stringify(state.carts));
        }
    }
})

export const { addItem, reduceItem, increaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;
