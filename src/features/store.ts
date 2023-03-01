import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector  } from 'react-redux';
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import * as Reduxlogger from 'redux-logger';
import userSlice from "./userSlice";

const logger = Reduxlogger.createLogger();

const reducers = combineReducers({
  userReducer: userSlice     
 });

 const persistConfig = {
  key: 'city_guid_store',
  storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    {serializableCheck: false}
  ).concat(logger),
})
    
export type AppDispatch = typeof store.dispatch;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
