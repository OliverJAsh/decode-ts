# decode-ts

TypeScript compatible value decoding.

- [io-ts] is used to perform IO validation for type safety.
- [fp-ts] is used for its `Either` type.

This is mostly a wrapper around the terrific [io-ts] to add a call to `JSON.parse`. You could achieve something similar with an io-ts type, however [there is no way to propoagate the JSON parsing errors](https://github.com/gcanti/io-ts/issues/46#issuecomment-305506173), hence the need for the wrapper.

## Installation

``` bash
yarn add decode-ts
```

## Example

``` ts
import * as t from 'io-ts';

import { jsonDecodeString, reportJsonDecodeError } from './index';

const Person = t.interface({
    id: t.string,
    age: t.number,
});

const log = (val: any) => console.log(JSON.stringify(val));

log(jsonDecodeString(Person)('foo')); // Left ParsingError
log(jsonDecodeString(Person)('{ "id": 1 }')); // Left ValidationErrors
log(jsonDecodeString(Person)('{ "id": "foo", "age": 5 }')); // Right { id: 'foo', age: 5 }

// Use the reporter for friendly error messages:

log(reportJsonDecodeError(jsonDecodeString(Person)('foo')));
// ["Unexpected token o in JSON at position 1"]
log(reportJsonDecodeError(jsonDecodeString(Person)('{ "id": 1 }')));
// ["Expecting string at id but instead got: 1.","Expecting number at age but instead got: undefined."]
```

## Development

```
yarn
yarn compile
yarn lint
```

[io-ts]: https://github.com/gcanti/io-ts
[fp-ts]: https://github.com/gcanti/fp-ts
