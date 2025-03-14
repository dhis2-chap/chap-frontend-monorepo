import { ApiError, CrudService, DefaultService } from '@dhis2-chap/chap-lib'
import React, { useEffect, useState } from 'react'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

interface DatasetsProps {
  datsets : any
}

const Datasets = () => {

  import React, { useState, useEffect } from 'react';
  import CrudService from './CrudService';
  
  const DataFetchingComponent = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const fetchData = async () => {
      setLoading(true); // Ensure loading state is true when fetching starts.
      setError(null);   // Clear previous errors when fetching starts.
      try {
        const result = await CrudService.getDatasetsCrudDatasetsGet();
        setData(result);
        setLoading(false);
      } catch (err : ApiError) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return <div>Data: {JSON.stringify(data)}</div>;
}

export default Datasets
