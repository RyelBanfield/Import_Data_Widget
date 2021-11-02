import { unflatten } from './flatten.js';
import { postForm } from './postForm.js';

export const extractData = (sheetType, submittedFile) => {
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
      for (let sheet in excelData) {
        for (let row in excelData[sheet]) {
          let formData = {
            data: unflatten(excelData[sheet][row]),
          };

          const asyncSwitch = async (sheetType) => {
            switch (sheetType) {
              case 'Companies':
                console.log(sheet, formData.data);
                postForm(sheet, formData);
                break;
            }
          };
          asyncSwitch(sheetType);
        }
      }
    });
  };
  fileReader.readAsBinaryString(submittedFile);
};
