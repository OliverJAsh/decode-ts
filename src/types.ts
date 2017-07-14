import * as t from 'io-ts';

export enum ErrorTypes {
    'ValidationErrors' = 'ValidationErrors',
    'ParsingError' = 'ParsingError',
}

export class ValidationErrorsError {
    // Literal type annotation required due to bug whereby literal types are
    // lost in declarations.
    // https://github.com/Microsoft/TypeScript/issues/15881
    // tslint:disable-next-line max-line-length
    readonly type: typeof ErrorTypes.ValidationErrors = ErrorTypes.ValidationErrors;

    constructor(
        public validationErrors: t.ValidationError[],
    ) {}
}

export class ParsingErrorError {
    // Literal type annotation required due to bug whereby literal types are
    // lost in declarations.
    // https://github.com/Microsoft/TypeScript/issues/15881
    readonly type: typeof ErrorTypes.ParsingError = ErrorTypes.ParsingError;

    constructor(
        public input: string,
        public errorMessage: string,
    ) {}
}

export type JsonDecodeError = ParsingErrorError | ValidationErrorsError;
