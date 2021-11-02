import { flatten } from './modules/flatten.js';
import { extractData } from './modules/extractData.js';
import { exportExcel } from './modules/exportExcel.js';

let sheetType = null;
let submittedFile = null;
let report = null;
let recordObject = {};

// Set the type of excel sheet being used
const sheetTypeDropdown = document.getElementById('sheet-type');
sheetTypeDropdown.addEventListener('change', (event) => {
  sheetType = event.target.value;
  sheetType === ''
    ? (chooseFileBtn.disabled = true)
    : (chooseFileBtn.disabled = false);
});

// Get the file from the input
const chooseFileBtn = document.getElementById('chooseFile');
chooseFileBtn.addEventListener('change', (event) => {
  submittedFile = event.target.files[0];
  submittedFile === null
    ? (extractDataBtn.disabled = true)
    : (extractDataBtn.disabled = false);
});

// Extract data from the file and post it to the database
const extractDataBtn = document.getElementById('extractData');
extractDataBtn.addEventListener('click', () => {
  extractData(sheetType, submittedFile);
});

// Get record and save object structure from database
const getRecordsBtn = document.getElementById('getRecords');
getRecordsBtn.addEventListener('click', () => {
  report = prompt('Enter the form name');

  ZOHO.CREATOR.init().then(() => {
    const config = {
      reportName: `${report}_Report`,
    };

    ZOHO.CREATOR.API.getAllRecords(config).then((response) => {
      console.log('Zoho Response', response.data);
      recordObject = flatten(response.data[0]);
      exportExcelBtn.disabled = false;
    });
  });
});

// Export the record to an excel file
const exportExcelBtn = document.getElementById('exportExcel');
exportExcelBtn.addEventListener('click', () => {
  exportExcel(report, recordObject);
});
