import React, { useEffect, useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";

// https://play.im.dhis2.org/dev/api/42/geoFeatures?includeGroupSets=false&ou=ou:O6uvpzGd5pu;lc3eMKXaEfw&displayProperty=NAME
const geoJsonQuery : any = {
  orgUnits: {
    resource: "geoFeatures.json",
    params: ({ orgUnits }: { orgUnits: string[] }) => ({
      ou: 'ou:' + orgUnits.join(";"),
      //fields: "id,displayName,geometry",
    }),
  },
};

interface OrganisationUnit {
    id: string; // Unique identifier of the organisation unit
    ty: number; // Type of organisation unit
    na: string; // Name
    co: string; // Encoded geometry as a string (needs to be parsed if used)
}

type OrganisationUnits = {
    orgUnits: OrganisationUnit[]
}

const OrgUnitGeoms = ({ orgUnits, setResults } : any) => {
    console.log('requesting orgunit geoms')
    console.log(orgUnits)
    // TODO: need to turn off paging...
    const { loading, error, data } = useDataQuery<OrganisationUnits>(geoJsonQuery, { variables: { orgUnits } });
  
    useEffect(() => {
      if (!loading && data?.orgUnits) {
        console.log('Loaded:')
        console.log(data)
        var result : any = {'type':'FeatureCollections', 'features': data.orgUnits.map(ou => {
            console.log(ou)
            // get geotype
            let type = 'Point'
            if (ou.ty === 2) {
                type = 'Polygon'
                if (ou.co.substring(0, 4) === '[[[[') {
                    type = 'MultiPolygon'
                }
            };
            const geom = {type, coordinates: JSON.parse(ou.co)};
            return {'type':'Feature', 'id':ou.id, 'properties':{name:ou.na}, 'geometry':geom}
            })
        };
        console.log(result)
        setResults(result); // Set the GeoJSON to a State variable
      }
    }, [data]);
  
    if (loading) console.log('Loading...');
    if (error) return console.log(`Error: ${error.message}`);
  
    return null; // Don't render anything in the UI
  };

export default OrgUnitGeoms;