import React, { useMemo, useState } from 'react';
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    Checkbox,
    CircularLoader,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { Link } from 'react-router-dom';
import { EvaluationFormLocationState } from '../../../../pages/NewEvaluationPage/NewEvaluationPage';
import styles from './CopyBacktestModal.module.css';
import { useBacktests } from '../../../../hooks/useBacktests';

interface CopyBacktestModalProps {
    id: number;
    onClose: () => void;
}

interface CopyableAttributes {
    name: boolean;
    model: boolean;
    orgUnits: boolean;
    periods: boolean;
}

const DEFAULT_COPYABLE_ATTRIBUTES: CopyableAttributes = {
    name: true,
    model: true,
    orgUnits: true,
    // TODO: API does not return periods or period type
    periods: false,
};

export const CopyBacktestModal = ({
    id,
    onClose,
}: CopyBacktestModalProps) => {
    const [selectedAttributes, setSelectedAttributes] = useState<CopyableAttributes>(
        DEFAULT_COPYABLE_ATTRIBUTES
    );

    const { backtests, isLoading, error } = useBacktests();
    const backtest = useMemo(() => backtests?.find(backtest => backtest.id === id), [backtests, id]);

    const handleAttributeChange = (attribute: keyof CopyableAttributes) => {
        setSelectedAttributes(prev => ({
            ...prev,
            [attribute]: !prev[attribute]
        }));
    };

    const generateCopyState = (): EvaluationFormLocationState => {
        if (!backtest) return {};

        const state: EvaluationFormLocationState = {};

        if (selectedAttributes.name && backtest.name) {
            state.name = i18n.t('{{name}} (Copy)', { name: backtest.name });
        }

        if (selectedAttributes.model) {
            state.modelId = backtest.configuredModel.id.toString();
        }

        if (selectedAttributes.orgUnits && backtest.orgUnits?.length) {
            state.orgUnits = backtest.orgUnits;
        }

        return state;
    };

    const hasSelectedAttributes = Object.values(selectedAttributes).some(Boolean);

    if (isLoading) {
        return (
            <Modal onClose={onClose} dataTest="copy-backtest-modal">
                <ModalTitle>{i18n.t('Copy evaluation')}</ModalTitle>
                <ModalContent>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                        <CircularLoader />
                    </div>
                </ModalContent>
                <ModalActions>
                    <ButtonStrip>
                        <Button onClick={onClose} secondary>
                            {i18n.t('Cancel')}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
        );
    }

    if (error || !backtest) {
        return (
            <Modal onClose={onClose} dataTest="copy-backtest-modal">
                <ModalTitle>{i18n.t('Copy evaluation')}</ModalTitle>
                <ModalContent>
                    <p>{i18n.t('Failed to load evaluation data. Please try again.')}</p>
                </ModalContent>
                <ModalActions>
                    <ButtonStrip>
                        <Button onClick={onClose} secondary>
                            {i18n.t('Close')}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
        );
    }

    return (
        <Modal onClose={onClose} dataTest="copy-backtest-modal">
            <ModalTitle>{i18n.t('Copy evaluation')}</ModalTitle>
            <ModalContent>
                <p className={styles.description}>
                    {i18n.t('Select which attributes to copy to the new evaluation:')}
                </p>

                <div className={styles.attributesList}>
                    <Checkbox
                        label={i18n.t('Name')}
                        name="name"
                        checked={selectedAttributes.name}
                        onChange={() => handleAttributeChange('name')}
                        value={backtest.name || i18n.t('Untitled')}
                    />

                    <Checkbox
                        label={i18n.t('Model')}
                        name="model"
                        checked={selectedAttributes.model}
                        onChange={() => handleAttributeChange('model')}
                        value={backtest.modelId}
                    />

                    <Checkbox
                        label={i18n.t('Organisation units')}
                        name="orgUnits"
                        checked={selectedAttributes.orgUnits}
                        onChange={() => handleAttributeChange('orgUnits')}
                        disabled={!backtest.orgUnits?.length}
                    />

                    {/* <Checkbox
                        label={i18n.t('Time periods')}
                        name="periods"
                        checked={selectedAttributes.periods}
                        onChange={() => handleAttributeChange('periods')}
                        disabled={!backtest.splitPeriods?.length}
                    /> */}
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose} secondary>
                        {i18n.t('Cancel')}
                    </Button>
                    <Link
                        to="/evaluate/new"
                        state={generateCopyState()}
                        style={{ textDecoration: 'none' }}
                    >
                        <Button
                            primary
                            disabled={!hasSelectedAttributes}
                            dataTest="copy-backtest-button"
                        >
                            {i18n.t('Copy to new evaluation')}
                        </Button>
                    </Link>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}; 