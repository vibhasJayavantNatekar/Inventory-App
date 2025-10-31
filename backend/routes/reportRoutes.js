const express = require("express");
const {
  exportReportsPdf,
  exportReportsExcel,
} = require("../controller/reportController");

const Router = express.Router();

Router.get("/export-pdf", exportReportsPdf);
Router.get("/export-excel", exportReportsExcel);

module.exports = Router;
