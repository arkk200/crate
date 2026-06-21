const stateList: { state: any }[] = [];

type SetState<T> = (nextState: T | ((prevState: T) => T)) => void;

const useState = <T,>(initialState: T | (() => T)): [T, SetState<T>] => {
  const index = stateList.length;
  if (initialState instanceof Function) {
    stateList.push({
      state: initialState(),
    });
  } else {
    stateList.push({
      state: initialState,
    });
  }

  const setState: SetState<T> = (nextState) => {
    queueMicrotask(() => {
      if (nextState instanceof Function) {
        stateList[index] = {
          ...stateList[index],
          state: nextState(stateList[index].state),
        };
      } else {
        stateList[index] = {
          ...stateList[index],
          state: nextState,
        };
      }
    });
  };

  return [stateList[index].state, setState];
};
