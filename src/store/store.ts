import {combineReducers, configureStore} from '@reduxjs/toolkit'
import mapReducer from './reducers/MapSlice'
import storage from 'redux-persist/lib/storage'
import {persistReducer} from 'redux-persist'

const mapConfig = {
    key: 'map',
    storage,
}

export const rootReducer = combineReducers({
    mapReducer: persistReducer(mapConfig, mapReducer),
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
