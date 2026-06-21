let isPending = false;
let curIndex = 0;

const states: Record<number, { state: any; queue: any[] }> = {};

type SetState<T> = (nextState: T | ((prevState: T) => T)) => void;

const useState = <T,>(initialState: T | (() => T)): [T, SetState<T>] => {
  const index = curIndex++;

  if (!Object.hasOwn(states, index)) {
    if (initialState instanceof Function) {
      states[index] = {
        state: initialState(),
        queue: [],
      };
    } else {
      states[index] = {
        state: initialState,
        queue: [],
      };
    }
  }

  if (states[index].queue.length > 0) {
    for (const job of states[index].queue) {
      if (job instanceof Function) {
        states[index] = {
          ...states[index],
          state: job(states[index].state),
        };
      } else {
        states[index] = {
          ...states[index],
          state: job,
        };
      }
    }

    states[index].queue = [];
  }

  const setState: SetState<T> = (nextState) => {
    states[index].queue.push(nextState);

    if (!isPending) {
      isPending = true;
      queueMicrotask(() => {
        isPending = false;
        // render();
      });
    }
  };

  return [states[index].state, setState];
};
