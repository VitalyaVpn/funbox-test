import * as React from 'react'
import {useAppDispatch} from "../hooks/redux";
import {mapSlice} from "../store/reducers/MapSlice";

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
    const [marker, setMarker] = React.useState<google.maps.Marker>()
    const dispatch = useAppDispatch()
    const {changeMarker} = mapSlice.actions
    const infoWindow = new google.maps.InfoWindow()

    React.useEffect(() => {
        if (!marker) {
            setMarker(new google.maps.Marker())
        }

        return () => {
            if (marker) {
                marker.setMap(null)
            }
        }
    }, [marker])

    React.useEffect(()=>{
        console.log(options)
        if (marker) {
            marker.setOptions(options)

            google.maps.event.clearInstanceListeners(marker)
            const title = options.title as string
            const map = marker.getMap() as  google.maps.Map<Element>
            google.maps.event.addListener(marker, 'click', ()=>{
                infoWindow.close();
                infoWindow.setContent(title);
                infoWindow.open(map, marker);
            })

            google.maps.event.addListener(marker, 'dragend', (e: google.maps.MapMouseEvent)=>{
                const { latLng } = e
                const lat = latLng!.lat()
                const lng = latLng!.lng()
                const title = marker.getTitle()!
                const id = parseInt(String(marker.getLabel()!)) -1

                dispatch(changeMarker(
                    {
                        name: title,
                        id,
                        position: {
                            lat,
                            lng
                        }
                    }
                ))
            })

        }
        return () => {
            if (marker) {
                google.maps.event.clearInstanceListeners(marker)
            }
        }
    }, [marker, options])

    React.useEffect(() => {
        if (marker) {
         marker.setAnimation(google.maps.Animation.DROP)
        }

    }, [marker])

    return null
}

export default Marker