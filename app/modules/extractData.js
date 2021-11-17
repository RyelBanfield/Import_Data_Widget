/* eslint-disable no-loop-func */
/* global ZOHO */
/* global XLSX */

import unflatten from './unflatten.js';
import { addRecord, getRecords, updateRecord } from './zohoAPI.js';

const extractData = (sheetType, submittedFile) => {
  const excelFile = {};
  const fileReader = new FileReader();
  const zohoData = {};
  const count = 1;

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
      getRecords(sheetType).then((response) => {
        zohoData.plansReport = response;

        console.log('zohoData.plansReport', zohoData.plansReport);
      });

      // getRecords(sheetType).then((response) => {
      //   // zohoData.plansReport = response;
      //   // console.log('response', response);

      //   // for (const row in excelFile[sheetType]) {
      //   //   if (excelFile[sheetType].hasOwnProperty.call(excelFile[sheetType], row)) {
      //   //     const formData = {
      //   //       data: unflatten(excelFile[sheetType][row]),
      //   //     };

      //   //     const asyncSwitch = async (sheetType) => {
      //   //       switch (sheetType) {
      //   //         case 'InitialDataLoad': {
      //   //           const planCodeID = zohoData.plansReport.find(
      //   //             (plan) => plan.PlanCode.display_value === formData.data.PlanCode,
      //   //           ).PlanCode.ID;
      //   //           formData.data.PlanCode = planCodeID;

      //   //           count += 1;
      //   //           await addRecord('Members', formData, count);
      //   //           break;
      //   //         }
      //   //         case 'BenSpsDepData': {
      //   //           const records = {};

      //   //           await ZOHO.CREATOR.API.getAllRecords({
      //   //             reportName: 'Members_Report',
      //   //           }).then((response) => {
      //   //             records.membersReport = response.data;
      //   //           });

      //   //           const { membersReport } = records;

      //   //           const memberID = membersReport.find(
      //   //             (member) => member.UniID === formData.data.UniID.toString(),
      //   //           ).ID;

      //   //           const { Beneficiaries, Dependants } = formData.data;

      //   //           delete formData.data.UniID;
      //   //           delete formData.data.Beneficiaries;
      //   //           delete formData.data.Dependants;

      //   //           await updateRecord('Members_Report', memberID, formData);

      //   //           formData.data = {
      //   //             Member: memberID,
      //   //             ...Beneficiaries,
      //   //           };

      //   //           count += 1;

      //   //           await addRecord('Beneficiaries', formData, count);

      //   //           if (Dependants) {
      //   //             formData.data = {
      //   //               Member: memberID,
      //   //               ...Dependants,
      //   //             };
      //   //             await addRecord('Dependants', formData, count);
      //   //           }

      //   //           break;
      //   //         }
      //   //         case 'SalaryAndRegConts': {
      //   //           const records = {};

      //   //           await ZOHO.CREATOR.API.getAllRecords({
      //   //             reportName: 'Members_Report',
      //   //           }).then((response) => {
      //   //             records.membersReport = response.data;
      //   //           });

      //   //           const { membersReport } = records;

      //   //           const memberID = membersReport.find(
      //   //             (member) => member.UniID === formData.data.UniID.toString(),
      //   //           ).ID;

      //   //           formData.data.Member = memberID;

      //   //           count += 1;

      //   //           await addRecord('SalaryAndRegConts', formData, count);
      //   //           break;
      //   //         }
      //   //         case 'AVCs': {
      //   //           const records = {};

      //   //           await ZOHO.CREATOR.API.getAllRecords({
      //   //             reportName: 'Members_Report',
      //   //           }).then((response) => {
      //   //             records.membersReport = response.data;
      //   //           });

      //   //           const { membersReport } = records;

      //   //           const memberID = membersReport.find(
      //   //             (member) => member.UniID === formData.data.UniID.toString(),
      //   //           ).ID;

      //   //           formData.data.Member = memberID;

      //   //           count += 1;

      //   //           await addRecord('AVCs', formData, count);
      //   //           break;
      //   //         }
      //   //         case 'StatusUpdate': {
      //   //           const records = {};

      //   //           await ZOHO.CREATOR.API.getAllRecords({
      //   //             reportName: 'Members_Report',
      //   //           }).then((response) => {
      //   //             records.membersReport = response.data;
      //   //           });

      //   //           const { membersReport } = records;

      //   //           const memberID = membersReport.find(
      //   //             (member) => member.UniID === formData.data.UniID.toString(),
      //   //           ).ID;

      //   //           formData.data.Member = memberID;

      //   //           count += 1;

      //   //           await addRecord('PlanHistory', formData, count);
      //   //           break;
      //   //         }
      //   //         case 'BenPd': {
      //   //           const records = {};

      //   //           await ZOHO.CREATOR.API.getAllRecords({
      //   //             reportName: 'Members_Report',
      //   //           }).then((response) => {
      //   //             records.membersReport = response.data;
      //   //           });

      //   //           const { membersReport } = records;

      //   //           const memberID = membersReport.find(
      //   //             (member) => member.UniID === formData.data.UniID.toString(),
      //   //           ).ID;

      //   //           formData.data.Member = memberID;

      //   //           count += 1;

      //   //           await addRecord('BenPd', formData, count);
      //   //           break;
      //   //         }
      //   //         case 'Pension': {
      //   //           const records = {};

      //   //           await ZOHO.CREATOR.API.getAllRecords({
      //   //             reportName: 'Members_Report',
      //   //           }).then((response) => {
      //   //             records.membersReport = response.data;
      //   //           });

      //   //           const { membersReport } = records;

      //   //           const memberID = membersReport.find(
      //   //             (member) => member.UniID === formData.data.UniID.toString(),
      //   //           ).ID;

      //   //           formData.data.Member = memberID;

      //   //           await ZOHO.CREATOR.API.getAllRecords({
      //   //             reportName: 'Plans_Report',
      //   //           }).then((response) => {
      //   //             records.plansReport = response.data;
      //   //           });

      //   //           const { plansReport } = records;

      //   //           const planCodeID = plansReport.find(
      //   //             (plan) => plan.PlanCode.display_value === formData.data.PlanCode,
      //   //           ).PlanCode.ID;

      //   //           formData.data.PlanCode = planCodeID;

      //   //           count += 1;

      //   //           await addRecord('MemberPension', formData, count);
      //   //           break;
      //   //         }
      //   //         default:
      //   //           console.log('default');
      //   //           break;
      //   //       }
      //   //     };
      //   //     asyncSwitch(sheetType);
      //   //   }
      //   // }
      // });
    });
  };
  fileReader.readAsBinaryString(submittedFile);
};

export default extractData;
