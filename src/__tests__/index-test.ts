import { AsyncFunction, withPromiseCache } from "../index";

describe("promise-cache", () => {
  let mock = jest.fn();
  let func: AsyncFunction;
  beforeEach(() => {
    mock = jest.fn();
    func = async () => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(mock());
        }, 200);
      });
    };
  });

  it("When same cache key provided and cache exists, return cached promise.", async () => {
    const cacheKey = "cacheKey";

    const promise1 = withPromiseCache(func)(cacheKey)();
    const promise2 = withPromiseCache(func)(cacheKey)();

    await Promise.all([promise1, promise2]);
    expect(promise1 === promise2).toBe(true);
    expect(mock).toHaveBeenCalledTimes(1);
  });
  it("When same cache key provided but cache NOT exists, return new promise.", async () => {
    const cacheKey = "cacheKey";

    const promise1 = withPromiseCache(func)(cacheKey)();
    await promise1;

    const promise2 = withPromiseCache(func)(cacheKey)();
    await promise2;

    expect(promise1 !== promise2).toBe(true);
    expect(mock).toHaveBeenCalledTimes(2);
  });
  it("When different cache key provided, return each different promise.", async () => {
    const promise1 = withPromiseCache(func)("foo")();
    const promise2 = withPromiseCache(func)("bar")();

    await Promise.all([promise1, promise2]);
    expect(promise1 !== promise2).toBe(true);
    expect(mock).toHaveBeenCalledTimes(2);
  });
});
