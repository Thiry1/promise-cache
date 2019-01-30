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
export class PromiseCache {
  /**
   * data store
   */
  private store: { [key: string]: Promise<any> } = {};
  /**
   * set function.
   * @param asyncFunction
   * @return (cacheKey: string) => (args?: ArgumentType<F>) => Promise<ReturnType<F>>
   */
  public with = <F extends AsyncFunction>(asyncFunction: F) => {
    return (cacheKey: string) => {
      return async (args?: ArgumentType<F>): Promise<ReturnType<F>> => {
        if (this.store[cacheKey]) {
          return this.store[cacheKey];
        } else {
          const promise = asyncFunction(args)
            .then(
              (result: ReturnType<F>): Promise<ReturnType<F>> => {
                delete this.store[cacheKey];
                return result;
              }
            )
            .catch((error: any) => {
              delete this.store[cacheKey];
              throw error;
            });
          // add to store.
          this.store[cacheKey] = promise;

          return promise;
        }
      };
    };
  };
}
