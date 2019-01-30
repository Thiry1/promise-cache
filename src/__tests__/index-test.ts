import { AsyncFunction, PromiseCache } from "../index";

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
    const f = new PromiseCache().with(func);

    const promise1 = f(cacheKey)();
    const promise2 = f(cacheKey)();

    await Promise.all([promise1, promise2]);
    expect(mock).toHaveBeenCalledTimes(1);
  });
  it("When same cache key provided but cache NOT exists, return new promise.", async () => {
    const cacheKey = "cacheKey";
    const f = new PromiseCache().with(func);

    const promise1 = f(cacheKey)();
    await promise1;

    const promise2 = f(cacheKey)();
    await promise2;

    expect(mock).toHaveBeenCalledTimes(2);
  });
  it("When different cache key provided, return each different promise.", async () => {
    const f = new PromiseCache().with(func);
    const promise1 = f("foo")();
    const promise2 = f("bar")();

    await Promise.all([promise1, promise2]);

    expect(mock).toHaveBeenCalledTimes(2);
  });
});
