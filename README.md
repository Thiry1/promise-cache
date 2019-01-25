with-promise-cache
====
in-memory promise cache client.

## Installation
`npm i with-promise-cache`

## Usage
```typescript
import { withPromiseCache } from "with-promise-cache";

await withPromiseCache(yourAsyncFunction)("cacheKey")(yourAsyncFunctionArgs)

```
