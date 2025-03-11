import { Button, IconAdd16, IconDelete16, IconDelete24, InputField, SingleSelect, SingleSelectField, SingleSelectOption, SingleSelectProps } from '@dhis2/ui'
import React from 'react'
import styles from './SelectDataLine.module.css'
import { Datalayer, DatasetLayer } from '../../../interfaces/DataSetLayer';
import { Feature } from '@dhis2-chap/chap-lib';
import { useDataQuery } from '@dhis2/app-runtime';
import SearchSelectField from '../../../../../components/prediction/SearchSelectField';

interface SelectDataLineProps {
  setDataLayers: (datasetLayer: DatasetLayer[]) => void;
  datasetLayers: DatasetLayer[];
  predictMode?: boolean
}


///temporarily dummy data

const features: Feature[] = [
  { name: "Rainfall", id: "rainfall", description: "Feature 1" },
  { name: "Mean temperature", id: "mean_temperature", description: "Feature 2" },
  { name: "Population", id: "population", description: "Feature 3" },
  { name: "Max temperature", id: "max_temp", description: "Feature 5" },
  { name: "Disease cases", id: "disease_cases", description: "Feature 5" },
]

const chapSources: Datalayer[] = [
  { name: "ERA5-Land precipitation", featureType: "rainfall", id: "GLOBAL/ERA5-Land/total-precipitation" },
  { name: "ERA5-Land Temperature Mean", featureType: "mean_temperature", id: "GLOBAL/ERA5-Land/mean-temperature" },
  { name: "Population (WorldPop)", featureType: "population", id: "GLOBAL/Worldpop/total-population" },
  { name: "CHIRPS Mean Dailytemp", featureType: "rainfall", id: "GLOBAL/CHIRPS/total-precipitation" },
  { name: "IRI Total Precipitation", featureType: "population", id: "GLOBLA/IRI/total-precipitation" },
  { name: "Disease cases from hospitals", featureType: "disease_cases", id: "LOCAL/HMIS/malaria-cases" },
]


const SelectDataLine = ({ datasetLayers, setDataLayers, predictMode }: SelectDataLineProps) => {


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

  //temp create e method, converting search field output to match format used in this file
  const onChangeSearchSelectField = (dataItemId: string, index : number) => {
    //find index

    const selected = { selected: dataItemId }
    
    onChangeClickSelectField(selected, "dataSource", index)
  }


  return (
    <div>
      <h3>Data layers</h3>

      <div className={styles.selectDataLineWrapper}>

        {datasetLayers.map((dataLayer, index) => (
          <div>
            <div className={styles.dataLineWrapper}>
              {predictMode ?
                <div className={styles.predictLabel}>
                  {features.filter(f => f.id === dataLayer.feature)[0]?.name}
                </div>
                :
                <div className={styles.selectField}>
                  <SingleSelectField label="Feature" onChange={(e) => onChangeClickSelectField(e, "feature", index)} selected={dataLayer.feature}>
                    {getNonSelectedFeatures(index).map((f) => (
                      <SingleSelectOption label={f.name} value={f.id} />
                    ))}
                  </SingleSelectField>
                </div>
              }
              <div className={styles.selectField}>
                <SingleSelectField disabled={dataLayer.feature === ""} label="Origin" onChange={(e) => onChangeClickSelectField(e, "origin", index)} selected={dataLayer.origin}>
                  <SingleSelectOption label={'Data from DHIS2'} value={'dataItem'} />
                  <SingleSelectOption label={'Data from CHAP'} value={'CHAP'} />
                </SingleSelectField>
              </div>
              <div className={styles.selectField}>
                {(dataLayer.origin === "CHAP" || dataLayer.origin === "") && 
                  <SingleSelectField disabled={dataLayer.origin === ""} label="Data name source" onChange={(e) => onChangeClickSelectField(e, "dataSource", index)} selected={dataLayer.dataSource}>
                    {chapSources.map((de: Datalayer) => (
                      //if feature is the same type as the Feature selected
                      de.featureType === dataLayer.feature && <SingleSelectOption label={de.name} value={de.id} />
                    ))}
                  </SingleSelectField>
                } 
                { dataLayer.origin === "dataItem" && <SearchSelectField
                            feature={{
                                name: features.filter(
                                    (f) => f.id === dataLayer.feature
                                )[0].name,
                                id: dataLayer.feature,
                                description: "",
                            }}
                            onChangeSearchSelectField={
                               (e, dataItemId) => onChangeSearchSelectField(dataItemId, index)
                            }
                        />
                  }
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