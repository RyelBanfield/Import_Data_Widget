/* global ZOHO */

import handleImportStatus from './handleImportStatus.js';

export const getRecords = async (sheetType) => {
  switch (sheetType) {
    case 'InitialDataLoad': {
      let plansReport;

      await ZOHO.CREATOR.API.getAllRecords({
        reportName: 'Plans_Report',
      }).then((response) => {
        plansReport = response.data;
      });

      return plansReport;
    }
    default: {
      console.log('default');
      return {};
    }
  }
};

export const addRecord = (formName, data, count) => {
  const config = {
    formName,
    data,
  };

  ZOHO.CREATOR.API.addRecord(config).then((response) => {
    if (response.code === 3000) {
      console.log('Record added successfully');
      handleImportStatus('success', count);
    } else {
      console.error(response);
      handleImportStatus('error', count, response.error);
    }
  });
};

export const updateRecord = async (reportName, id, data) => {
  const config = {
    reportName,
    id,
    data,
  };

  ZOHO.CREATOR.API.updateRecord(config).then((response) => {
    if (response.code === 3000) {
      console.log('Record updated successfully');
    } else {
      console.error(response);
    }
  });
};
