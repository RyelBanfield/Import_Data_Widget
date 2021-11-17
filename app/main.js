import extractData from './modules/extractData.js';

const sheetTypeDropdown = document.getElementById('sheet-type');
const chooseFileBtn = document.getElementById('chooseFile');
const importDataDiv = document.getElementById('importDataDiv');
const importDataBtn = document.getElementById('importData');
const importStatusDiv = document.getElementById('importStatusDiv');

let sheetType = null;
let submittedFile = null;

sheetTypeDropdown.addEventListener('change', (event) => {
  sheetType = event.target.value;
  sheetType === ''
    ? (importDataDiv.hidden = true)
    : (importDataDiv.hidden = false);
});

chooseFileBtn.addEventListener('change', (event) => {
  [submittedFile] = event.target.files;
  submittedFile === null
    ? (importDataBtn.disabled = true)
    : (importDataBtn.disabled = false);
});

importDataBtn.addEventListener('click', () => {
  extractData(sheetType, submittedFile);
  importStatusDiv.hidden = false;
});
