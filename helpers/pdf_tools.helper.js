const puppeteer = require('puppeteer')

module.exports.createRow = (item) => `
  <tr>
    <td>${item.employee_id}</td>
    <td>${item.prefix}</td>
    <td>${item.firstname}</td>
    <td>${item.lastname}</td>
    <td>${item.institution}</td>
    <td>${item.tel}</td>
    <td>${item.date_time.getFullYear()}-${item.date_time.getMonth()+1}-${item.date_time.getDate()}</td>
  </tr>
`;

module.exports.createTable = (rows) => `
  <table>
    <tr>
      <th>Employee Id</td>
      <th>Prefix</td>
      <th>First name</td>
      <th>Last name</td>
      <th>Institution</td>
      <th>Tel</td>
      <th>Date</td>
    </tr>
    ${rows}
  </table>
`;

module.exports.createHtml = (table) => `
  <html>
    <head>
      <style>
        table {
          width: 100%;
        }
        tr {
          text-align: left;
          border: 1px solid black;
        }
        th, td {
          padding: 15px;
        }
        tr:nth-child(odd) {
          background-color: #CCC;
        }
        tr:nth-child(even) {
          background-color: #FFF;
        }
        .no-content {
          background-color: red;
        }
      </style>
    </head>
    <body>
      ${table}
    </body>
  </html>
`;

module.exports.generatePDF = async (html) => {
  let args = ["--no-sandbox", "--disable-setuid-sandbox"];
  const browser = await puppeteer.launch({
    args: args,
  });
  const page = await browser.newPage();
  await page.setContent(html, {
    waitUntil: "networkidle0",
  });
  const pdf_rs = await page.pdf({ printBackground: true });
  return pdf_rs
}

module.exports.randomName = (mimetype) => {
  const random_name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  return `${random_name}.${mimetype}`
}