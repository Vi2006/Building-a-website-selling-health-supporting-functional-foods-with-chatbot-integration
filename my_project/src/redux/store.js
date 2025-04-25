import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productReducer from "./Slides/productSlide";
import userReducer from "./Slides/userSlide";
import orderReducer from "./Slides/orderSlide";
import typeReducer from "./Slides/typeSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
// import { PersistGate } from 'redux-persist/integration/react'

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: [" product", "user"],
};

const rootReducer = combineReducers({
  product: productReducer,
  user: userReducer,
  order: orderReducer,
  type: typeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);

export default store;
