/* global ZOHO */
/* global XLSX */

import { unflatten } from './flatten.js';
import postForm from './postForm.js';

const extractData = (sheetType, submittedFile) => {
  const excelFile = {};
  const fileReader = new FileReader();
  fileReader.onload = (event) => {
    const data = event.target.result;
    const workbook = XLSX.read(data, {
      type: 'binary',
    });

    workbook.SheetNames.forEach((sheet) => {
      const row = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
      excelFile[`${sheet}`] = row;
    });

    ZOHO.CREATOR.init().then(() => {
      for (const sheet in excelFile) {
        if (excelFile.hasOwnProperty.call(excelFile, sheet)) {
          for (const row in excelFile[sheet]) {
            if (excelFile[sheet].hasOwnProperty.call(excelFile[sheet], row)) {
              const formData = {
                data: unflatten(excelFile[sheet][row]),
              };

              const asyncSwitch = async (sheetType) => {
                switch (sheetType) {
                  case 'initial-data-load': {
                    const record = {};

                    await ZOHO.CREATOR.API.getAllRecords({
                      reportName: 'Plans_Report',
                    }).then((response) => {
                      record.plansReport = response.data;
                    });

                    const { plansReport } = record;

                    const planCodeID = plansReport.find(
                      (plan) => plan.PlanCode.display_value
                        === formData.data.PlanCode,
                    ).PlanCode.ID;
                    formData.data.PlanCode = planCodeID;

                    console.log(sheet, formData.data);

                    postForm('Members', formData);
                    break;
                  }
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