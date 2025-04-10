import React, { useEffect, useState } from 'react'
import { CrudService, DefaultService, Feature, FeatureTypeRead, ModelSpecRead } from '@dhis2-chap/chap-lib';
import { Button, SingleSelectField, SingleSelectOption } from '@dhis2/ui';
import styles from './SelectModel.module.css'
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
  const [isLoading, setIsLoading] = useState(true)
  const [showGrid, setShowGrid] = useState(true); // Control grid visibility

  const getModels = async () => {
    await CrudService.listModelsCrudModelsGet()

      .then((response : ModelSpecRead[]) => {
        //turn target_name into a feature
        let models : ModelSpecRead[] = response.map((d : ModelSpecRead) => {
          d.covariates = d.covariates.concat(d.target)
          return d
        })
        setIsLoading(false)
        setModels(models)

      }).catch((error : any) => {
        //route probarly not set up, warning should be shown
        setModels([offlineModel])
        setSelectedModel(offlineModel)
        setIsLoading(false)
      })
  }

  const onChangeModel = (selected: ModelSpecRead) => {
      setSelectedModel(selected)
      setShowGrid(false); // Collapse grid after selection
  }

  useEffect(() => {
    getModels()
  }, [])

  // TODO: below is a hacky fix to hardcode longer model descriptions until we add a .longName field to the db
  // so that .description can be reserved for long text
  let longDescriptionLookup = {
    naive_model: "A simple naive model only to be used for testing purposes. Assumes that...",
    chap_ewars_weekly: "Modified version of the World Health Organization (WHO) EWARS model. EWARS is a Bayesian hierarchical model implemented with the INLA library. Changes include...",
    chap_ewars_monthly: "",
    auto_regressive_weekly: "An experimental deep learning model based on an RNN architecture, focusing on predictions based on auto-regressive time series data.",
    auto_regressive_monthly: "",
  }
  longDescriptionLookup.chap_ewars_monthly = longDescriptionLookup.chap_ewars_weekly
  longDescriptionLookup.auto_regressive_monthly = longDescriptionLookup.auto_regressive_weekly
  
  
  return (
    <div className={styles.modelSelectContainer}>

        {isLoading ? (
            <p>Loading models...</p>
        ) : (
            <>
                {/* Show selected model when grid is collapsed */}
                {!showGrid && selectedModel && (
                    <div>
                        <h2 className={styles.modelSelectTitle}>Selected Model</h2>
                        <div
                            key={selectedModel.name}
                            className={styles.selectedModelDetails}
                        >

                            {/* Model Info */}
                            <h3 className={styles.modelHumanName}>{selectedModel.description}</h3>
                            <div className={styles.modelAuthor}>
                                <span>
                                    Author: 
                                </span>
                                <img src={selectedModel.authorLogoUrl || "/public/default-model-logo.png"} alt={selectedModel.name + " logo"} className={styles.modelAuthorLogo} />
                                <span className={styles.modelAuthorName}>
                                    {selectedModel.author} - {selectedModel.organization}
                                </span>
                            </div>
                            <p className={styles.modelDescription}>Description: {longDescriptionLookup[selectedModel.name] || "Coming soon..."}</p>

                            {/* Covariates */}
                            <div className={styles.modelCovariates}>
                              <span>Model inputs:</span>
                              <ul className={styles.modelCovariatesList}>
                                  {selectedModel.covariates.map((covariate, index) => (
                                      <li key={index} className={styles.modelCovariateItem}>✔ {covariate.name}</li>
                                  ))}
                              </ul>
                            </div>

                            {/* How to cite */}
                            <div className={styles.modelCitation}>
                                <span>
                                  Attribution:
                                </span>
                                <pre className={styles.modelCitationText}>
                                  {selectedModel.citationInfo || "Coming soon..."}
                                </pre>
                            </div>

                            {/* Source url */}
                            <p className={styles.modelLink}>
                                External link: <a href={selectedModel.sourceUrl || ""} target="_blank">{selectedModel.sourceUrl || "http://example.com"}</a>
                            </p>

                            {/* Contact */}
                            <p className={styles.modelEmail}>Contact email: {selectedModel.contactEmail || "Coming soon..."}</p>

                            {/* Show change button only if not showing grid */}
                            {!showGrid && (
                                <div>
                                <Button
                                    onClick={() => setShowGrid(true)}
                                    primary
                                >
                                    Change Model
                                </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Show model grid when selecting */}
                {showGrid && (
                    <div>
                        <h2 className={styles.modelSelectTitle}>Select a Prediction Model</h2>
                        <div className={styles.modelGrid}>
                            {models
                            //.filter((model) => model.name !== selectedModel?.name) // Exclude selected model
                            .map((model) => (
                                <div
                                    key={model.name}
                                    className={`${styles.modelCard} ${selectedModel?.name === model.name ? styles.selectedModelCard : ""}`}
                                >
                                    {/* Model Info */}
                                    <h3 className={styles.modelHumanName}>{model.description}</h3>
                                    <div className={styles.modelAuthor}>
                                        <img src={model.authorLogoUrl || "/public/default-model-logo.png"} alt={model.name + " logo"} className={styles.modelAuthorLogo} />
                                        <span className={styles.modelAuthorName}>{model.author} - {model.organization}</span>
                                    </div>

                                    {/* Covariates */}
                                    <ul className={styles.modelCovariatesList}>
                                        {model.covariates.map((covariate, index) => (
                                            <li key={index} className={styles.modelCovariateItem}>✔ {covariate.name}</li>
                                        ))}
                                    </ul>

                                    {/* Select Button */}
                                    <Button
                                        onClick={() => onChangeModel(model)}
                                        primary
                                    >
                                        {selectedModel?.name === model.name ? "Selected" : "Select Model"}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </>
        )}
    </div>
);
};

export default SelectModel