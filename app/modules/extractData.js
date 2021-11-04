/* global ZOHO */
/* global XLSX */

import { unflatten } from './flatten.js';
import postForm from './postForm.js';

const extractData = (sheetType, submittedFile) => {
  const excelData = {};
  const fileReader = new FileReader();
  fileReader.onload = (event) => {
    const data = event.target.result;
    const workbook = XLSX.read(data, {
      type: 'binary',
    });

    workbook.SheetNames.forEach((sheet) => {
      const row = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
      excelData[`${sheet}`] = row;
    });

    ZOHO.CREATOR.init().then(() => {
      for (const sheet in excelData) {
        if (excelData.hasOwnProperty.call(excelData, sheet)) {
          for (const row in excelData[sheet]) {
            if (excelData[sheet].hasOwnProperty.call(excelData[sheet], row)) {
              const formData = {
                data: unflatten(excelData[sheet][row]),
              };

              const asyncSwitch = async (sheetType) => {
                switch (sheetType) {
                  case 'Companies':
                    console.log(sheet, formData.data);
                    postForm(sheet, formData);
                    break;
                  default:
                    console.log('default');
                    break;
                }
              };
              asyncSwitch(sheetType);
            }
          }
        }
      }
    });
  };
  fileReader.readAsBinaryString(submittedFile);
};

export default extractData;