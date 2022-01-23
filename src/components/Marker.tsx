import * as React from 'react'

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
    const [marker, setMarker] = React.useState<google.maps.Marker>()
    const infoWindow = new google.maps.InfoWindow()

    React.useEffect(() => {
        if (!marker) {
            setMarker(new google.maps.Marker())
        }

        // remove marker from map on unmount
        return () => {
            if (marker) {
                marker.setMap(null)
            }
        }
    }, [marker, options])

    React.useEffect(()=>{
        if (marker) {
            marker.setOptions(options)
        }
    }, [marker, options])

    React.useEffect(() => {
        if (marker) {
            const title = marker.getTitle() as string
            const map = marker.getMap() as  google.maps.Map<Element>
            google.maps.event.addListener(marker, 'click', ()=>{
                infoWindow.close();
                infoWindow.setContent(title);
                infoWindow.open(map, marker);
            })
        }
        return () => {
            if (marker) {
                google.maps.event.clearInstanceListeners(marker)
            }
        }
    }, [marker])

    return null
}

export default Marker