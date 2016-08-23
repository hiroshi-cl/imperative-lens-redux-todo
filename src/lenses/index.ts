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

export function lens<S, V>(get: (state: S) => V, put: (state: S) => (value: V) => S) {
  return new Lens(get, put);
}

function propertyLens<S, V>(name: string): Lens<S, V> {
  return lens(
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
  get: (target: Lensed<any, any>, property: string, receiver: any) => {
    if (property === "$")
      return target;
    else
      return new Proxy(target.apply(propertyLens(property)), handler);
  }
};

export interface Lensed<S, V> {
  $: V;
  view: () => V;
  set: (value: V) => S;
  over: (f: (_: V) => V) => S;
  run: (f: (_: V) => void) => S;
  apply: <W> (lens: Lens<V, W>) => Lensed<S, W>;
}

class LensedVar<S> implements Lensed<S, S> {
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

  $ = new Proxy(this, handler) as S

  apply<V>(lens: Lens<S, V>): Lensed<S, V> {
    return new LensedRef(this, lens);
  };
}

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

  $ = new Proxy(this, handler) as V;

  apply<W>(lens: Lens<V, W>): Lensed<S, W> {
    return new LensedRef(this.root, this.lens.compose(lens));
  };
}

export function lensed<S>(state: S) {
  return new LensedVar(state);
}

export function $<V>(path: V): Lensed<any, V> {
  return (path as any).$;
}

export function view<V>(path: V): () => V {
  return () => $(path).view();
}

export function set<V>(path: V): (value: V) => any {
  return (value: V) => $(path).set(value);
}

export function over<V>(path: V): (f: (_: V) => V) => any {
  return (f: (_: V) => V) => $(path).over(f);
}

export function run<V>(path: V): (f: (_: V) => void) => any {
  return (f: (_: V) => void) => $(path).run(f);
}
