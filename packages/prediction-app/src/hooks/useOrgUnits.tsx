import { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";

const REQUEST = {
 orgUnits : {
    resource: "organisationUnits",
    params: {
      paging : false,
      fields : ['id','displayName']
    },
  }
}

const useOrgUnits = () => {
  const [orgUnits, setOrgunits] = useState<{organisationUnits : any}>();

  const { loading, error } = useDataQuery(REQUEST, {
    onComplete: (data : any) => setOrgunits(data.orgUnits),
  });

  return {
    orgUnits,
    error,
    loading,
  };
};

export default useOrgUnits;
