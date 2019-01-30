with-promise-cache
====
in-memory promise cache client.

## Installation
`npm i with-promise-cache`

## Usage
```typescript
import { PromiseCache } from "with-promise-cache";
const func = new PromiseCache().with(yourAsyncFunction);
await func("cacheKey")(yourAsyncFunctionArgs)

```
