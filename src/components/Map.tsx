import * as React from 'react'
import { isLatLngLiteral } from '@googlemaps/typescript-guards'
import { createCustomEqual } from 'fast-equals'
import {Status, Wrapper} from "@googlemaps/react-wrapper"

interface MapProps extends google.maps.MapOptions {
    style: { [key: string]: string }
    onClick?: (e: google.maps.MapMouseEvent) => void
    onIdle?: (map: google.maps.Map) => void
    className: string
}

const render = (status: Status) => {
    return <h1>{status}</h1>
}

const MapWrapper = () => {

    const [clicks, setClicks] = React.useState<google.maps.LatLng[]>([])
    const [zoom, setZoom] = React.useState(3); // initial zoom
    const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
        lat: 0,
        lng: 0,
    });

    const onClick = (e: google.maps.MapMouseEvent) => {
        // avoid directly mutating state

        setClicks([...clicks, e.latLng!])
    };

    const onIdle = (m: google.maps.Map) => {
        console.log("onIdle")
        setZoom(m.getZoom()!)
        setCenter(m.getCenter()!.toJSON())
    };

    return (
        <Wrapper
            apiKey={'AIzaSyDa4BpwnZXuiAXmnIOIJQe4kE3xtnTyW3k'}
            render={render}
        >
            <Map
                className='map-container'
                center={center}
                onClick={onClick}
                onIdle={onIdle}
                zoom={zoom}
                style={{ flexGrow: "1", height: "100%" }}
            >
                {clicks.map((latLng, i) => (
                    <Marker key={i} position={latLng} />
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
            ["click", "idle"].forEach((eventName) =>
                google.maps.event.clearListeners(map, eventName)
            );

            if (onClick) {
                map.addListener("click", onClick)
            }

            if (onIdle) {
                map.addListener("idle", () => onIdle(map))
            }
        }
    }, [map, onClick, onIdle]);

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

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
    const [marker, setMarker] = React.useState<google.maps.Marker>()
    React.useEffect(() => {
        if (!marker) {
            setMarker(new google.maps.Marker())
        }

        // remove marker from map on unmount
        return () => {
            if (marker) {
                marker.setMap(null)
            }
        };
    }, [marker])

    React.useEffect(() => {
        if (marker) {
            marker.setOptions(options)
        }
    }, [marker, options])

    return null
}

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