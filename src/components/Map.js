import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken =`${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`;

function MapContainer() {
  const mapContainerRef = useRef(null);
  const [longitude, setLongitude] = useState(-122.62495);
  const [lattitude, setLattitude] = useState(45.52118);
  const [zoom, setZoom] = useState(9);
  

  // initialze map when component mounts
  useEffect(() => {
    // if(map.current) return; //initialize map only once
      const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [longitude, lattitude],
      zoom: zoom
    });

    // add navigation control
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    //clean up on unmount
    return () => map.remove();
  }, [lattitude, longitude, zoom]); //will trip linter react-hooks/exhaustive-deps - adding lat, lng, zoom 

  return(
    <React.Fragment>
     <div ref={mapContainerRef} className="map-container" />
    </React.Fragment>
  )
}

export default MapContainer;