import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css"
import TreeData from '../api/TreeData.geojson';
import Popup from './Popup';

mapboxgl.accessToken =`${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`;

function MapContainer() {
  const mapContainerRef = useRef(null);
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));

  const [longitude, setLongitude] = useState(-122.62495);
  const [lattitude, setLattitude] = useState(45.52118);
  const [zoom, setZoom] = useState(9);
  

  // initialze map when component mounts
  useEffect(() => {
    // if(map.current) return; //initialize map only once
      const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v11",
      center: [longitude, lattitude],
      zoom: zoom
    });

    // add navigation control
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');


    map.on('load', () => {
      // add the data source for new a feature collection with no features
      map.addSource('tree-points-data', {
        type: 'geojson',
        data: TreeData
      });

        // moved this into the on load function because of `style not done loading` error that kept map from rendering and loading first
       // now add the layer, and reference the data source above by name
       map.addLayer({
        id: 'tree-points-layer',  
        type: 'circle',
        source: 'tree-points-data',
        'paint': {
          'circle-radius': 4,
          'circle-stroke-width': 2,
          'circle-color': 'red',
          'circle-stroke-color': 'white'
        }
      });

    });

    map.on('click', event => {
      const features = map.queryRenderedFeatures(event.point, {
        layers: ["tree-points-data"],
      })
      if(features.length > 0) {
        const feature = features[0]
        const popupNode = document.createElement('div')
        ReactDOM.render(
          <Popup 
            name={feature?.properties?.Common}
            size={feature?.properties?.Size}
            edible={feature?.properties?.Edible}
          />,
          popupNode
        )
        popUpRef.current
          .setLngLat(event.lngLat)
          .setDOMContent(popupNode)
          .addTo(map)
      }
      });
     

    //   map.on('moveend', async () => {
    //     //get new center coordinates
    //     const { lng, lat } = map.getCenter();
    //     // fetch data
    //     const results = await TreeData(lng, lat);
    //     map.getSource('points-data').setData(results);
    //   });
    // });

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