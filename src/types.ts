import * as t from 'io-ts';
import { ofType, unionize } from 'unionize';

export const JsonDecodeError = unionize({
    ValidationErrors: ofType<{ validationErrors: t.ValidationError[] }>(),
    ParsingError: ofType<{
        input: string;
        errorMessage: string;
    }>(),
});

export type JsonDecodeError = typeof JsonDecodeError._Union;
