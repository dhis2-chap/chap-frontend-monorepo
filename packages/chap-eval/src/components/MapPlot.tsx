// HighchartsMap.js
// @ts-nocheck
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
//import mapData from "/uganda_orgunits.geojson";

const HighchartsMap = ({ title }) => {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    // Function to set up the map options based on the GeoJSON data


    const setupMapOptions = (geojsonData) => {
      const mapData = Highcharts.geojson(geojsonData, "map");

      // Add value data to each feature
      let i = 0;
      mapData.forEach((feature) => {
        feature.value = i++;
      });

      // Set the Highcharts map options
      setOptions({
        chart: {
          map: geojsonData,
        },
        title: {
          text: title,
        },
        colorAxis: {
          min: 0,
          stops: [
            [0, "#EFEFFF"], // Min value color
            [0.5, "#447BB2"], // Mid value color
            [1, "#000022"], // Max value color
          ],
        },
        series: [
          {
            data: mapData,
            keys: ["name", "value"],
            joinBy: "name",
            name: "Value",
            states: {
              hover: {
                color: "#BADA55",
              },
            },
            tooltip: {
              pointFormat: "{point.name}: {point.value}",
            },
          },
        ],
      });
    };

    // Initialize map options
    fetch("/uganda_orgunits.geojson")
      .then((response) => response.json())
      .then(setupMapOptions);

  }, [title]);

  // If options are not ready, display a loading message
  if (!options) return <div>Loading map...</div>;

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={"mapChart"}
      options={options}
    />
  );
};

export default HighchartsMap;