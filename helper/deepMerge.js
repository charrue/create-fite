const isObject = (val) => val && typeof val === "object";
const mergeArrayWithDedupe = (a, b) => Array.from(new Set([...a, ...b]));

function deepMerge(target, obj) {
  const output = target;

  Object.keys(obj).forEach((key) => {
    const oldVal = output[key];
    const newVal = obj[key];

    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      output[key] = mergeArrayWithDedupe(oldVal, newVal);
    } else if (isObject(oldVal) && isObject(newVal)) {
      output[key] = deepMerge(oldVal, newVal);
    } else {
      output[key] = newVal;
    }
  });

  return output;
}

export default deepMerge;
