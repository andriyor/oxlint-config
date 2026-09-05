export function dbg(flag: boolean) {
  if (flag) debugger;
}

var dup = 1;
var dup = 2;
export { dup };

export const spread = (it: Iterable<number>) => Array.from(it);

export function fireAndForget() {
  Promise.resolve(1);
}
