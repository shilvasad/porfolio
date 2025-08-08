const PDFDocument = require('pdfkit');
const Profile = require('../models/Profile');
const Contribution = require('../models/Contribution');
const Goal = require('../models/Goal');

// @desc    Generate and download a CV as a PDF
// @route   GET /api/cv/generate
// @access  Private/Admin
const generateCv = async (req, res) => {
  try {
    // 1. Fetch data
    const profile = await Profile.findOne();
    const contributions = await Contribution.find({}).sort({ date: -1 });
    const goals = await Goal.find({ user: req.user._id, status: { $in: ['In Progress', 'Completed'] } }).sort({ dueDate: 'asc' });

    // 2. Create a new PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');

    // Pipe the PDF document to the response
    doc.pipe(res);

    // 3. Build the PDF content
    // Header
    doc.fontSize(24).text(profile.name || 'Name', { align: 'center' });
    doc.fontSize(16).text(profile.title || 'Title', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Email: ${profile.contact?.email || 'N/A'} | LinkedIn: ${profile.socialLinks?.linkedin || 'N/A'}`, { align: 'center' });
    doc.moveDown(2);

    // Bio/Summary
    doc.fontSize(18).text('Summary');
    doc.fontSize(12).text(profile.bio || 'No summary provided.');
    doc.moveDown(2);

    // Contributions/Projects
    doc.fontSize(18).text('Key Projects & Contributions');
    contributions.forEach(item => {
        doc.fontSize(14).text(item.title);
        doc.fontSize(10).text(item.description, { indent: 20 });
        doc.fontSize(10).text(`Technologies: ${item.technologies.join(', ')}`, { indent: 20 });
        doc.moveDown();
    });
    doc.moveDown();

    // Goals
    doc.fontSize(18).text('Current Goals');
    goals.forEach(goal => {
        doc.fontSize(14).text(goal.title);
        doc.fontSize(10).text(`Status: ${goal.status}`, { indent: 20 });
        doc.moveDown();
    });

    // 4. Finalize the PDF and end the stream
    doc.end();

  } catch (error) {
    console.error('Error generating CV:', error);
    res.status(500).json({ message: 'Failed to generate CV' });
  }
};

module.exports = {
  generateCv,
};
