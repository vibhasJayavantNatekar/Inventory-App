const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const fs = require("fs");
const Products = require("../models/product");
const Category = require("../models/Category");
const Supplier = require("../models/Supplier");
const User = require("../models/user");

//GET PDF
async function exportReportsPdf(req, res) {
  try {
    const products = await Products.find({}).populate("c_id").populate("s_id");
    const users = await User.find({});
    const suppliers = await Supplier.find({});
    const categories = await Category.find({});

    const doc = new PDFDocument({ margin: 30, size: "A4" });
    const filePath = "report.pdf";
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.font("Helvetica-Bold").fontSize(18).text(" Report Summary", { align: "center" });
    doc.moveDown(1.2);


    doc.fontSize(12).fillColor("#000");
    doc.text(`Total Products: ${products.length}`);
    doc.text(`Total Categories: ${categories.length}`);
    doc.text(`Total Suppliers: ${suppliers.length}`);
    doc.text(`Total Users: ${users.length}`);
    doc.moveDown(1);


    const startX = doc.page.margins.left;
    const startY = 150;
    const rowHeight = 20;
    const colWidths = { id: 50, name: 120, category: 120, qty: 60, price: 80 };
    const colX = {
      id: startX,
      name: startX + colWidths.id,
      category: startX + colWidths.id + colWidths.name,
      qty: startX + colWidths.id + colWidths.name + colWidths.category,
      price: startX + colWidths.id + colWidths.name + colWidths.category + colWidths.qty,
    };

    doc.font("Helvetica-Bold").text("Products Overview", startX , startY - 10);
    doc.font("Helvetica-Bold").fontSize(11);
    doc
      .text("ID", colX.id, startY)
      .text("Name", colX.name, startY)
      .text("Category", colX.category, startY)
      .text("Qty", colX.qty, startY)
      .text("Price", colX.price, startY);
    doc
      .moveTo(startX, startY + 15)
      .lineTo(550, startY + 15)
      .stroke();

    doc.font("Helvetica").fontSize(10);
    let y = startY + rowHeight;

    products.slice(0, 20).forEach((p) => {
      doc
        .text(p.p_id || "-", colX.id, y)
        .text(p.name || "-", colX.name, y)
        .text(p.c_id?.name || "-", colX.category, y)
        .text(p.qty.toString(), colX.qty, y)
        .text(`₹${p.price}`, colX.price, y);
      y += rowHeight;
    });

    doc.end();
    writeStream.on("finish", () => res.download(filePath, "report.pdf"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//GET-EXCEL

async function exportReportsExcel(req, res) {
  try {
    const products = await Products.find({}).populate("c_id").populate("s_id");
    const categories = await Category.find({});
    const suppliers = await Supplier.find({});
    const users = await User.find({});

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Report");

    
    sheet.mergeCells("A1", "E1");
    sheet.getCell("A1").value = " Report Summary";
    sheet.getCell("A1").font = { size: 16, bold: true };
    sheet.getCell("A1").alignment = { horizontal: "center" };

   
    sheet.addRow([]);
    sheet.addRow(["Total Products", products.length]);
    sheet.addRow(["Total Categories", categories.length]);
    sheet.addRow(["Total Suppliers", suppliers.length]);
    sheet.addRow(["Total Users", users.length]);
    sheet.addRow([]);


    const header = ["Product ID", "Name", "Category", "Supplier", "Qty", "Price"];
    const headerRow = sheet.addRow(header);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF333399" } };
      cell.alignment = { horizontal: "center" };
    });

    products.forEach((p) => {
      sheet.addRow([
        p.p_id || "-",
        p.name || "-",
        p.c_id?.name || "-",
        p.s_id?.name || "-",
        p.qty || "-",
        p.price ? `₹${p.price}` : "-",
      ]);
    });

    sheet.columns = [
      { width: 12 },
      { width: 25 },
      { width: 20 },
      { width: 20 },
      { width: 10 },
      { width: 12 },
    ];

    const filePath = "report.xlsx";
    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, "report.xlsx");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { exportReportsPdf, exportReportsExcel };
