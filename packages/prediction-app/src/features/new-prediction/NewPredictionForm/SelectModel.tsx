import React, { useEffect, useState } from 'react'
import { CrudService, DefaultService, Feature, FeatureTypeRead, ModelSpecRead } from '@dhis2-chap/chap-lib';
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui';
import i18n from "@dhis2/d2-i18n";

interface SelectModelProps {
  selectedModel : ModelSpecRead | undefined
  setSelectedModel : (m : ModelSpecRead | undefined) => void
}

const offlineModel : ModelSpecRead = {
  name: "Download data (CHAP is offline)",
  id: 0,
  description: "Download data from the CHAP API",
  covariates: [],
  target: {
    name: "target",
    description: "target",
    displayName: ''
  }
}


const SelectModel = ({selectedModel, setSelectedModel} : SelectModelProps) => {

  const [models, setModels] = useState<ModelSpecRead[]>([])
  const [isLoadingModels, setIsLoadingModels] = useState(true)
  
    
  const getModels = async () => {
    await CrudService.listModelsCrudModelsGet()
      .then((response : ModelSpecRead[]) => {

        //turn target_name into a feature
        let models : ModelSpecRead[] = response.map((d : ModelSpecRead) => {
          d.covariates = d.covariates.concat(d.target)
          return d
        })


        setIsLoadingModels(false)
        setModels(models)
      }).catch((error : any) => {
        //route probarly not set up, warning should be shown
        setModels([offlineModel])
        setSelectedModel(offlineModel)
        setIsLoadingModels(false)
      })
  }

  const onChangeModel = (event : any) => {
    const selcted = models?.find((d : ModelSpecRead) => d.name === event.selected) as ModelSpecRead
    setSelectedModel(selcted)
  }

  useEffect(() => {
    getModels()
  }, [])
  
  
  return (
    <div>
      <SingleSelectField label={i18n.t('Select a model')} loading={isLoadingModels} placeholder='Select the model to use in prediction' onChange={onChangeModel} selected={selectedModel?.name}>
        {models?.map((d : ModelSpecRead) => (
          <SingleSelectOption key={d.name} value={d.name} label={d.name}  />
        ))}
      </SingleSelectField>
    </div>
  )
}

export default SelectModel