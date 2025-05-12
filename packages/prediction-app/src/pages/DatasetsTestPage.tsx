import React from 'react';
import PageHeader from '../features/common-features/PageHeader/PageHeader';
import DatasetsTable from '../features/datasets-table/DatasetsTable';

const DatasetsTestPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        pageTitle="Datasets Test Page"
        pageDescription="A test page displaying datasets using tanstack-query and tanstack-table"
      />
      <DatasetsTable />
    </div>
  );
};

export default DatasetsTestPage;
