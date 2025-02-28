import React, { useEffect, useState } from 'react'
import { DefaultService, Feature, ModelSpec } from '@dhis2-chap/chap-lib'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import styles from './styles/selectModel.module.css'
import i18n from '@dhis2/d2-i18n'

interface SelectModelProps {
    selectedModel: ModelSpec | undefined
    setSelectedModel: (m: ModelSpec) => void
}

const offlineModel: ModelSpec = {
    name: 'Download data (CHAP is offline)',
    parameters: [],
    features: [
        {
            id: 'population',
            description: 'Select the data element for population',
            name: 'Population',
            optional: false,
        },
        {
            id: 'disease',
            description: 'Select the data element for disease cases',
            name: 'Disease cases',
            optional: false,
        },
        {
            id: 'rainfall',
            name: 'Rainfall',
            description: 'The amount of rainfall in mm',
            optional: true,
        },
        {
            id: 'mean_temperature',
            name: 'Mean Temperature',
            description: 'The average temperature in degrees Celsius',
            optional: true,
        },
    ],
}

const filterOutOptionalFeatures = (features: Feature[]): Feature[] => {
    return features.filter((d: Feature) => d.optional == false)
}

const createTargetAsFeature = (target_name: string): Feature => {
    return {
        id: target_name,
        description: '',
        optional: false,
        name: target_name.replaceAll('_', ' '),
    }
}

const SelectModelOLD = ({ selectedModel, setSelectedModel }: SelectModelProps) => {
    const [models, setModels] = useState<ModelSpec[]>([])
    const [isLoadingModels, setIsLoadingModels] = useState(true)

    const getModels = async () => {
        await DefaultService.listModelsListModelsGet()
            .then((response: ModelSpec[]) => {
                //turn target_name into a feature
                let models: ModelSpec[] = response.map((d: ModelSpec) => {
                    d.features = d.features.concat(
                        d.targets ? [createTargetAsFeature(d.targets)] : []
                    )
                    return d
                })

                setIsLoadingModels(false)
                setModels(models)
            })
            .catch((error: any) => {
                //route probarly not set up, warning should be shown
                setModels([offlineModel])
                setSelectedModel(offlineModel)
                setIsLoadingModels(false)
            })
    }

    const onChangeModel = (event: any) => {
        const selected = models?.find(
            (d: ModelSpec) => d.name === event.selected
        ) as ModelSpec
        setSelectedModel(selected)
    }

    useEffect(() => {
        getModels()
    }, [])

    return (
        <div>
            <SingleSelectField
                tabIndex="1"
                label={i18n.t('Select a model')}
                loading={isLoadingModels}
                placeholder="Select the model to use in prediction"
                onChange={onChangeModel}
                selected={selectedModel?.name}
            >
                {models?.map((d: ModelSpec) => (
                    <SingleSelectOption
                        key={d.name}
                        value={d.name}
                        label={d.name}
                    />
                ))}
            </SingleSelectField>
        </div>
    )
}

const SelectModel: React.FC<SelectModelProps> = ({ selectedModel, setSelectedModel }) => {
    const [models, setModels] = useState<ModelSpec[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showGrid, setShowGrid] = useState(true); // Control grid visibility

    const getModels = async () => {
        await DefaultService.listModelsListModelsGet()
            .then((response: ModelSpec[]) => {
                //turn target_name into a feature
                let models: ModelSpec[] = response.map((d: ModelSpec) => {
                    d.features = d.features.concat(
                        d.targets ? [createTargetAsFeature(d.targets)] : []
                    )
                    return d
                })

                setIsLoading(false)
                setModels(models)
            })
            .catch((error: any) => {
                //route probarly not set up, warning should be shown
                setModels([offlineModel])
                setSelectedModel(offlineModel)
                setIsLoading(false)
            })
    }

    const onChangeModel = (selected: ModelSpec) => {
        setSelectedModel(selected)
        setShowGrid(false); // Collapse grid after selection
    }

    useEffect(() => {
        getModels()
    }, [])

    return (
        <div className={styles.modelSelectContainer}>
            <h2 className={styles.modelSelectTitle}>Select a Prediction Model</h2>

            {isLoading ? (
                <p>Loading models...</p>
            ) : (
                <>
                    {/* Show selected model when grid is collapsed */}
                    {selectedModel && (
                        <div
                            key={selectedModel.name}
                            className={`modelCard ${selectedModel?.name === selectedModel.name ? "selected" : ""}`}
                        >
                            {/* Model Info */}
                            <h3 className={styles.modelHumanName}>{selectedModel.description}</h3>
                            <div className={styles.modelAuthor}>
                                <img src={selectedModel.logo || "/public/default-model-logo.png"} alt={selectedModel.name + " logo"} className={styles.modelAuthorLogo} />
                                <span className={styles.modelAuthorName}>
                                    {selectedModel.author}
                                </span>
                            </div>
                            <p className={styles.modelUsage}>Usage: {selectedModel.usage || "Coming soon..."}</p>

                            {/* Features */}
                            <ul className={styles.modelFeatures}>
                                {selectedModel.features.slice(0, 3).map((feature, index) => (
                                    <li key={index} className="featureItem">✔ {feature.name}</li>
                                ))}
                            </ul>

                            <a href={selectedModel.link || ""} target="_blank">View model code</a>

                            {/* Show change button only if not showing grid */}
                            {!showGrid && (
                                <button
                                    className={styles.selectButton}
                                    onClick={() => setShowGrid(true)}
                                >
                                    Change Model
                                </button>
                            )}
                        </div>
                    )}

                    {/* Show model grid when selecting */}
                    {showGrid && (
                        <div className={styles.modelGrid}>
                            {models
                            .filter((model) => model.name !== selectedModel?.name) // Exclude selected model
                            .map((model) => (
                                <div
                                    key={model.name}
                                    className={`modelCard ${selectedModel?.name === model.name ? "selected" : ""}`}
                                >
                                    {/* Model Info */}
                                    <h3 className={styles.modelHumanName}>{model.description}</h3>
                                    <div className={styles.modelAuthor}>
                                        <img src={model.logo || "/public/default-model-logo.png"} alt={model.name + " logo"} className={styles.modelAuthorLogo} />
                                        <span className={styles.modelAuthorName}>{model.author}</span>
                                    </div>
                                    <p className={styles.modelUsage}>Usage: {model.usage || "Coming soon..."}</p>

                                    {/* Features */}
                                    <ul className={styles.modelFeatures}>
                                        {model.features.slice(0, 3).map((feature, index) => (
                                            <li key={index} className="featureItem">✔ {feature.name}</li>
                                        ))}
                                    </ul>

                                    {/* Select Button */}
                                    <button
                                        className={styles.selectButton}
                                        onClick={() => onChangeModel(model)}
                                    >
                                        {selectedModel?.name === model.name ? "Selected" : "Select Model"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SelectModel
