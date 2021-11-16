// /* global ZOHO */
// /* global XLSX */

// import { unflatten } from './modules/flatten.js';
import extractData from './modules/extractData.js';

const sheetTypeDropdown = document.getElementById('sheet-type');
const chooseFileBtn = document.getElementById('chooseFile');
const importDataDiv = document.getElementById('importDataDiv');
const importDataBtn = document.getElementById('importData');

let sheetType = null;
let submittedFile = null;

sheetTypeDropdown.addEventListener('change', (event) => {
  sheetType = event.target.value;
  sheetType === ''
    ? (importDataDiv.hidden = true)
    : (importDataDiv.hidden = false);
  sheetType === ''
    ? (chooseFileBtn.disabled = true)
    : (chooseFileBtn.disabled = false);
});

chooseFileBtn.addEventListener('change', (event) => {
  [submittedFile] = event.target.files;
  submittedFile === null
    ? (importDataBtn.disabled = true)
    : (importDataBtn.disabled = false);
});

importDataBtn.addEventListener('click', async () => {
  importDataBtn.disabled = true;
  importDataBtn.innerHTML = '<i>Processing...</i>';
  await extractData(sheetType, submittedFile);
  importDataBtn.innerHTML = 'Finished!';
  setTimeout(() => {
    importDataBtn.innerHTML = 'Import Data';
  }, 3000);
});

// // FOR DEVELOPMENT ONLY

// const getRecordsBtn = document.getElementById('getRecords');
// const localExcelBtn = document.getElementById('localExcel');
// const logJSONBtn = document.getElementById('logJSON');

// let report = null;
// let localFile = null;

// getRecordsBtn.addEventListener('click', () => {
//   report = prompt('Enter the form name');

//   ZOHO.CREATOR.init().then(() => {
//     const config = {
//       reportName: `${report}_Report`,
//     };

//     ZOHO.CREATOR.API.getAllRecords(config).then((response) => {
//       console.log('Zoho Response', response.data);
//     });
//   });
// });

// localExcelBtn.addEventListener('change', (event) => {
//   [localFile] = event.target.files;
// });

// logJSONBtn.addEventListener('click', () => {
//   const excelFile = {};
//   let sheetName;
//   const fileReader = new FileReader();
//   fileReader.onload = (event) => {
//     const data = event.target.result;
//     const workbook = XLSX.read(data, {
//       type: 'binary',
//     });

//     workbook.SheetNames.forEach((sheet) => {
//       const row = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
//       excelFile[`${sheet}`] = row;
//       sheetName = sheet;
//     });

//     for (const sheet in excelFile) {
//       if (excelFile[sheet].hasOwnProperty.call(excelFile, sheet)) {
//         excelFile[sheet] = excelFile[sheet].map((record) => unflatten(record));
//       }
//     }

//     console.log(excelFile[`${sheetName}`]);
//   };
//   fileReader.readAsBinaryString(localFile);
// });
