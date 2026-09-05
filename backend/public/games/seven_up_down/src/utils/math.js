export function getRandomDiceRoll() {
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  return { d1, d2, total: d1 + d2 };
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
