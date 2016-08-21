export class Lens<S, V> {
  constructor(
    public get: (state: S) => V,
    public put: (state: S) => (value: V) => S
  ) { }

  compose<W>(lens: Lens<V, W>) {
    return new Lens(
      (state: S) => lens.get(this.get(state)),
      (state: S) => (value: W) => this.put(state)(lens.put(this.get(state))(value))
    );
  }
}

export class Lensed<S, V> {
  constructor(public state: S, public lens: Lens<S, V>) { }

  view() {
    return this.lens.get(this.state);
  }

  set(value: V) {
    return this.lens.put(this.state)(value);
  }

  over(f: (_: V) => V) {
    return this.lens.put(this.state)(f(this.lens.get(this.state)));
  }

  run(f: (_: V) => void) {
    const value = Object.assign({}, this.lens.get(this.state));
    f(value);
    return this.lens.put(this.state)(value);
  }
}