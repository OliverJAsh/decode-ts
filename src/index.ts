import * as array from 'fp-ts/lib/Array';
import * as either from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import { formatValidationError } from 'io-ts-reporters';
import { ErrorTypes, JsonDecodeError, ParsingErrorError, ValidationErrorsError } from './types';

export type Either<L, A> = either.Either<L, A>;

const typecheck = <A>(a: A) => a;

type jsonParse = (jsonString: string) => Either<ParsingErrorError, any>;
const jsonParse: jsonParse = jsonString => (
    either.tryCatch(() => JSON.parse(jsonString))
        .mapLeft(error => new ParsingErrorError(jsonString, error.message))
);

export type validateType = (
    <A>(type: t.Type<A>) => (value: any) => Either<ValidationErrorsError, A>
);
export const validateType: validateType = type => value => (
    t.validate(value, type)
        .mapLeft(validationErrors => new ValidationErrorsError(validationErrors))
);

export type jsonDecodeString = (
    <A>(type: t.Type<A>) => (value: string) => Either<JsonDecodeError, A>
);
export const jsonDecodeString: jsonDecodeString = type => value => (
    // Widen Left generic
    typecheck<Either<JsonDecodeError, any>>(jsonParse(value)).chain(validateType(type))
);

export const formatJsonDecodeError = (error: JsonDecodeError): string[] => {
    if (error.type === ErrorTypes.ValidationErrors) {
        return array.catOptions(error.validationErrors.map(formatValidationError));
    } else {
        return [error.errorMessage];
    }
};

export const reportJsonDecodeError = (result: either.Either<JsonDecodeError, any>): string[] => (
    result.fold(formatJsonDecodeError, x => [])
);