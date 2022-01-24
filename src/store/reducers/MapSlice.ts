import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface IMarker {
    position: google.maps.LatLngLiteral
    name: string
    id: number
}

export interface MapState {
    zoom: number
    center: google.maps.LatLngLiteral
    markers: Array<IMarker>
    routes: Array<google.maps.LatLngLiteral>
}

const initialState: MapState = {
    zoom: 4,
    center: {lat: 0, lng: 0},
    markers: [],
    routes: []
}

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setZoom(state, action: PayloadAction<number>) {
            state.zoom = action.payload
        },
        setCenter(state, action: PayloadAction<google.maps.LatLngLiteral>) {
            state.center = action.payload
        },
        addMarker(state, action: PayloadAction<IMarker>) {
            state.markers = [...state.markers, action.payload]
        },
        clearMarkers(state) {
            state.markers = []
            state.routes = []
        },
        changeMarker(state, action: PayloadAction<IMarker>) {
            state.markers = state.markers.map((marker)=>{
                if (marker.id === action.payload.id) {
                    return action.payload
                }
                return marker
            }).filter((item):item is IMarker => !!item)

            state.routes = state.markers.map((item)=>{
                if (item) {
                    return item.position
                }

            }).filter((item ): item is google.maps.LatLngLiteral  => !!item)
        },
        deleteMarker(state, action: PayloadAction<number>) {
            state.markers = state.markers.filter(marker=>
                marker.id !== action.payload
            ).map((item, index)=>{
                item.id = index
                return item
            })
            state.routes = state.markers.map((item)=>{
                if (item) {
                    return item.position
                }

            }).filter((item ): item is google.maps.LatLngLiteral  => !!item)

        },
        dragList(state, action: PayloadAction<Array<IMarker>>){
            state.markers =  state.markers.map((item, index)=>{
                return {
                    id: index,
                    name: action.payload[index].name,
                    position: {
                        ...action.payload[index].position
                    }

                }
            })
            state.routes = state.markers.map((item)=>{
                if (item) {
                    return item.position
                }
            }).filter((item ): item is google.maps.LatLngLiteral  => !!item)
        },
        setRoutes(state) {
            state.routes = state.markers.map((item)=>{
                if (item) {
                    return item.position
                }
            }).filter((item ): item is google.maps.LatLngLiteral  => !!item)
        }
    }
})

export default mapSlice.reducer