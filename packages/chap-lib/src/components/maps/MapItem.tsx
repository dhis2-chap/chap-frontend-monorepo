import React from 'react';
import { createContext, useState, useRef, useEffect } from "react";
import MapApi from "@dhis2/maps-gl";

export const MapContext : any = createContext(null);

const MapItem = ({ syncId, children } : any) => {
  const [map, setMap] = useState(null);
  const mapEl = useRef(null);

  useEffect(() => {
    const map = new MapApi(mapEl.current);

    map.once("ready", () => setMap(map));
    map.sync(syncId);
    map.resize();

    return () => {
      map.remove();
    };
  }, [mapEl, syncId]);

  return (
    <MapContext.Provider value={map}>
      <div
        ref={mapEl}
        style={{
          width: "300px",
          height: 300,
          margin: 10,
          border: "1px solid #555",
        }}
      >
        {map && children}
      </div>
    </MapContext.Provider>
  );
};

export default MapItem;