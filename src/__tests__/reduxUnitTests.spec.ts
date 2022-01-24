import reducer, {IMarker, mapSlice, MapState} from '../store/reducers/MapSlice'

const {setZoom, setCenter, addMarker, clearMarkers, changeMarker, deleteMarker, dragList, setRoutes} = mapSlice.actions
const initialsState:MapState = {
    zoom: 4,
    center: {lat: 0, lng: 0},
    markers: [],
    routes: []
}
const nonEmptyState:MapState = {
    zoom: 3,
    center: {
        lat:64.18064469238604,
        lng:117.02410888742581
    },
    markers: [
        {
            id: 0,
            name: 'SomeName',
            position: {
                lat: 68.69619686831588,
                lng: 85.02929016787866,
            }
        },
        {
            id: 1,
            name: 'SomeName2',
            position: {
                lat: 51.62347312331588,
                lng: 32.023545616787866,
            }
        },

    ],
    routes: [
        {
            lat: 68.69619686831588,
            lng: 85.02929016787866,
        },
        {
            lat: 51.62347312331588,
            lng: 32.023545616787866,
        }
    ]
}
const reversMarkers: Array<IMarker> = [nonEmptyState.markers[1], nonEmptyState.markers[0]]
const marker:IMarker = {
    id: 0,
    name: 'SomeName',
    position: {
        lat: 95.69619686831588,
        lng: 123.02929016787866,
    }
}

test('should return the initial state', () => {
    expect(reducer(undefined, {type: 'INIT'})).toEqual(
        {
            ...initialsState
        }
    )
})

test('should handle a zoom being updated', () => {
    const previousState:MapState = initialsState
    expect(reducer(previousState, setZoom(3))).toEqual(
        {
            ...previousState,
            zoom: 3,
        }
    )
})

test('should handle a center being updated', () => {
    const previousState: MapState = initialsState

    expect(reducer(previousState, setCenter({lat: 12, lng: 23}))).toEqual(
        {
            ...previousState,
            center: {lat: 12, lng: 23},
        },

    )
})

test('should handle a marker being added to an empty and non empty markers array', () => {
    let previousState = initialsState
    expect(reducer(previousState, addMarker({
        id: 0,
        name: 'SomeName',
        position: {
            lat: 68.69619686831588,
            lng: 85.02929016787866,
        }
    }))).toEqual(
        {
            ...previousState,
            markers: [
                {
                    id: 0,
                    name: 'SomeName',
                    position: {
                        lat: 68.69619686831588,
                        lng: 85.02929016787866,
                    }
                }
            ],
        }
    )
    previousState = nonEmptyState

    expect(reducer(previousState, addMarker({
        id: 2,
        name: 'SomeName3',
        position: {
            lat: 54.62347312331588,
            lng: 37.023545616787866,
        }
    }))).toEqual(
        {
            ...previousState,
            markers: [
                ...previousState.markers,
                {
                    id: 2,
                    name: 'SomeName3',
                    position: {
                        lat: 54.62347312331588,
                        lng: 37.023545616787866,
                    }
                }

            ],
        }
    )
})

test('markers and routes array should being cleared', () => {
    const previousState = nonEmptyState
    expect(reducer(previousState ,clearMarkers())).toEqual({
        ...previousState,
        markers: [],
        routes: []
    })

})

test('existed marker should being should being updated', () => {
    const previousState = nonEmptyState
    expect(reducer(previousState, changeMarker(marker))).toEqual({
        ...previousState,
        markers: [
            marker,
            previousState.markers[1]

        ],
        routes: [
            marker.position,
            previousState.routes[1]
        ]
    })
})

test('existed marker and its route should being deleted by id', () => {
    const previousState = nonEmptyState
    expect(reducer(previousState, deleteMarker(0))).toEqual({
        ...previousState,
        markers: [
            {
                ...previousState.markers[1],
                id: 0
            }
        ],
        routes: [
            previousState.routes[1]
        ]
    })
})

test('marker and routes arrays should being overwritten with new arrays', () => {
    const previousState = nonEmptyState
    expect(reducer(previousState, dragList(reversMarkers))).toEqual({
        ...previousState,
        markers: reversMarkers.map((item, i)=>{
            return {
                ...item,
                id: i,
            }
        }),
        routes: [
            previousState.routes[1],
            previousState.routes[0],
        ]
    })
})

test('routes should being added from markers coordinates', () => {
    const previousState = {
        ...nonEmptyState,
        routes: [],
    }
    expect(reducer(previousState, setRoutes())).toEqual({
        ...previousState,
        routes: previousState.markers.map((item)=>{
            return item.position
        })
    })
})