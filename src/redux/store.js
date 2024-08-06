// import {configureStore} from '@reduxjs/toolkit';
// import cartReducer from './reducer';

// export const store = configureStore({
//     reducer: cartReducer
// })


// In your Redux store setup file (store.js or similar)
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './reducer'; // Import your cart reducer

export const store = configureStore({
  reducer: {
    cart: cartReducer // Assuming you have combined cartReducer under 'cart' key
    // Add other reducers if you have them
  },
});
