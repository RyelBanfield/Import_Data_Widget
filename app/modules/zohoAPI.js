/* global ZOHO */

export const addRecord = async (formName, data, count) => {
  const importStatusDiv = document.getElementById('importStatusDiv');

  const config = {
    formName,
    data,
  };

  ZOHO.CREATOR.API.addRecord(config).then((response) => {
    if (response.code === 3000) {
      console.log('Record added successfully');
      const newDiv = document.createElement('div');
      const newContent = document.createTextNode(`Row ${count} added successfully`);
      newDiv.appendChild(newContent);
      importStatusDiv.appendChild(newDiv);
    } else {
      console.error(response);
      const newDiv = document.createElement('div');
      const errorMessage = document.createTextNode(`Error adding row ${count}: ${JSON.stringify(response.error)}`);
      newDiv.appendChild(errorMessage);
      importStatusDiv.appendChild(newDiv);
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
