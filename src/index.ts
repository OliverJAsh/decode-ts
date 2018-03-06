import * as array from 'fp-ts/lib/Array';
import * as either from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import { formatValidationError } from 'io-ts-reporters';

import { JsonDecodeError } from './types';

export type Either<L, A> = either.Either<L, A>;

const typecheck = <A>(a: A) => a;

type jsonParse = (jsonString: string) => Either<JsonDecodeError, {}>;
const jsonParse: jsonParse = jsonString => (
    either.tryCatch(() => JSON.parse(jsonString))
        .mapLeft(error => JsonDecodeError.ParsingError({ input: jsonString, errorMessage: error.message }))
);

export type validateType = (
    <A, O>(type: t.Type<A, O>) => (value: {}) => Either<JsonDecodeError, A>
);
export const validateType: validateType = type => value => (
    type.decode(value)
        .mapLeft(validationErrors => JsonDecodeError.ValidationErrors({ validationErrors }))
);

export type jsonDecodeString = (
    <A, O>(type: t.Type<A, O>) => (value: string) => Either<JsonDecodeError, A>
);
export const jsonDecodeString: jsonDecodeString = type => value => (
    // Widen Left generic
    typecheck<Either<JsonDecodeError, {}>>(jsonParse(value)).chain(validateType(type))
);

export const formatJsonDecodeError = (error: JsonDecodeError): string[] => {
    if (JsonDecodeError.is.ValidationErrors(error)) {
        return array.catOptions(error.validationErrors.map(formatValidationError));
    } else {
        return [error.errorMessage];
    }
};

export const reportJsonDecodeError = (result: either.Either<JsonDecodeError, {}>): string[] => (
    result.fold(formatJsonDecodeError, () => [])
);

export * from './types';