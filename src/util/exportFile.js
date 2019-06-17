import XLSX from "xlsx";

const dataListToCsvString = function (columns = {}, fileData = []) {
  let temp = [];
  const tableHeader = Object.keys(columns);
  const tableColumns = tableHeader.map(key => columns[key]);
  temp.push(tableHeader.join(","));
  fileData.forEach(row => {
    temp.push(tableColumns.map(k => row[k]).join(","));
  });
  return temp.join("\n");
};

const createWorkSheet = function (columns = {}, fileData = []) {
  const header = Object.keys(columns);
  const tableHeader = header.map(k => columns[k]);
  const tableHeaderObject = {};
  header.forEach(key => {
    tableHeaderObject[columns[key]] = key;
  });

  return XLSX.utils.json_to_sheet([
    tableHeaderObject, ...fileData.map(row => {
      const temp = {};
      tableHeader.forEach(k => {
        temp[k] = row[k];
      });
      return temp;
    })
  ], {header: tableHeader, skipHeader: true});
};

const createWorkSheets = function (columns = {}, fileData = [], gap = 10000) {
  const count = Math.ceil(fileData.length / gap);
  const sheets = [];
  for (let i = 0; i < count; i++) {
    sheets.push(createWorkSheet(columns, fileData.slice(i * gap, (i + 1) * gap)));
  }
  return sheets;
};

export const exportXlsx = function (columns, fileData, fileName, gap) {
  const sheetList = createWorkSheets(columns, fileData, gap);
  const sheetNames = [];
  const sheets = {};

  sheetList.forEach((r, i) => {
    const s = "列表" + (i + 1);
    sheetNames.push(s);
    sheets[s] = r;
  });

  XLSX.writeFile({
    SheetNames: sheetNames,
    Sheets: sheets
  }, fileName + ".xlsx");
};

export const exportCsv = function (columns, fileData, fileName) {
  exportFile(dataListToCsvString(columns, fileData), fileName + ".csv");
};

export const exportFile = function (fileData, fileName = "新建文件") {
  const urlObject = window.URL || window.webkitURL || window;
  const saveLink = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
  saveLink.href =  urlObject.createObjectURL(new Blob([fileData]));
  saveLink.download = fileName;// file name

  const ev = document.createEvent("MouseEvents");
  ev.initEvent(
    "click", true, false, window, 0, 0, 0, 0, 0
    , false, false, false, false, 0, null
  );
  saveLink.dispatchEvent(ev);
};

export const listColumnsToXLSXHeader = function (listColumns = []) {
  const header = {};
  listColumns.forEach(row => {
    header[row.label] = row.prop;
  });
  return header;
};
