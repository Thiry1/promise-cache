export type AsyncFunction = (args: any) => Promise<any>;
export type ArgumentType<F extends AsyncFunction> = F extends (
  args: infer T
) => Promise<any>
  ? T
  : never;

export type ReturnType<F extends AsyncFunction> = F extends (
  args: any
) => Promise<infer T>
  ? T
  : never;

/**
 * data store
 */
const store: { [key: string]: Promise<any> } = {};

/**
 * cache promise.
 * @param asyncFunction
 * @return (cacheKey: string) => (args?: ArgumentType<F>) => Promise<ReturnType<F>>
 */
export const withPromiseCache = <F extends AsyncFunction>(asyncFunction: F) => {
  return (cacheKey: string) => {
    return async (args?: ArgumentType<F>): Promise<ReturnType<F>> => {
      if (store[cacheKey]) {
        return store[cacheKey];
      } else {
        const promise = asyncFunction(args)
          .then(
            (result: ReturnType<F>): Promise<ReturnType<F>> => {
              delete store[cacheKey];
              return result;
            }
          )
          .catch((error: any) => {
            delete store[cacheKey];
            throw error;
          });
        // add to store.
        store[cacheKey] = promise;

        return promise;
      }
    };
  };
};
