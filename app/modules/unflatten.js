const unflatten = (data) => {
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

export default unflatten;