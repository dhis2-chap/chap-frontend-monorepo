import React from 'react'
import { Button } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import cn from 'classnames'
import { ModelSpecRead } from '@dhis2-chap/chap-lib'
import styles from './ModelCard.module.css'

type Props = {
    model: ModelSpecRead
    isSelected: boolean
    onSelect: (model: ModelSpecRead) => void
}

export const ModelCard = ({ model, isSelected, onSelect }: Props) => {
    return (
        <div
            className={cn(styles.modelCard, {
                [styles.selectedModelCard]: isSelected
            })}
        >
            <h3 className={styles.modelHumanName}>{model.displayName || model.name}</h3>
            <div className={styles.modelAuthor}>
                <img
                    src={model.organizationLogoUrl || "/default-model-logo.png"}
                    alt={model.name + " logo"}
                    className={styles.modelAuthorLogo}
                />
                <span className={styles.modelAuthorName}>
                    {model.author} - {model.organization}
                </span>
            </div>

            <ul className={styles.modelCovariatesList}>
                {model.covariates?.map((covariate, index) => (
                    <li key={index} className={styles.modelCovariateItem}>
                        - {covariate.name}
                    </li>
                ))}
            </ul>

            <Button
                onClick={() => onSelect(model)}
                primary
                small
            >
                {isSelected ? i18n.t("Selected") : i18n.t("Select Model")}
            </Button>
        </div>
    )
}
