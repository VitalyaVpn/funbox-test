import * as React from 'react'
import { isLatLngLiteral } from '@googlemaps/typescript-guards'
import { createCustomEqual } from 'fast-equals'
import {Status, Wrapper} from "@googlemaps/react-wrapper"
import Marker from "./Marker";
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {mapSlice} from "../store/reducers/MapSlice";
import * as process from "process";

const API_KEY = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_KEY as string: process.env.REACT_APP_API_KEY as string

interface MapProps extends google.maps.MapOptions {
    style: { [key: string]: string }
    onClick?: (e: google.maps.MapMouseEvent) => void
    onIdle?: (map: google.maps.Map) => void
    onZoomChanged?: (map: google.maps.Map) => void
    className: string
}

const render = (status: Status) => {
    return <h1>{status}</h1>
}



const MapWrapper = () => {
    const dispatch = useAppDispatch()
    const {markers, center, zoom }= useAppSelector(state => state.mapReducer)
    const {setCenter, setZoom} = mapSlice.actions

    console.log(zoom)


    const onIdle = (m: google.maps.Map) => {
        const newZoom = m.getZoom()!

        if (zoom !== newZoom){
            dispatch(setZoom(newZoom))
        }
        const newCenter = m.getCenter()!.toJSON()
        if(center.lat !== newCenter.lat && center.lng !== newCenter.lng) {
            dispatch(setCenter(newCenter))
        }
    }

    return (
        <Wrapper
            apiKey={API_KEY}
            render={render}
        >
            <Map
                className='map-container'
                center={center}
                onIdle={onIdle}
                zoom={zoom}
                style={{ flexGrow: "1", height: "100%" }}
            >
                {markers[0] && markers.map((marker) => (
                    <Marker key={marker.id} position={marker.position} title={marker.name}/>
                ))}

            </Map>
        </Wrapper>
    )
}

const Map:React.FC<MapProps> = ({
        onClick,
        onIdle,
        children,
        style,
        ...options
    }) => {

    const ref = React.useRef<HTMLDivElement>(null)
    const [map, setMap] = React.useState<google.maps.Map>()

    const {routes, markers}= useAppSelector(state => state.mapReducer)


    React.useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}))
        }
    }, [ref, map])

    useDeepCompareEffectForMaps(() => {
        if (map) {
            map.setOptions(options)
        }
    }, [map, options])
    // [END maps_react_map_component_options_hook]

    // [START maps_react_map_component_event_hooks]
    React.useEffect(() => {
        if (map) {
            ['click', 'idle', 'zoomChanged'].forEach((eventName) =>
                google.maps.event.clearListeners(map, eventName)
            )

            if (onClick) {
                map.addListener("click", onClick)
            }
            if (onIdle) {
                google.maps.event.addListener(map, 'idle', () => onIdle(map))
               // map.addListener("idle", () => onIdle(map))
            }
        }
    }, [map, onClick, onIdle]);

    React.useEffect(()=>{
        const flightPath = new google.maps.Polyline({
            path: routes,
            geodesic: false,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        })

        if(map) {
            flightPath.setMap(map)

        }
        return () => {
            flightPath.setMap(null)
        }

    }, [routes, markers, map])


    return (

        <div
            className={options.className}
        >
            <div ref={ref} style={style} />
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // set the map prop on the child component
                    return React.cloneElement(child, { map });
                }
            })}
        </div>

    )
}

// function calcRoute(directionsService: google.maps.DirectionsService, directionsRenderer: google.maps.DirectionsRenderer, route: IRoute) {
//     console.log('here')
//     const request = {
//         origin: route.origin,
//         destination: route.dest,
//         travelMode: google.maps.TravelMode.DRIVING
//     };
//     directionsService.route(request, function(result, status) {
//         if (status == "OK") {
//             directionsRenderer.setDirections(result);
//         }
//         else {
//             console.log("Directions request failed due to " + status)
//         }
//     });
// }


const deepCompareEqualsForMaps = createCustomEqual(
    (deepEqual) => (a: any, b: any) => {
        if (
            isLatLngLiteral(a) ||
            a instanceof google.maps.LatLng ||
            isLatLngLiteral(b) ||
            b instanceof google.maps.LatLng
        ) {
            return new google.maps.LatLng(a).equals(new google.maps.LatLng(b))
        }

        // TODO extend to other types

        // use fast-equals for other objects
        return deepEqual(a, b)
    }
);

function useDeepCompareMemoize(value: any) {
    const ref = React.useRef()

    if (!deepCompareEqualsForMaps(value, ref.current)) {
        ref.current = value
    }

    return ref.current
}

function useDeepCompareEffectForMaps(
    callback: React.EffectCallback,
    dependencies: any[]
) {
    React.useEffect(callback, dependencies.map(useDeepCompareMemoize))
}


export default MapWrapper