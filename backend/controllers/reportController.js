const Report = require("../models/report");
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const Enrollment = require("../models/enrollment")
const PDFDocument =  require("pdfkit")
const { format } = require("date-fns");
require("pdfkit-table")

// @desc    Create a new report
// @route   POST /api/reports
// @access  Teacher/Admin
const createReport = asyncHandler(async (req, res) => {
  const { enrollmentId, data, type } = req.body;
  
  const month = new Date().toISOString().slice(0, 7)

  const enrollment = await Enrollment.findById(enrollmentId)


  if(!enrollment) throw new NotFoundError("Course Not Found")

  if (!enrollment || !data) {
    throw new BadRequestError("Missing Required Fields")
  }

  const report = await Report.create({
    enrollment,
    student: enrollment.student,
    teacher: enrollment.teacher,
    course: enrollment.course,
    month,
    type,
    data
  });

  res.status(StatusCodes.CREATED).json(report);
});

// @desc    Update an existing report
// @route   PUT /api/reports/:id
// @access  Teacher/Admin
const updateReport = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedReport = await Report.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });

  if (!updatedReport) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Report not found" });
  }

  res.status(StatusCodes.OK).json(updatedReport);
});

// @desc    Get a single report by ID
// @route   GET /api/reports/:id
// @access  Teacher/Admin/Student
const getReport = asyncHandler(async (req, res) => {
  
  const { id } = req.params;

  const report = await Report.findById(id)
    .populate("enrollment")
    .populate("student")
    .populate("teacher");

  if (!report) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Report not found" });
  }

  res.status(StatusCodes.OK).json(report);
});

// @desc    Get all reports (optionally filter by enrollment/student/month)
// @route   GET /api/reports
// @access  Teacher/Admin
const getAllReportsByStudent = asyncHandler(async (req, res) => {
  const { enrollmentId, studentId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;

  const skip = (page - 1) * limit;

  const total = await Report.countDocuments({ enrollment: enrollmentId, student: studentId });
  const reports = await Report.find({ enrollment: enrollmentId, student: studentId })
    .sort({ createdAt: -1 })
    // .select("-data")
    .populate("teacher", "name")
    .populate("course", "name")
    .skip(skip)
    .limit(limit);

  if (reports.length === 0 && page === 1) {
    throw new NotFoundError("Reports Not Found");
  }

  res.status(StatusCodes.OK).json({
    msg: "Reports Found Successfully",
    reports,
    total,
    hasMore: skip + reports.length < total
  });
});

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Teacher/Admin
const deleteReport = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const report = await Report.findByIdAndDelete(id);

  if (!report) {
    throw new NotFoundError("Report Not Found")
  }

  res
    .status(StatusCodes.OK)
    .json({ message: "Report deleted successfully" });
});

