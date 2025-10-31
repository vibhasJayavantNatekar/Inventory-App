const express = require('express')
const PDFDocument = require('pdfkit')
const ExcelJS = require("exceljs");
const fs = require('fs')

const Category = require('../models/Category');
const Supplier = require('../models/Supplier');


//CREATE CATEGORY



async function Create(req, res) {
     const lastCategory = await Category.findOne().sort({c_id: -1});
       const c_id= lastCategory ? lastCategory.c_id + 1 : 102457;

    const { name, description } = req.body


    try {

       
        const newCategory = await Category.create({ c_id, name, description })
        res.status(200).json({ message: `new category careted ${newCategory}` })
    } catch (error) {

        res.status(500).json(error)


    }
}

//GET CATEGORY

async function getAllCategory(req, res) {

    try {
        const category = await Category.find()
        res.status(200).json({category})
    } catch (error) {

        res.status(500).json(error)
    }
}

//GET CATEGORY BY ID

async function getCategoryByID(req, res) {
    const { c_id } = req.params

    try {
        const getCategory = await Category.find({ c_id })
        res.status(200).json(getCategory)
    } catch (error) {

        res.status(500).json(error)
    }
}


//UPDATE CATEGORY

async function update(req, res) {


    const { id } = req.params
    const { name, description } = req.body

    try {
        const Edit = await Category.findByIdAndUpdate( id , { name, description })
        res.status(200).json({ message: "updated.." }, Edit)
    } catch (error) {

        res.status(500).json(error)

    }
}


//DELETE CATEGORY

async function deleteCategory(req, res) {
    const { id } = req.params

    try {
    
        await Category.findByIdAndDelete(id)
        res.status(200).json("Deleted...")
    } catch (error) {

        res.status(500).json(error)

    }
}

//GET-PDF

async function getCategoriesPdf(req, res) {
  try {
    const categories = await Category.find({});

    const doc = new PDFDocument({ margin: 30, size: "A4" });
    const filePath = "categories.pdf";
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Title
    doc.font("Helvetica-Bold").fontSize(18).fillColor("#222")
       .text("Category List", { align: "center" }).moveDown(1.2);

    const startX = doc.page.margins.left;
    const startY = 100;
    const rowHeight = 22;
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

    const colWidths = { c_id: 80, name: 150, description: pageWidth - (80 + 150) };
    const colX = {
      c_id: startX,
      name: startX + colWidths.c_id,
      description: startX + colWidths.c_id + colWidths.name,
    };

    const drawHeader = () => {
      doc.font("Helvetica-Bold").fontSize(12);
      doc.text("Category ID", colX.c_id, startY)
         .text("Name", colX.name, startY)
         .text("Description", colX.description, startY);
      doc.moveTo(startX, startY + 18)
         .lineTo(startX + pageWidth, startY + 18)
         .stroke();
    };

    drawHeader();
    let y = startY + rowHeight;
    doc.font("Helvetica").fontSize(10);

    for (const c of categories) {
      doc.text(c.c_id || "—", colX.c_id, y)
         .text(c.name || "—", colX.name, y)
         .text(c.description || "—", colX.description, y, { width: colWidths.description });
      y += rowHeight;

      if (y > doc.page.height - doc.page.margins.bottom - rowHeight) {
        doc.addPage();
        drawHeader();
        y = startY + rowHeight;
      }
    }

    doc.end();
    writeStream.on("finish", () => res.download(filePath, "categories.pdf"));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//GET-EXCEL
async function getCategoriesExcel(req, res) {
  try {
    const categories = await Category.find({});

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Categories");

    sheet.mergeCells("A1", "C1");
    sheet.getCell("A1").value = "Category List";
    sheet.getCell("A1").font = { size: 16, bold: true };
    sheet.getCell("A1").alignment = { horizontal: "center" };

    sheet.addRow([]);
    const headerRow = sheet.addRow(["Category ID", "Name", "Description"]);

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

    categories.forEach((c) => {
      sheet.addRow([c.c_id || "—", c.name || "—", c.description || "—"]);
    });

    sheet.columns = [{ width: 12 }, { width: 25 }, { width: 40 }];

    const filePath = "categories.xlsx";
    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, "categories.xlsx");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { Create, getAllCategory, getCategoryByID, deleteCategory, update ,getCategoriesPdf , getCategoriesExcel}