export const flatten = (data) => {
  const result = {};
  const recurse = (cur, prop) => {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (let i = 0, l = cur.length; i < l; i += 1) recurse(cur[i], `${prop}[${i}]`);
      if (l === 0) result[prop] = [];
    } else {
      let isEmpty = true;
      for (const p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? `${prop}.${p}` : p);
      }
      if (isEmpty && prop) result[prop] = {};
    }
  };
  recurse(data, '');
  return result;
};

export const unflatten = (data) => {
  if (Object(data) !== data || Array.isArray(data)) return data;
  const regex = /\.?([^.\[\]]+)|\[(\d+)\]/g;
  const resultHolder = {};
  for (const p in data) {
    let cur = resultHolder;
    let prop = '';
    let m;
    while ((m = regex.exec(p))) {
      cur = cur[prop] || (cur[prop] = m[2] ? [] : {});
      prop = m[2] || m[1];
    }
    cur[prop] = data[p];
  }
  return resultHolder[''] || resultHolder;
};
