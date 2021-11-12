export const flatten = (data) => {
  const result = {};
  const recurse = (cur, prop) => {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (let i = 0, l = cur.length; i < l; i + 1) recurse(cur[i], `${prop}[${i}]`);
      // eslint-disable-next-line no-undef
      if (l === 0) result[prop] = [];
    } else {
      let isEmpty = true;
      for (const p in cur) {
        if (cur.hasOwnProperty.call(cur, p)) {
          isEmpty = false;
          recurse(cur[p], prop ? `${prop}.${p}` : p);
        }
      }
      if (isEmpty && prop) result[prop] = {};
    }
  };
  recurse(data, '');
  return result;
};

export const unflatten = (data) => {
  if (Object(data) !== data || Array.isArray(data)) return data;
  // eslint-disable-next-line no-useless-escape
  const regex = /\.?([^.\[\]]+)|\[(\d+)\]/g;
  const resultHolder = {};
  for (const p in data) {
    if (data.hasOwnProperty.call(data, p)) {
      let cur = resultHolder;
      let prop = '';
      let m;
      // eslint-disable-next-line no-cond-assign
      while ((m = regex.exec(p))) {
        cur = cur[prop] || (cur[prop] = m[2] ? [] : {});
        prop = m[2] || m[1];
      }
      cur[prop] = data[p];
    }
  }
  return resultHolder[''] || resultHolder;
};
