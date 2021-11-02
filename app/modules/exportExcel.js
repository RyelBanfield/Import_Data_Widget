export const exportExcel = (sheetName, sheetData) => {
  const wb = XLSX.utils.book_new();
  wb.SheetNames.push(sheetName);

  const ws = XLSX.utils.json_to_sheet([sheetData]);
  wb.Sheets[sheetName] = ws;

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  saveAs(
    new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
    'test.xlsx'
  );
};
