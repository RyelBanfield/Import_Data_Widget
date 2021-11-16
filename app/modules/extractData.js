/* eslint-disable no-loop-func */
/* global ZOHO */
/* global XLSX */

import { unflatten } from './flatten.js';
import { addRecord, updateRecord } from './zohoAPI.js';

const extractData = (sheetType, submittedFile) => {
  const excelFile = {};
  const fileReader = new FileReader();
  let count = 1;
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
                  case 'InitialDataLoad': {
                    const records = {};

                    await ZOHO.CREATOR.API.getAllRecords({
                      reportName: 'Plans_Report',
                    }).then((response) => {
                      records.plansReport = response.data;
                    });

                    const { plansReport } = records;

                    const planCodeID = plansReport.find(
                      (plan) => plan.PlanCode.display_value === formData.data.PlanCode,
                    ).PlanCode.ID;
                    formData.data.PlanCode = planCodeID;

                    count += 1;

                    await addRecord('Members', formData, count);
                    const importStatusHeader = document.getElementById('importStatusHeader');
                    importStatusHeader.innerHTML = `${count - 1} records imported`;
                    break;
                  }

                  case 'BenSpsDepData': {
                    const records = {};

                    await ZOHO.CREATOR.API.getAllRecords({
                      reportName: 'Members_Report',
                    }).then((response) => {
                      records.membersReport = response.data;
                    });

                    const { membersReport } = records;

                    const memberID = membersReport.find(
                      (member) => member.UniID === formData.data.UniID.toString(),
                    ).ID;

                    const { Beneficiaries, Dependants } = formData.data;

                    delete formData.data.UniID;
                    delete formData.data.Beneficiaries;
                    delete formData.data.Dependants;

                    await updateRecord('Members_Report', memberID, formData);

                    formData.data = {
                      Member: memberID,
                      ...Beneficiaries,
                    };

                    await addRecord('Beneficiaries', formData);

                    if (Dependants) {
                      formData.data = {
                        Member: memberID,
                        ...Dependants,
                      };
                      await addRecord('Dependants', formData);
                    }

                    break;
                  }
                  case 'SalaryAndRegConts': {
                    const records = {};

                    await ZOHO.CREATOR.API.getAllRecords({
                      reportName: 'Members_Report',
                    }).then((response) => {
                      records.membersReport = response.data;
                    });

                    const { membersReport } = records;

                    const memberID = membersReport.find(
                      (member) => member.UniID === formData.data.UniID.toString(),
                    ).ID;

                    formData.data.Member = memberID;

                    await addRecord('SalaryAndRegConts', formData);
                    break;
                  }
                  case 'AVCs': {
                    const records = {};

                    await ZOHO.CREATOR.API.getAllRecords({
                      reportName: 'Members_Report',
                    }).then((response) => {
                      records.membersReport = response.data;
                    });

                    const { membersReport } = records;

                    const memberID = membersReport.find(
                      (member) => member.UniID === formData.data.UniID.toString(),
                    ).ID;

                    formData.data.Member = memberID;

                    await addRecord('AVCs', formData);
                    break;
                  }
                  case 'StatusUpdate': {
                    const records = {};

                    await ZOHO.CREATOR.API.getAllRecords({
                      reportName: 'Members_Report',
                    }).then((response) => {
                      records.membersReport = response.data;
                    });

                    const { membersReport } = records;

                    const memberID = membersReport.find(
                      (member) => member.UniID === formData.data.UniID.toString(),
                    ).ID;

                    formData.data.Member = memberID;

                    await addRecord('PlanHistory', formData);

                    break;
                  }
                  case 'BenPd': {
                    const records = {};

                    await ZOHO.CREATOR.API.getAllRecords({
                      reportName: 'Members_Report',
                    }).then((response) => {
                      records.membersReport = response.data;
                    });

                    const { membersReport } = records;

                    const memberID = membersReport.find(
                      (member) => member.UniID === formData.data.UniID.toString(),
                    ).ID;

                    formData.data.Member = memberID;

                    await addRecord('BenPd', formData);
                    break;
                  }
                  case 'Pension': {
                    const records = {};

                    await ZOHO.CREATOR.API.getAllRecords({
                      reportName: 'Members_Report',
                    }).then((response) => {
                      records.membersReport = response.data;
                    });

                    const { membersReport } = records;

                    const memberID = membersReport.find(
                      (member) => member.UniID === formData.data.UniID.toString(),
                    ).ID;

                    formData.data.Member = memberID;

                    await ZOHO.CREATOR.API.getAllRecords({
                      reportName: 'Plans_Report',
                    }).then((response) => {
                      records.plansReport = response.data;
                    });

                    const { plansReport } = records;

                    const planCodeID = plansReport.find(
                      (plan) => plan.PlanCode.display_value === formData.data.PlanCode,
                    ).PlanCode.ID;

                    formData.data.PlanCode = planCodeID;

                    await addRecord('MemberPension', formData);
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
