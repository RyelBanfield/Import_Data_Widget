export const postForm = async (sheet, formData) => {
  const config = {
    formName: sheet,
    data: formData,
  };

  ZOHO.CREATOR.API.addRecord(config).then((response) => {
    if (response.code == 3000) {
      console.log('Record added successfully');
    } else {
      console.log(response);
    }
  });
};
