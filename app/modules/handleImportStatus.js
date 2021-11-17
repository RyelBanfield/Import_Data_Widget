const handleImportStatus = (status, count, response = null) => {
  const importStatusDiv = document.getElementById('importStatusDiv');
  const importStatusHeader = document.getElementById('importStatusHeader');
  const p = document.createElement('p');
  const br = document.createElement('br');

  importStatusHeader.innerHTML = `${count} records processed`;

  if (status === 'success') {
    const successMessage = document.createTextNode(`Row ${count + 1} added successfully`);
    p.appendChild(successMessage);
  } else if (status === 'error') {
    const errorMessage = document.createTextNode(`Error adding row ${count + 1}: ${JSON.stringify(response)}`);
    p.appendChild(errorMessage);
  }

  importStatusDiv.appendChild(p);
  importStatusDiv.appendChild(br);
};

export default handleImportStatus;