/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserOption = {
    name: string;
    type: UserOption.type;
    description: string;
    default?: (string | null);
};
export namespace UserOption {
    export enum type {
        STRING = 'string',
        INTEGER = 'integer',
        FLOAT = 'float',
        BOOLEAN = 'boolean',
    }
}

