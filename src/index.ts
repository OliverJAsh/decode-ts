import * as array from 'fp-ts/lib/Array';
import * as either from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as t from 'io-ts';
import { formatValidationError } from 'io-ts-reporters';

import { JsonDecodeError } from './types';

export type Either<L, A> = either.Either<L, A>;

const typecheck = <A>(a: A) => a;

type jsonParse = (jsonString: string) => Either<JsonDecodeError, {}>;
const jsonParse: jsonParse = jsonString => (
    pipe(
        either.tryCatch(() => JSON.parse(jsonString), err => err as Error),
        either.mapLeft(error => JsonDecodeError.ParsingError({ input: jsonString, errorMessage: error.message }))
    )
);

export type validateType = (
    <A, O>(type: t.Type<A, O>) => (value: {}) => Either<JsonDecodeError, A>
);
export const validateType: validateType = type => value => (
    pipe(
        type.decode(value),
        either.mapLeft(validationErrors => JsonDecodeError.ValidationErrors({ validationErrors }))
    )
);

export type jsonDecodeString = (
    <A, O>(type: t.Type<A, O>) => (value: string) => Either<JsonDecodeError, A>
);
export const jsonDecodeString: jsonDecodeString = type => value => (
    // Widen Left generic
    pipe(typecheck<Either<JsonDecodeError, {}>>(jsonParse(value)), either.chain(validateType(type)))
);

export const formatJsonDecodeError = (error: JsonDecodeError): string[] => {
    if (JsonDecodeError.is.ValidationErrors(error)) {
        return array.compact(error.validationErrors.map(formatValidationError));
    } else {
        return [error.errorMessage];
    }
};

export const reportJsonDecodeError = (result: either.Either<JsonDecodeError, {}>): string[] => (
    pipe(result, either.fold(formatJsonDecodeError, () => []))
);

export * from './types';