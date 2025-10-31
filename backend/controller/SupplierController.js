const PDFDocument = require('pdfkit')
const ExcelJS = require("exceljs");
const fs = require('fs')

const Supplier = require('../models/Supplier')



//CREATE SUPPLIER

async function create(req, res) {

  const lastSupplier = await Supplier.findOne().sort({ s_id: -1 });
  const s_id = lastSupplier ? lastSupplier.s_id + 1 : 502;

  const { name, contact, address } = req.body

  try {

    const newSupplier = await Supplier.create({ s_id, name, contact, address })
    res.status(200).json({ message: "Supplier was Created", Supplier: newSupplier })
  } catch (error) {
    res.status(500).json(error)
  }

}

//GET SUPPLIER


async function getSupplier(req, res) {


  try {
    const supplier = await Supplier.find()
    res.status(200).json({ supplier })
  } catch (error) {

    res.status(500).json(error)

  }
}

//GET SUPPLIER BY ID

async function getSupplierById(req, res) {

  const { id } = req.params
  try {


    const supplier = await Supplier.find(id)
    res.status(200).json(supplier)

  } catch (error) {
    res.status(500).json(error)
  }

}


//UPDATE SUPPLIER

async function updateSupplier(req, res) {
  const { id } = req.params
  const { name, contact, address } = req.body

  try {
    const supplier = await Supplier.findByIdAndUpdate(id, { name, contact, address })
    res.status(200).json({ message: "Updated ..." })
  } catch (error) {

    res.status(500).json(error)
  }
}

//DELETE SUPPLIER

async function deleteSupplier(req, res) {
  const { id } = req.params
  try {
    await Supplier.findByIdAndDelete(id)

    res.status(200).json({ message: "Deleted..." })
  } catch (error) {
    res.status(500).json(error)
  }
}


//GET-PDF

async function getSuppliersPdf(req, res) {
  try {
    const suppliers = await Supplier.find({});

    const doc = new PDFDocument({ margin: 30, size: "A4" });
    const filePath = "suppliers.pdf";
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // === Title ===
    doc.font("Helvetica-Bold")
      .fontSize(18)
      .fillColor("#222")
      .text("Supplier List", { align: "center" })
      .moveDown(1.2);

    // === Table layout ===
    const startX = doc.page.margins.left;
    const startY = 100;
    const rowHeight = 22;
    const pageWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    const colWidths = {
      s_id: 70,
      name: 120,
      contact: 110,
      address: pageWidth - (70 + 120 + 110),
    };

    const colX = {
      s_id: startX,
      name: startX + colWidths.s_id,
      contact: startX + colWidths.s_id + colWidths.name,
      address: startX + colWidths.s_id + colWidths.name + colWidths.contact,
    };

    // === Draw header ===
    doc.font("Helvetica-Bold").fontSize(12);
    doc
      .text("Supplier ID", colX.s_id, startY)
      .text("Name", colX.name, startY)
      .text("Contact", colX.contact, startY)
      .text("Address", colX.address, startY);

    doc
      .moveTo(startX, startY + 18)
      .lineTo(startX + pageWidth, startY + 18)
      .stroke();

    // === Draw rows ===
    let y = startY + rowHeight;
    doc.font("Helvetica").fontSize(10);

    for (let i = 0; i < suppliers.length; i++) {
      const s = suppliers[i];
      const textY = y + 4;

      doc
        .text(s.s_id || "—", colX.s_id, textY)
        .text(s.name || "—", colX.name, textY)
        .text(s.contact || "—", colX.contact, textY)
        .text(s.address || "—", colX.address, textY, {
          width: colWidths.address,
          ellipsis: true,
        });

      y += rowHeight;

      // === Page break ===
      if (y > doc.page.height - doc.page.margins.bottom - rowHeight) {
        doc.addPage();

        // Redraw header on new page
        doc.font("Helvetica-Bold").fontSize(12);
        doc
          .text("Supplier ID", colX.s_id, startY)
          .text("Name", colX.name, startY)
          .text("Contact", colX.contact, startY)
          .text("Address", colX.address, startY);

        doc
          .moveTo(startX, startY + 18)
          .lineTo(startX + pageWidth, startY + 18)
          .stroke();

        y = startY + rowHeight;
        doc.font("Helvetica").fontSize(10);
      }
    }

    // === Finalize ===
    doc.end();
    writeStream.on("finish", () => res.download(filePath, "suppliers.pdf"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

//GET-PDF

async function getSuppliersExcel(req, res) {
  try {
    const suppliers = await Supplier.find({});

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Suppliers");

    sheet.mergeCells("A1", "D1");
    sheet.getCell("A1").value = "Supplier List";
    sheet.getCell("A1").font = { size: 16, bold: true };
    sheet.getCell("A1").alignment = { horizontal: "center" };

    sheet.addRow([]);
    const headerRow = sheet.addRow(["Supplier ID", "Name", "Contact", "Address"]);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF333399" } };
      cell.alignment = { horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    suppliers.forEach((s) => {
      sheet.addRow([s.s_id || "—", s.name || "—", s.contact || "—", s.address || "—"]);
    });

    sheet.columns = [
      { width: 12 },
      { width: 25 },
      { width: 20 },
      { width: 30 },
    ];

    const filePath = "suppliers.xlsx";
    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, "suppliers.xlsx");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = { create, getSupplier, getSupplierById, updateSupplier, deleteSupplier, getSuppliersPdf, getSuppliersExcel }