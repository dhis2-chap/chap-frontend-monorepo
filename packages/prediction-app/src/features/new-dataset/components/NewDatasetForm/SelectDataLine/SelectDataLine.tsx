import { Button, IconAdd16, IconDelete16, IconDelete24, InputField, SingleSelect, SingleSelectField, SingleSelectOption, SingleSelectProps } from '@dhis2/ui'
import React from 'react'
import styles from './SelectDataLine.module.css'
import { Datalayer, DatasetLayer } from '../../../interfaces/DataSetLayer';
import { Feature } from '@dhis2-chap/chap-lib';
import { useDataQuery } from '@dhis2/app-runtime';

interface SelectDataLineProps {
  setDataLayers: (datasetLayer: DatasetLayer[]) => void;
  datasetLayers: DatasetLayer[];
  predictMode?: boolean
}


///temporarily dummy data

const features: Feature[] = [
  { name: "Rainfall", id: "rainfall", description: "Feature 1" },
  { name: "Mean temperature", id: "mean_temp", description: "Feature 2" },
  { name: "Population", id: "population", description: "Feature 3" },
  { name: "Max temperature", id: "max_temp", description: "Feature 5" },
  { name: "Disease cases", id: "disease_cases", description: "Feature 5" },
]

const chapSources: Datalayer[] = [
  { name: "ERA5-Land precipitation", featureType: "Rainfall", id: "ERA5-Land precipitation" },
  { name: "Population (WorldPop)", featureType: "Population", id: "Population (WorldPop)" },
  { name: "CRISP Mean Dailytemp", featureType: "Population", id: "CRISP Mean Dailytemp" },
  { name: "LocalMet Office precipitation", featureType: "Rainfall", id: "LocalMet Office precipitation" },
  { name: "Disease cases from hospitals", featureType: "Disease cases", id: "Disease cases from hospitals" },
]

const dataElementQuery = {
  results: {
    resource: "dataElements",
    params: {
      paging: false,
      filter: "domainType:eq:AGGREGATE",
      fields: "id,displayName",
    },
  },
};


const SelectDataLine = ({ datasetLayers, setDataLayers, predictMode }: SelectDataLineProps) => {

  const { loading, error, data } = useDataQuery(dataElementQuery);
  const dataElements: { id: string, displayName: string }[] = (data?.results as any)?.dataElements;


  const onChangeClickSelectField = (e: SingleSelectProps, type: "feature" | "origin" | "dataSource", index: number) => {
    let newDataSetLayer = [...datasetLayers]
    if (e.selected == undefined) return
    //when type is origin, simitainously wipe Data source
    if (type === "origin") {
      newDataSetLayer[index]["dataSource"] = ""
    }
    if (type === "feature") {
      newDataSetLayer[index]["dataSource"] = ""
    }

    (newDataSetLayer[index] as any)[type] = e.selected
    setDataLayers(newDataSetLayer)
  }

  const addLayer = () => {
    let newDataSetLayer = [...datasetLayers]
    newDataSetLayer.push({ feature: "", origin: "", dataSource: "" })
    setDataLayers(newDataSetLayer)
  }

  const removeLayer = (index: number) => {
    let newDataSetLayer = [...datasetLayers]
    newDataSetLayer.splice(index, 1)
    setDataLayers(newDataSetLayer)
  }

  const getNonSelectedFeatures = (index: number) => {
    let nonSelectedFeatures: Feature[] = []
    features.forEach(f => {
      let isSelected = false
      datasetLayers.forEach((dl, i) => {
        if (dl.feature == f.id && i !== index) isSelected = true
      })
      if (!isSelected) nonSelectedFeatures.push(f)
    })
    return nonSelectedFeatures
  }


  return (
    <div>
      <h3>Data layers</h3>

      <div className={styles.selectDataLineWrapper}>

        {datasetLayers.map((dl, index) => (
          <div>
            <div className={styles.dataLineWrapper}>
              {predictMode ?
                <div className={styles.predictLabel}>
                  {features.filter(f => f.id === dl.feature)[0]?.name}
                </div>
                :
                <div className={styles.selectField}>

                  <SingleSelectField label="Feature" onChange={(e) => onChangeClickSelectField(e, "feature", index)} selected={dl.feature}>
                    {getNonSelectedFeatures(index).map((f) => (
                      <SingleSelectOption label={f.name} value={f.id} />
                    ))}
                  </SingleSelectField>

                </div>
              }
              <div className={styles.selectField}>
                <SingleSelectField disabled={dl.feature === ""} label="Origin" onChange={(e) => onChangeClickSelectField(e, "origin", index)} selected={dl.origin}>
                  <SingleSelectOption label={'DateElement (DHIS2)'} value={'dataElement'} />
                  <SingleSelectOption label={'CHAP'} value={'CHAP'} />
                </SingleSelectField>
              </div>
              <div className={styles.selectField}>
                <SingleSelectField disabled={dl.origin === ""} filterable={dl.origin === "dataElement"} label="Data source" onChange={(e) => onChangeClickSelectField(e, "dataSource", index)} selected={dl.dataSource}>
                  {dl.origin == "dataElement" && dataElements.map((de) => (
                    <SingleSelectOption label={de.displayName} value={de.id} />
                  ))}
                  {dl.origin == "CHAP" && chapSources.map((de: Datalayer) => (
                    //if feature is the same type as the Feature selected
                    de.featureType === dl.feature && <SingleSelectOption label={de.name} value={de.id} />
                  ))}
                </SingleSelectField>
              </div>
              {!predictMode && <div>
                <Button onClick={() => removeLayer(index)} destructive large icon={<IconDelete24 />}></Button>
              </div>}
            </div>
          </div>
        ))}
        {!predictMode && <div className={styles.buttonRight}>
          <Button onClick={addLayer} icon={<IconAdd16 />}>Add layer</Button>
        </div>}

      </div>
    </div>
  )
}

export default SelectDataLine