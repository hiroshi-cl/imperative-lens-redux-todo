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

function propertyLens<S, V>(name: string): Lens<S, V> {
  return new Lens(
    (state: S) => (state as any)[name],
    (state: S) => (value: V) => {
      const newState = Object.assign({}, state);
      (newState as any)[name] = value;
      return newState;
    }
  );
}

declare class Proxy {
  constructor(target: any, handler: any);
};

const handler = {
  get: (target: Lens<any, any>, property: string, receiver: any) => {
    if (property === "$")
      return target;
    else if (target instanceof Lens)
      return new Proxy(target.compose(propertyLens(property)), handler);
    else
      return new Proxy(propertyLens(property), handler);
  }
};

export interface Lensed<S, V> {
  view: () => V;
  set: (value: V) => S;
  over: (f: (_: V) => V) => S;
  run: (f: (_: V) => void) => S;
  lift: <W> (f: (_: V) => W) => Lensed<S, W>;
  apply: <W> (lens: Lens<V, W>) => Lensed<S, W>;
}

export class LensedVar<S> implements Lensed<S, S> {
  constructor(public state: S) { }

  view(): S {
    return this.state;
  }

  set(state: S): S {
    return this.state = state;
  }

  over(f: (_: S) => S): S {
    return this.state = f(this.state);
  }

  run(f: (_: S) => void): S {
    const state = Object.assign({}, this.state);
    f(state);
    return this.state = state;
  }

  lift<V>(f: (_: S) => V): Lensed<S, V> {
    return this.apply((f(new Proxy({}, handler) as S) as any).$ as Lens<S, V>);
  }

  apply<V>(lens: Lens<S, V>): Lensed<S, V> {
    return new LensedRef(this, lens);
  };
}

// lift とかを他のやつと融合させたい

class LensedRef<S, V> implements Lensed<S, V> {
  constructor(public root: LensedVar<S>, public lens: Lens<S, V>) { }

  view(): V {
    return this.lens.get(this.root.state);
  }

  set(value: V): S {
    const newState = this.lens.put(this.root.state)(value);
    return this.root.state = newState;
  }

  over(f: (_: V) => V): S {
    const newState = this.lens.put(this.root.state)(f(this.lens.get(this.root.state)));
    return this.root.state = newState;
  }

  run(f: (_: V) => void): S {
    const value = Object.assign({}, this.lens.get(this.root.state));
    f(value);
    const newState = this.lens.put(this.root.state)(value);
    return this.root.state = newState;
  }

  lift<W>(f: (_: V) => W): Lensed<S, W> {
    return this.apply((f(new Proxy(this.lens, handler) as V) as any).$ as Lens<V, W>);
  }

  apply<W>(lens: Lens<V, W>): Lensed<S, W> {
    return new LensedRef(this.root, this.lens.compose(lens));
  };
}