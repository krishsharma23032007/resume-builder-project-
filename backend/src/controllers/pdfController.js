const PDFDocument = require("pdfkit");

/**
 * Generates a PDF resume based on the provided data and template.
 * Returns the PDF as a buffer.
 */
function generateResumePdf(resumeData, template = "classic") {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: template === "compact" ? { top: 30, bottom: 30, left: 30, right: 30 } : { top: 40, bottom: 40, left: 50, right: 50 }
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const { personal, education, experience, projects, skills, certifications, achievements, responsibilities, languages, interests } = resumeData;

      if (template === "modern") {
        renderModernTemplate(doc, resumeData);
      } else if (template === "compact") {
        renderCompactTemplate(doc, resumeData);
      } else {
        renderClassicTemplate(doc, resumeData);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function renderClassicTemplate(doc, data) {
  const { personal, education, experience, projects, skills, certifications, achievements, responsibilities, languages, interests } = data;
  let y = 40;

  // Header - centered
  doc.fontSize(20).font("Helvetica-Bold").text(personal.name || "Your Name", 50, y, { align: "center" });
  y += 25;
  doc.fontSize(11).font("Helvetica").fillColor("#666666").text(personal.role || "Target Role", 50, y, { align: "center" });
  y += 18;

  const contactParts = [personal.email, personal.phone, personal.location].filter(Boolean);
  if (contactParts.length > 0) {
    doc.fontSize(8).fillColor("#999999").text(contactParts.join(" | "), 50, y, { align: "center" });
    y += 15;
  }

  // Divider
  doc.moveTo(50, y).lineTo(545, y).stroke("#000000");
  y += 15;

  // Summary
  if (personal.summary) {
    doc.fontSize(9).font("Helvetica").fillColor("#444444").text(personal.summary, 50, y, { width: 495, lineGap: 3 });
    y = doc.y + 10;
  }

  // Education
  if (education && education.length > 0) {
    y = renderSectionHeader(doc, "EDUCATION", y);
    for (const edu of education) {
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#000000").text(`${edu.degree || ""} ${edu.field ? `in ${edu.field}` : ""}`, 50, y, { width: 400 });
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text(edu.institution || "", 50, doc.y);
      if (edu.startDate || edu.endDate) {
        doc.fontSize(8).fillColor("#999999").text(`${edu.startDate || ""} - ${edu.endDate || ""}`, 450, y, { width: 95, align: "right" });
      }
      if (edu.gpa) {
        doc.fontSize(8).fillColor("#999999").text(`GPA: ${edu.gpa}`, 50, doc.y);
      }
      y = doc.y + 8;
    }
  }

  // Experience
  if (experience && experience.length > 0) {
    y = renderSectionHeader(doc, "EXPERIENCE", y);
    for (const exp of experience) {
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#000000").text(exp.title || "", 50, y, { width: 400 });
      doc.fontSize(9).font("Helvetica").fillColor("#666666").text(`${exp.company || ""}${exp.location ? `, ${exp.location}` : ""}`, 50, doc.y);
      if (exp.startDate || exp.endDate) {
        doc.fontSize(8).fillColor("#999999").text(`${exp.startDate || ""} - ${exp.endDate || ""}`, 450, y, { width: 95, align: "right" });
      }
      y = doc.y + 3;
      if (exp.description) {
        doc.fontSize(9).fillColor("#444444").text(exp.description, 50, y, { width: 495 });
        y = doc.y + 3;
      }
      if (exp.bullets && exp.bullets.length > 0) {
        for (const bullet of exp.bullets.filter(Boolean)) {
          doc.fontSize(9).fillColor("#444444").text(`• ${bullet}`, 60, y, { width: 485 });
          y = doc.y + 2;
        }
      }
      y = doc.y + 8;
    }
  }

  // Projects
  if (projects && projects.length > 0) {
    y = renderSectionHeader(doc, "PROJECTS", y);
    for (const proj of projects) {
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#000000").text(proj.name || "", 50, y, { width: 400 });
      y = doc.y + 2;
      if (proj.description) {
        doc.fontSize(9).font("Helvetica").fillColor("#444444").text(proj.description, 50, y, { width: 495 });
        y = doc.y + 2;
      }
      if (proj.technologies) {
        doc.fontSize(8).fillColor("#999999").text(`Tech: ${proj.technologies}`, 50, y, { width: 495 });
        y = doc.y + 2;
      }
      y = doc.y + 6;
    }
  }

  // Skills
  if (skills && skills.length > 0) {
    y = renderSectionHeader(doc, "SKILLS", y);
    for (const skill of skills) {
      doc.fontSize(9).font("Helvetica-Bold").fillColor("#000000").text(`${skill.category || ""}: `, 50, y, { continued: true });
      doc.font("Helvetica").fillColor("#444444").text(skill.items ? skill.items.join(", ") : "");
      y = doc.y + 4;
    }
    y += 5;
  }

  // Certifications
  if (certifications && certifications.length > 0) {
    y = renderSectionHeader(doc, "CERTIFICATIONS", y);
    for (const cert of certifications) {
      doc.fontSize(9).font("Helvetica").fillColor("#444444").text(`${cert.name || ""} - ${cert.issuer || ""} (${cert.date || ""})`, 50, y, { width: 495 });
      y = doc.y + 4;
    }
    y += 5;
  }

  // Achievements
  if (achievements && achievements.length > 0) {
    y = renderSectionHeader(doc, "ACHIEVEMENTS", y);
    for (const ach of achievements) {
      doc.fontSize(9).font("Helvetica-Bold").fillColor("#000000").text(`${ach.title || ""}: `, 50, y, { continued: true });
      doc.font("Helvetica").fillColor("#444444").text(ach.description || "");
      y = doc.y + 4;
    }
    y += 5;
  }

  // Positions of Responsibility
  if (responsibilities && responsibilities.length > 0) {
    y = renderSectionHeader(doc, "POSITIONS OF RESPONSIBILITY", y);
    for (const resp of responsibilities) {
      doc.fontSize(9).font("Helvetica").fillColor("#444444").text(`${resp.role || ""} at ${resp.organization || ""}`, 50, y, { width: 495 });
      y = doc.y + 4;
    }
    y += 5;
  }

  // Languages
  if (languages && languages.length > 0) {
    y = renderSectionHeader(doc, "LANGUAGES", y);
    doc.fontSize(9).font("Helvetica").fillColor("#444444").text(
      languages.map(l => `${l.name || ""} (${l.proficiency || ""})`).join(", "),
      50, y, { width: 495 }
    );
    y = doc.y + 10;
  }

  // Interests
  if (interests && interests.length > 0) {
    y = renderSectionHeader(doc, "INTERESTS", y);
    doc.fontSize(9).font("Helvetica").fillColor("#444444").text(
      interests.map(i => i.name || "").join(", "),
      50, y, { width: 495 }
    );
  }
}

function renderModernTemplate(doc, data) {
  const { personal, education, experience, projects, skills, certifications, achievements, responsibilities, languages, interests } = data;
  let y = 40;

  // Header - left aligned with accent
  doc.moveTo(50, y).lineTo(50, y + 60).lineWidth(3).strokeColor("#2563eb").stroke();
  doc.lineWidth(1).strokeColor("#000000");

  doc.fontSize(22).font("Helvetica-Bold").fillColor("#1a1a1a").text(personal.name || "Your Name", 60, y);
  y += 28;
  doc.fontSize(12).font("Helvetica").fillColor("#2563eb").text(personal.role || "Target Role", 60, y);
  y += 18;

  const contactParts = [personal.email, personal.phone, personal.location].filter(Boolean);
  if (contactParts.length > 0) {
    doc.fontSize(8).fillColor("#999999").text(contactParts.join(" | "), 60, y);
    y += 15;
  }
  y += 10;

  // Summary (italic)
  if (personal.summary) {
    doc.fontSize(9).font("Helvetica-Oblique").fillColor("#444444").text(personal.summary, 50, y, { width: 495, lineGap: 3 });
    y = doc.y + 10;
  }

  // Sections with blue accent
  const sections = [
    { title: "EDUCATION", items: education, render: renderEducationItem },
    { title: "EXPERIENCE", items: experience, render: renderExperienceItem },
    { title: "PROJECTS", items: projects, render: renderProjectItem },
    { title: "SKILLS", items: skills, render: renderSkillItem },
    { title: "CERTIFICATIONS", items: certifications, render: renderCertItem },
    { title: "ACHIEVEMENTS", items: achievements, render: renderAchievementItem },
    { title: "POSITIONS OF RESPONSIBILITY", items: responsibilities, render: renderRespItem },
    { title: "LANGUAGES", items: languages, render: renderLanguageItem },
    { title: "INTERESTS", items: interests, render: renderInterestItem }
  ];

  for (const section of sections) {
    if (section.items && section.items.length > 0) {
      y = renderModernSectionHeader(doc, section.title, y);
      for (const item of section.items) {
        y = section.render(doc, item, y);
      }
      y += 5;
    }
  }
}

function renderCompactTemplate(doc, data) {
  const { personal, education, experience, projects, skills, certifications, achievements, responsibilities, languages, interests } = data;
  let y = 30;

  // Header - compact centered
  doc.fontSize(16).font("Helvetica-Bold").text(personal.name || "Your Name", 30, y, { align: "center" });
  y += 20;
  doc.fontSize(10).font("Helvetica").fillColor("#666666").text(personal.role || "Target Role", 30, y, { align: "center" });
  y += 15;

  const contactParts = [personal.email, personal.phone, personal.location].filter(Boolean);
  if (contactParts.length > 0) {
    doc.fontSize(7).fillColor("#999999").text(contactParts.join(" | "), 30, y, { align: "center" });
    y += 12;
  }

  doc.moveTo(30, y).lineTo(565, y).stroke("#000000");
  y += 8;

  // Summary
  if (personal.summary) {
    doc.fontSize(8).font("Helvetica").fillColor("#444444").text(personal.summary, 30, y, { width: 535, lineGap: 2 });
    y = doc.y + 6;
  }

  // Compact sections
  if (education && education.length > 0) {
    y = renderCompactSectionHeader(doc, "EDUCATION", y);
    for (const edu of education) {
      doc.fontSize(8).font("Helvetica-Bold").fillColor("#000000").text(`${edu.degree || ""} ${edu.field ? `${edu.field}` : ""} - ${edu.institution || ""}`, 30, y, { width: 450 });
      doc.fontSize(7).fillColor("#999999").text(`${edu.startDate || ""} - ${edu.endDate || ""}`, 500, y, { width: 65, align: "right" });
      y = doc.y + 3;
    }
    y += 3;
  }

  if (experience && experience.length > 0) {
    y = renderCompactSectionHeader(doc, "EXPERIENCE", y);
    for (const exp of experience) {
      doc.fontSize(8).font("Helvetica-Bold").fillColor("#000000").text(`${exp.title || ""} - ${exp.company || ""}`, 30, y, { width: 450 });
      doc.fontSize(7).fillColor("#999999").text(`${exp.startDate || ""} - ${exp.endDate || ""}`, 500, y, { width: 65, align: "right" });
      y = doc.y + 2;
      if (exp.bullets) {
        for (const bullet of exp.bullets.filter(Boolean)) {
          doc.fontSize(7).fillColor("#444444").text(`• ${bullet}`, 40, y, { width: 525 });
          y = doc.y + 1;
        }
      }
      y = doc.y + 4;
    }
  }

  if (skills && skills.length > 0) {
    y = renderCompactSectionHeader(doc, "SKILLS", y);
    for (const skill of skills) {
      doc.fontSize(8).font("Helvetica-Bold").fillColor("#000000").text(`${skill.category || ""}: `, 30, y, { continued: true });
      doc.font("Helvetica").fillColor("#444444").text(skill.items ? skill.items.join(", ") : "");
      y = doc.y + 2;
    }
    y += 3;
  }

  if (projects && projects.length > 0) {
    y = renderCompactSectionHeader(doc, "PROJECTS", y);
    for (const proj of projects) {
      doc.fontSize(8).font("Helvetica-Bold").fillColor("#000000").text(proj.name || "", 30, y, { continued: true });
      doc.font("Helvetica").fillColor("#444444").text(` - ${proj.description || ""}`);
      y = doc.y + 3;
    }
    y += 3;
  }

  // Other sections in compact
  const otherSections = [
    { title: "CERTIFICATIONS", items: certifications, text: (c) => `${c.name || ""} - ${c.issuer || ""} (${c.date || ""})` },
    { title: "ACHIEVEMENTS", items: achievements, text: (a) => `${a.title || ""}: ${a.description || ""}` },
    { title: "POSITIONS", items: responsibilities, text: (r) => `${r.role || ""} at ${r.organization || ""}` },
    { title: "LANGUAGES", items: languages, text: (l) => `${l.name || ""} (${l.proficiency || ""})` },
    { title: "INTERESTS", items: interests, text: (i) => i.name || "" }
  ];

  for (const section of otherSections) {
    if (section.items && section.items.length > 0) {
      y = renderCompactSectionHeader(doc, section.title, y);
      for (const item of section.items) {
        doc.fontSize(8).font("Helvetica").fillColor("#444444").text(section.text(item), 30, y, { width: 535 });
        y = doc.y + 2;
      }
      y += 3;
    }
  }
}

// Helper functions
function renderSectionHeader(doc, title, y) {
  doc.fontSize(9).font("Helvetica-Bold").fillColor("#000000").text(title, 50, y);
  doc.moveTo(50, doc.y + 2).lineTo(545, doc.y + 2).stroke("#000000");
  return doc.y + 8;
}

function renderModernSectionHeader(doc, title, y) {
  doc.fontSize(9).font("Helvetica-Bold").fillColor("#2563eb").text(title, 50, y);
  doc.moveTo(50, doc.y + 2).lineTo(545, doc.y + 2).strokeColor("#2563eb").stroke();
  doc.strokeColor("#000000");
  return doc.y + 8;
}

function renderCompactSectionHeader(doc, title, y) {
  doc.fontSize(7).font("Helvetica-Bold").fillColor("#000000").text(title, 30, y);
  doc.moveTo(30, doc.y + 1).lineTo(565, doc.y + 1).stroke("#000000");
  return doc.y + 4;
}

function renderEducationItem(doc, edu, y) {
  doc.fontSize(9).font("Helvetica-Bold").fillColor("#000000").text(`${edu.degree || ""} ${edu.field ? `in ${edu.field}` : ""}`, 50, y, { width: 400 });
  doc.fontSize(9).font("Helvetica").fillColor("#666666").text(edu.institution || "", 50, doc.y);
  if (edu.startDate || edu.endDate) {
    doc.fontSize(8).fillColor("#999999").text(`${edu.startDate || ""} - ${edu.endDate || ""}`, 450, y, { width: 95, align: "right" });
  }
  return doc.y + 6;
}

function renderExperienceItem(doc, exp, y) {
  doc.fontSize(9).font("Helvetica-Bold").fillColor("#000000").text(exp.title || "", 50, y, { width: 400 });
  doc.fontSize(9).font("Helvetica").fillColor("#666666").text(`${exp.company || ""}${exp.location ? `, ${exp.location}` : ""}`, 50, doc.y);
  if (exp.startDate || exp.endDate) {
    doc.fontSize(8).fillColor("#999999").text(`${exp.startDate || ""} - ${exp.endDate || ""}`, 450, y, { width: 95, align: "right" });
  }
  let newY = doc.y + 2;
  if (exp.description) {
    doc.fontSize(9).fillColor("#444444").text(exp.description, 50, newY, { width: 495 });
    newY = doc.y + 2;
  }
  if (exp.bullets) {
    for (const bullet of exp.bullets.filter(Boolean)) {
      doc.fontSize(9).fillColor("#444444").text(`• ${bullet}`, 60, newY, { width: 485 });
      newY = doc.y + 1;
    }
  }
  return doc.y + 6;
}

function renderProjectItem(doc, proj, y) {
  doc.fontSize(9).font("Helvetica-Bold").fillColor("#000000").text(proj.name || "", 50, y, { width: 400 });
  let newY = doc.y + 2;
  if (proj.description) {
    doc.fontSize(9).font("Helvetica").fillColor("#444444").text(proj.description, 50, newY, { width: 495 });
    newY = doc.y + 2;
  }
  if (proj.technologies) {
    doc.fontSize(8).fillColor("#999999").text(`Tech: ${proj.technologies}`, 50, newY, { width: 495 });
  }
  return doc.y + 6;
}

function renderSkillItem(doc, skill, y) {
  doc.fontSize(9).font("Helvetica-Bold").fillColor("#000000").text(`${skill.category || ""}: `, 50, y, { continued: true });
  doc.font("Helvetica").fillColor("#444444").text(skill.items ? skill.items.join(", ") : "");
  return doc.y + 4;
}

function renderCertItem(doc, cert, y) {
  doc.fontSize(9).font("Helvetica").fillColor("#444444").text(`${cert.name || ""} - ${cert.issuer || ""} (${cert.date || ""})`, 50, y, { width: 495 });
  return doc.y + 4;
}

function renderAchievementItem(doc, ach, y) {
  doc.fontSize(9).font("Helvetica-Bold").fillColor("#000000").text(`${ach.title || ""}: `, 50, y, { continued: true });
  doc.font("Helvetica").fillColor("#444444").text(ach.description || "");
  return doc.y + 4;
}

function renderRespItem(doc, resp, y) {
  doc.fontSize(9).font("Helvetica").fillColor("#444444").text(`${resp.role || ""} at ${resp.organization || ""}`, 50, y, { width: 495 });
  return doc.y + 4;
}

function renderLanguageItem(doc, lang, y) {
  doc.fontSize(9).font("Helvetica").fillColor("#444444").text(`${lang.name || ""} (${lang.proficiency || ""})`, 50, y, { width: 495 });
  return doc.y + 4;
}

function renderInterestItem(doc, interest, y) {
  doc.fontSize(9).font("Helvetica").fillColor("#444444").text(interest.name || "", 50, y, { width: 495 });
  return doc.y + 4;
}

/**
 * Express handler for PDF generation.
 */
async function generatePdf(req, res) {
  try {
    const { resumeData, template = "classic" } = req.body;

    if (!resumeData || typeof resumeData !== "object") {
      return res.status(400).json({ error: "resumeData is required." });
    }

    const allowedTemplates = ["classic", "modern", "compact"];
    if (!allowedTemplates.includes(template)) {
      return res.status(400).json({ error: `template must be one of: ${allowedTemplates.join(", ")}` });
    }

    const pdfBuffer = await generateResumePdf(resumeData, template);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="resume_${template}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "Failed to generate PDF." });
  }
}

module.exports = { generatePdf };