const downloadReportPdf = asyncHandler(async (req, res) => {
  const { reportId } = req.params;

  const report = await Report.findById(reportId)
    .populate("student", "name")
    .populate("teacher", "name")
    .populate("course", "name")
    .lean();

  if (!report) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Report not found" });
  }

  // Better Map/Object conversion
  let reportData = {};
  
  if (report.data instanceof Map) {
    reportData = Object.fromEntries(report.data);
  } else if (report.data && typeof report.data === 'object') {
    reportData = JSON.parse(JSON.stringify(report.data));
  } else {
    reportData = report.data || {};
  }

  const fileName = `Report_${report.student.name}_${report.month}.pdf`;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

  const doc = new PDFDocument({ 
    margin: 50,
    size: 'A4',
    bufferPages: true
  });
  doc.pipe(res);

  // Define colors
  const colors = {
    primary: '#1E3A8A',
    secondary: '#3B82F6',
    text: '#1F2937',
    lightGray: '#F3F4F6',
    border: '#E5E7EB',
    accent: '#10B981'
  };

  // HEADER with accent bar
  doc.rect(0, 0, doc.page.width, 8).fill(colors.primary);
  
  doc.moveDown(2);
  doc
    .fontSize(28)
    .fillColor(colors.primary)
    .font('Helvetica-Bold')
    .text(`MONTHLY ${report.type.toUpperCase()} REPORT`, { align: "center" });
  
  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .fillColor(colors.text)
    .font('Helvetica')
    .text(`Report ID: ${reportId}`, { align: "center" });
  
  doc.moveDown(2);

  // INFO CARD
  const infoBoxY = doc.y;
  const infoBoxHeight = 100;
  
  // Draw rounded rectangle background
  doc.roundedRect(50, infoBoxY, doc.page.width - 100, infoBoxHeight, 5)
     .fill(colors.lightGray);

  // Content inside info box
  doc.fillColor(colors.text);
  const infoY = infoBoxY + 15;
  const leftCol = 70;
  const rightCol = 320;

  doc.fontSize(11).font('Helvetica-Bold');
  doc.text("Student:", leftCol, infoY);
  doc.text("Course:", leftCol, infoY + 25);
  doc.text("Teacher:", leftCol, infoY + 50);
  doc.text("Period:", leftCol, infoY + 75);

  doc.fontSize(11).font('Helvetica');
  doc.text(report.student.name, rightCol, infoY);
  doc.text(report.course.name, rightCol, infoY + 25);
  doc.text(report.teacher.name, rightCol, infoY + 50);
  doc.text(report.month, rightCol, infoY + 75);

  doc.y = infoBoxY + infoBoxHeight + 30;

  // SECTION HEADER
  doc
    .fontSize(16)
    .fillColor(colors.primary)
    .font('Helvetica-Bold')
    .text("Performance Evaluation", 50);
  
  doc.moveDown(0.3);
  doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).lineWidth(2).stroke(colors.secondary);
  doc.moveDown(1);

  // DATA TABLE
  if (Object.keys(reportData).length === 0) {
    doc
      .fontSize(12)
      .fillColor(colors.text)
      .font('Helvetica')
      .text("No data available for this report.", { align: "center" });
  } else {
    const startY = doc.y;
    const tableTop = startY;
    const itemHeight = 35;
    const col1X = 70;
    const col2X = 350;
    const tableWidth = doc.page.width - 120;

    // Table Headers with background
    doc.rect(50, tableTop - 5, tableWidth, 30).fill(colors.primary);
    
    doc.font("Helvetica-Bold").fontSize(12).fillColor('#FFFFFF');
    doc.text("Evaluation Criteria", col1X, tableTop + 3);
    doc.text("Assessment", col2X, tableTop + 3);

    // Rows
    doc.font("Helvetica").fontSize(11).fillColor(colors.text);
    let currentY = tableTop + itemHeight;

    Object.entries(reportData).forEach(([key, value], index) => {
      const formattedKey = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
      
      // Alternating row colors
      if (index % 2 === 0) {
        doc.rect(50, currentY - 8, tableWidth, itemHeight - 5).fill(colors.lightGray);
      }

      // Reset fill color for text
      doc.fillColor(colors.text);
      
      doc.font('Helvetica-Bold').text(formattedKey, col1X, currentY, { width: 250 });
      
      // Color-code the assessment value
      const valueColor = 
        value === 'Excellent' ? '#10B981' :
        value === 'Good' ? '#3B82F6' :
        value === 'Satisfactory' ? '#F59E0B' :
        value === 'Needs Improvement' ? '#EF4444' :
        colors.text;
      
      doc.font('Helvetica').fillColor(valueColor).text(String(value ?? "N/A"), col2X, currentY);
      
      // Add subtle divider
      doc.moveTo(50, currentY + 22).lineTo(doc.page.width - 50, currentY + 22)
         .lineWidth(0.5).stroke(colors.border);
      
      currentY += itemHeight;
    });

    doc.y = currentY + 10;
  }

  // FOOTER
  const bottomY = doc.page.height - 80;
  
  // Footer line
  doc.moveTo(50, bottomY).lineTo(doc.page.width - 50, bottomY)
     .lineWidth(1).stroke(colors.border);

  doc.y = bottomY + 15;
  doc
    .fontSize(9)
    .fillColor('#6B7280')
    .font('Helvetica')
    .text(`Generated on ${format(new Date(), "PPP 'at' p")}`, { align: "center" });
  
  doc.moveDown(0.3);
  doc
    .fontSize(8)
    .fillColor('#9CA3AF')
    .text("This is a computer-generated document. No signature is required.", { align: "center" });

  // Top-right accent corner
  doc.rect(doc.page.width - 50, 0, 50, 50).fill(colors.secondary);

  doc.end();
});


module.exports = {
  createReport,
  updateReport,
  getReport,
  getAllReportsByStudent,
  deleteReport,
  downloadReportPdf
};
