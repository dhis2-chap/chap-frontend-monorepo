/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { DockerEnvConfig } from './DockerEnvConfig';
import type { EntryPointConfig } from './EntryPointConfig';
import type { ModelInfo } from './ModelInfo';
import type { UserOption } from './UserOption';
export type ModelTemplateConfig = {
    name: string;
    entry_points: EntryPointConfig;
    docker_env?: (DockerEnvConfig | null);
    python_env?: (string | null);
    required_fields?: Array<string>;
    allow_free_additional_continuous_covariates?: boolean;
    adapters?: (Record<string, string> | null);
    user_options?: Array<UserOption>;
    model_info?: (ModelInfo | null);
};

