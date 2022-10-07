export const scoreOrder = [
  32, 41, 42, 43, 51, 52, 53, 54, 61, 62, 63, 64, 65, 11, 22, 33, 44, 55, 66,
  31, 21,
];

export const beats = (a, b) => {
  let aPos = scoreOrder.indexOf(a);
  let bPos = scoreOrder.indexOf(b);
  return aPos >= bPos;
};
