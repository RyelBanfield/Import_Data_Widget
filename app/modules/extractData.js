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
              case 'Customers-Salespersons':
                console.log(sheet, formData.data);
                postForm(sheet, formData);
                break;
              case 'Sales':
                const records = {};

                await ZOHO.CREATOR.API.getAllRecords({
                  reportName: 'Customer_Report',
                }).then((response) => {
                  records['customerReport'] = response.data;
                });

                await ZOHO.CREATOR.API.getAllRecords({
                  reportName: 'Salesperson_Report',
                }).then((response) => {
                  records['salespersonReport'] = response.data;
                });

                await ZOHO.CREATOR.API.getAllRecords({
                  reportName: 'Product_Report',
                }).then((response) => {
                  records['productReport'] = response.data;
                });

                const { customerReport, salespersonReport, productReport } =
                  records;

                const customerID = customerReport.find(
                  (customer) =>
                    customer.Customer_Name.display_value ===
                    formData.data.Customer
                ).ID;
                formData.data.Customer = customerID;

                const salespersonID = salespersonReport.find(
                  (salesperson) =>
                    salesperson.Salesperson_Name.display_value ===
                    formData.data.Salesperson
                ).ID;
                formData.data.Salesperson = salespersonID;

                formData.data.Line_Items.forEach((lineItem) => {
                  const productID = productReport.find(
                    (product) =>
                      product.Product_Name.display_value === lineItem.Product
                  ).ID;
                  lineItem.Product = productID;
                });
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
