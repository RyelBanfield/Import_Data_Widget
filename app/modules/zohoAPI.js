/* global ZOHO */

export const addRecord = (formName, data, count) => {
  const importStatusDiv = document.getElementById('importStatusDiv');
  const importStatusHeader = document.getElementById('importStatusHeader');
  const newDiv = document.createElement('div');

  const config = {
    formName,
    data,
  };

  ZOHO.CREATOR.API.addRecord(config).then((response) => {
    if (response.code === 3000) {
      console.log('Record added successfully');
      importStatusHeader.innerHTML = `${count - 1} records processed`;
      const successMessage = document.createTextNode(`Row ${count} added successfully`);
      const br = document.createElement('br');
      newDiv.appendChild(successMessage);
      importStatusDiv.appendChild(newDiv);
      importStatusDiv.appendChild(br);
    } else {
      console.error(response);
      importStatusHeader.innerHTML = `${count - 1} records processed`;
      const errorMessage = document.createTextNode(`Error adding row ${count}: ${JSON.stringify(response.error)}`);
      const br = document.createElement('br');
      newDiv.appendChild(errorMessage);
      importStatusDiv.appendChild(newDiv);
      importStatusDiv.appendChild(br);
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
