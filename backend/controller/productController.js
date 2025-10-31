const Products = require('../models/product');
const PDFDocument = require('pdfkit');
const ExcelJS = require("exceljs");

const fs = require('fs');



// CREATE PRODUCT
async function createProduct(req, res) {
    const lastProduct = await Products.findOne().sort({ p_id: -1 });
    const p_id = lastProduct ? lastProduct.p_id + 1 : 100;

  const { name,  price, qty,c_id,s_id } = req.body




  try {

      

    const product = await Products.create({ p_id, name,price, qty , c_id,s_id })
    res.status(200).json({ message: "Product created successfully", product })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET ALL PRODUCTS
async function getProducts(req, res) {
  try {
    
   const products = await Products.find().populate('c_id')
  .populate('s_id');


    console.log(products)
    res.status(200).json({ products })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET PRODUCT BY ID
async function getProductById(req, res) {
 

  const { id } = req.params

  try {
    const product = await Products.find(id)
   
    
  
    res.status(200).json({ product })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// UPDATE PRODUCT
async function update(req, res) {
  const { id } = req.params
  const { name, category, price, qty } = req.body

  try {
 
    const product = await Products.findByIdAndUpdate(id,{name,category,price,qty})
   
    res.status(200).json({ message: "Product updated", product })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// DELETE PRODUCT
async function deleteProduct(req, res) {
  const { id } = req.params

  try {
    
    const product = await Products.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

//GET PDF


async function getProductsPdf(req, res) {
  try {
    // ✅ Fetch all products and populate category/supplier names
    const products = await Products.find({})
      .populate("c_id")
      .populate("s_id");

    // ✅ Create a new PDF
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    const filePath = "products.pdf";
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // === Title ===
    doc.font("Helvetica-Bold")
      .fontSize(18)
      .fillColor("#222")
      .text("Product List", { align: "center" })
      .moveDown(1.2);

    // === Table layout ===
    const startX = doc.page.margins.left;
    const startY = 100;
    const rowHeight = 22;
    const pageWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // Column widths — adjusted to fit all fields properly
    const colWidths = {
      p_id: 60,
      name: 110,
      category: 100,
      supplier: 100,
      qty: 60,
      price: pageWidth - (60 + 110 + 100 + 100 + 60),
    };

    // Column X positions
    const colX = {
      p_id: startX,
      name: startX + colWidths.p_id,
      category: startX + colWidths.p_id + colWidths.name,
      supplier: startX + colWidths.p_id + colWidths.name + colWidths.category,
      qty:
        startX +
        colWidths.p_id +
        colWidths.name +
        colWidths.category +
        colWidths.supplier,
      price:
        startX +
        colWidths.p_id +
        colWidths.name +
        colWidths.category +
        colWidths.supplier +
        colWidths.qty,
    };

    // === Header drawing function ===
    const drawHeader = () => {
      doc.font("Helvetica-Bold").fontSize(12);
      doc
        .text("Product ID", colX.p_id, startY)
        .text("Name", colX.name, startY)
        .text("Category", colX.category, startY)
        .text("Supplier", colX.supplier, startY)
        .text("Qty", colX.qty, startY)
        .text("Price", colX.price, startY);
      doc
        .moveTo(startX, startY + 18)
        .lineTo(startX + pageWidth, startY + 18)
        .stroke();
    };

    // Draw the header
    drawHeader();

    // === Table rows ===
    let y = startY + rowHeight;
    doc.font("Helvetica").fontSize(10);

    for (const p of products) {
      doc
        .text(p.p_id || "—", colX.p_id, y)
        .text(p.name || "—", colX.name, y)
        .text(p.c_id?.name || "—", colX.category, y)
        .text(p.s_id?.name || "—", colX.supplier, y)
        .text(p.qty?.toString() || "—", colX.qty, y)
        .text(p.price ? `₹${p.price}` : "—", colX.price, y);
      y += rowHeight;

      // === Page Break ===
      if (y > doc.page.height - doc.page.margins.bottom - rowHeight) {
        doc.addPage();
        drawHeader();
        y = startY + rowHeight;
        doc.font("Helvetica").fontSize(10);
      }
    }

    // === Finalize PDF ===
    doc.end();
    writeStream.on("finish", () => res.download(filePath, "products.pdf"));
  } catch (error) {
    console.error("Error generating product PDF:", error);
    res.status(500).json({ error: error.message });
  }
}

//GET-EXCEL


async function getProductsExcel(req, res) {
  try {
    const products = await Products.find({})
      .populate("c_id")
      .populate("s_id");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Products");

    worksheet.mergeCells("A1", "F1");
    worksheet.getCell("A1").value = "Product List";
    worksheet.getCell("A1").font = { size: 16, bold: true };
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    worksheet.addRow([]);
    const headerRow = worksheet.addRow([
      "Product ID",
      "Name",
      "Category",
      "Supplier",
      "Qty",
      "Price",
    ]);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF333399" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    products.forEach((p) => {
      worksheet.addRow([
        p.p_id || "—",
        p.name || "—",
        p.c_id?.name || "—",
        p.s_id?.name || "—",
        p.qty || "—",
        p.price ? `₹${p.price}` : "—",
      ]);
    });

    worksheet.columns = [
      { key: "p_id", width: 12 },
      { key: "name", width: 25 },
      { key: "category", width: 20 },
      { key: "supplier", width: 20 },
      { key: "qty", width: 10 },
      { key: "price", width: 12 },
    ];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 2) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      }
    });

    const filePath = "products.xlsx";
    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, "products.xlsx");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}


 module.exports = { createProduct, getProducts, getProductById, update, deleteProduct,getProductsPdf  ,getProductsExcel}




