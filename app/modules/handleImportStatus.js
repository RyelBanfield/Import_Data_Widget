const handleImportStatus = (status, count, response = null) => {
  const importStatusDiv = document.getElementById('importStatusDiv');
  const importStatusHeader = document.getElementById('importStatusHeader');
  const p = document.createElement('p');
  const br = document.createElement('br');

  importStatusHeader.innerHTML = `${count - 1} records processed`;

  if (status === 'success') {
    const successMessage = document.createTextNode(`Row ${count} added successfully`);
    p.appendChild(successMessage);
    importStatusDiv.appendChild(p);
    importStatusDiv.appendChild(br);
  } else if (status === 'error') {
    const errorMessage = document.createTextNode(`Error adding row ${count}: ${JSON.stringify(response)}`);
    p.appendChild(errorMessage);
    importStatusDiv.appendChild(p);
    importStatusDiv.appendChild(br);
  }
};

export default handleImportStatus;