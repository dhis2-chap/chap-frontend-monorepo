import { useQuery } from '@tanstack/react-query';
import { CrudService, DataSetRead } from '@dhis2-chap/chap-lib';

export const useDatasets = () => {
  return useQuery<DataSetRead[]>({
    queryKey: ['datasets'],
    queryFn: CrudService.getDatasetsCrudDatasetsGet,
  });
};
