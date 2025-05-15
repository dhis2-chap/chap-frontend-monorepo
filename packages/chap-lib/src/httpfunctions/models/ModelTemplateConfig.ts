/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { DockerEnvConfig } from './DockerEnvConfig';
import type { EntryPointConfig } from './EntryPointConfig';
import type { ModelInfo } from './ModelInfo';
/**
 * TODO: Try to find a better name that is not confusing
 * This is all the information that is listed in mlproject file for a model template
 */
export type ModelTemplateConfig = {
    entry_points: EntryPointConfig;
    docker_env?: (DockerEnvConfig | null);
    python_env?: (string | null);
    name: string;
    required_covariates?: Array<string>;
    allow_free_additional_continuous_covariates?: boolean;
    user_options?: Record<string, any>;
    model_info?: (ModelInfo | null);
    adapters?: (Record<string, string> | null);
};

