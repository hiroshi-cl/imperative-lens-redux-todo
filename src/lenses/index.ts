export default class Lens<S, V> {
  constructor(
    public get: (state: S) => V,
    public put: (state: S) => (value: V) => S
  ) { }

  view(state: S) {
    return this.get(state);
  }

  set(state: S) {
    return (value: V) => this.put(state)(value);
  }

  over(state: S) {
    return (f: (_: V) => V) => this.put(state)(f(this.get(state)));
  }

  run(state: S) {
    return (f: (_: V) => void) => {
      const value = Object.assign({}, this.get(state));
      f(value);
      return this.put(state)(value);
    }
  }

  compose<W>(lens: Lens<V, W>) {
    return new Lens(
      (state: S) => lens.get(this.get(state)),
      (state: S) => (value: W) => this.put(state)(lens.put(this.get(state))(value))
    );
  }
}