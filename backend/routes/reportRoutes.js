const express = require("express");
const {
  createReport,
  updateReport,
  getReport,
  deleteReport,
  getAllReportsByStudent,
  downloadReportPdf,
} = require("../controllers/reportController");

const router = express.Router();

// POST - create a report
router.post("/", createReport);

// GET - Download PDF Report
router.get("/:reportId/pdf", downloadReportPdf)

// GET - get all reports (with optional filters)
router.get("/:enrollmentId/:studentId", getAllReportsByStudent);


// GET - get single report by ID
router.get("/:id", getReport);


// PUT - update a report
router.put("/:id", updateReport);

// DELETE - delete a report
router.delete("/:id", deleteReport);

module.exports = router;
