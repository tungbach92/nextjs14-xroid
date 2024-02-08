import {useEffect} from 'react';
import Mousetrap from 'mousetrap';

const useMouseTrap = (key, callback) => {
  useEffect(() => {
    Mousetrap.bind(key, callback);
  }, [key, callback]);
};

// params: traps = [[key, callback], [key, callback], ...]
const useMouseTraps = (traps) => {
  useEffect(() => {
    traps.forEach(([key, callback]) => {
      Mousetrap.bind(key, callback);
    });
  }, [traps]);
};

export {
  useMouseTrap,
  useMouseTraps,
};
