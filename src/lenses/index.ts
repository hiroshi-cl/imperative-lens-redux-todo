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

interface Ref<S> {
  ref: S;
}

class LensedVar<S, V> {
  constructor(public state: Ref<S>, public lens: Lens<S, V>) { }

  view() {
    return this.lens.get(this.state.ref);
  }

  set(value: V) {
    const newState = this.lens.put(this.state.ref)(value);
    return this.state.ref = newState;
  }

  over(f: (_: V) => V) {
    const newState = this.lens.put(this.state.ref)(f(this.lens.get(this.state.ref)));
    return this.state.ref = newState;
  }

  run(f: (_: V) => void) {
    const value = Object.assign({}, this.lens.get(this.state.ref));
    f(value);
    const newState = this.lens.put(this.state.ref)(value);
    return this.state.ref = newState;
  }

  ref(name: string) {
    const lens = new Lens(
      (state: V) => (state as any)[name],
      (state: V) => (value: any) => {
        const newState = Object.assign({}, state);
        (newState as any)[name] = value;
        return newState;
      }
    );
    return this.compose(lens);
  }

  compose<W>(lens: Lens<V, W>) {
    return new LensedVar(
      this.state,
      this.lens.compose(lens)
    );
  }
}

declare class Proxy {
  constructor(target: any, handler: any);
};

function handler<S, V>(lensed: LensedVar<S, V>) {
  return {
    get: (target: V, property: string, receiver: any) => {
      if (property === "$") {
        return lensed;
      }
      return new Proxy(undefined, handler(lensed.ref(property)));
    },
    set: (target: V, property: string, value: any, receiver: any) => {
      lensed.ref(property).set(value);
      return true;
    },
    apply: (target: V, thisArg: any, argumentsList: any[]) => {
      console.log("apply");
      return lensed.state.ref;
    }
  };
};

const selfLens = new Lens<any, any>(
  state => state,
  state => value => value
);

export function lensedVar<S>(obj: S): S {
  return (new Proxy(obj, handler(new LensedVar({ ref: obj }, selfLens))) as any);
}

// TODO: Lensed に root と node を作る。path を参照するクロージャを渡すと自動で lens が作られる感じで
