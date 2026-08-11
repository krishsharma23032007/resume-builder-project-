const PDFDocument = require("pdfkit");
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, TabStopType, TabStopPosition } = require("docx");

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
      } else if (template === "executive") {
        renderExecutiveTemplate(doc, resumeData);
      } else if (template === "creative") {
        renderCreativeTemplate(doc, resumeData);
      } else if (template === "technical") {
        renderTechnicalTemplate(doc, resumeData);
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

// Executive Template - Clean, professional, serif fonts
function renderExecutiveTemplate(doc, data) {
  const { personal, education, experience, projects, skills, certifications, achievements, responsibilities, languages, interests } = data;
  let y = 50;

  // Header - elegant centered
  doc.fontSize(24).font("Times-Bold").text(personal.name || "Your Name", 50, y, { align: "center" });
  y += 30;
  doc.fontSize(12).font("Times-Italic").fillColor("#555555").text(personal.role || "Target Role", 50, y, { align: "center" });
  y += 20;

  const contactParts = [personal.email, personal.phone, personal.location].filter(Boolean);
  if (contactParts.length > 0) {
    doc.fontSize(9).font("Times-Roman").fillColor("#777777").text(contactParts.join("  |  "), 50, y, { align: "center" });
    y += 15;
  }

  // Double line divider
  doc.moveTo(100, y).lineTo(495, y).lineWidth(2).stroke("#333333");
  doc.moveTo(100, y + 4).lineTo(495, y + 4).lineWidth(0.5).stroke("#333333");
  doc.lineWidth(1);
  y += 15;

  // Summary
  if (personal.summary) {
    doc.fontSize(10).font("Times-Roman").fillColor("#444444").text(personal.summary, 70, y, { width: 455, lineGap: 4, align: "justify" });
    y = doc.y + 12;
  }

  // Education
  if (education && education.length > 0) {
    y = renderExecutiveSectionHeader(doc, "EDUCATION", y);
    for (const edu of education) {
      doc.fontSize(11).font("Times-Bold").fillColor("#000000").text(`${edu.degree || ""} ${edu.field ? `in ${edu.field}` : ""}`, 70, y, { width: 380 });
      doc.fontSize(10).font("Times-Italic").fillColor("#555555").text(edu.institution || "", 70, doc.y);
      if (edu.startDate || edu.endDate) {
        doc.fontSize(9).font("Times-Roman").fillColor("#777777").text(`${edu.startDate || ""} - ${edu.endDate || ""}`, 430, y, { width: 115, align: "right" });
      }
      if (edu.gpa) {
        doc.fontSize(9).fillColor("#777777").text(`GPA: ${edu.gpa}`, 70, doc.y);
      }
      y = doc.y + 8;
    }
  }

  // Experience
  if (experience && experience.length > 0) {
    y = renderExecutiveSectionHeader(doc, "PROFESSIONAL EXPERIENCE", y);
    for (const exp of experience) {
      doc.fontSize(11).font("Times-Bold").fillColor("#000000").text(exp.title || "", 70, y, { width: 380 });
      doc.fontSize(10).font("Times-Italic").fillColor("#555555").text(`${exp.company || ""}${exp.location ? `, ${exp.location}` : ""}`, 70, doc.y);
      if (exp.startDate || exp.endDate) {
        doc.fontSize(9).font("Times-Roman").fillColor("#777777").text(`${exp.startDate || ""} - ${exp.endDate || ""}`, 430, y, { width: 115, align: "right" });
      }
      y = doc.y + 3;
      if (exp.description) {
        doc.fontSize(10).fillColor("#444444").text(exp.description, 70, y, { width: 455 });
        y = doc.y + 3;
      }
      if (exp.bullets) {
        for (const bullet of exp.bullets.filter(Boolean)) {
          doc.fontSize(10).fillColor("#444444").text(`•  ${bullet}`, 80, y, { width: 445 });
          y = doc.y + 2;
        }
      }
      y = doc.y + 8;
    }
  }

  // Projects
  if (projects && projects.length > 0) {
    y = renderExecutiveSectionHeader(doc, "PROJECTS", y);
    for (const proj of projects) {
      doc.fontSize(11).font("Times-Bold").fillColor("#000000").text(proj.name || "", 70, y, { width: 380 });
      y = doc.y + 2;
      if (proj.description) {
        doc.fontSize(10).font("Times-Roman").fillColor("#444444").text(proj.description, 70, y, { width: 455 });
        y = doc.y + 2;
      }
      if (proj.technologies) {
        doc.fontSize(9).fillColor("#777777").text(`Technologies: ${proj.technologies}`, 70, y, { width: 455 });
        y = doc.y + 2;
      }
      y = doc.y + 6;
    }
  }

  // Skills
  if (skills && skills.length > 0) {
    y = renderExecutiveSectionHeader(doc, "CORE COMPETENCIES", y);
    for (const skill of skills) {
      doc.fontSize(10).font("Times-Bold").fillColor("#000000").text(`${skill.category || ""}: `, 70, y, { continued: true });
      doc.font("Times-Roman").fillColor("#444444").text(skill.items ? skill.items.join(", ") : "");
      y = doc.y + 4;
    }
    y += 5;
  }

  // Certifications
  if (certifications && certifications.length > 0) {
    y = renderExecutiveSectionHeader(doc, "CERTIFICATIONS", y);
    for (const cert of certifications) {
      doc.fontSize(10).font("Times-Roman").fillColor("#444444").text(`${cert.name || ""} - ${cert.issuer || ""} (${cert.date || ""})`, 70, y, { width: 455 });
      y = doc.y + 4;
    }
    y += 5;
  }

  // Achievements
  if (achievements && achievements.length > 0) {
    y = renderExecutiveSectionHeader(doc, "ACHIEVEMENTS", y);
    for (const ach of achievements) {
      doc.fontSize(10).font("Times-Bold").fillColor("#000000").text(`${ach.title || ""}: `, 70, y, { continued: true });
      doc.font("Times-Roman").fillColor("#444444").text(ach.description || "");
      y = doc.y + 4;
    }
    y += 5;
  }

  // Positions of Responsibility
  if (responsibilities && responsibilities.length > 0) {
    y = renderExecutiveSectionHeader(doc, "LEADERSHIP", y);
    for (const resp of responsibilities) {
      doc.fontSize(10).font("Times-Roman").fillColor("#444444").text(`${resp.role || ""} at ${resp.organization || ""}`, 70, y, { width: 455 });
      y = doc.y + 4;
    }
    y += 5;
  }

  // Languages
  if (languages && languages.length > 0) {
    y = renderExecutiveSectionHeader(doc, "LANGUAGES", y);
    doc.fontSize(10).font("Times-Roman").fillColor("#444444").text(
      languages.map(l => `${l.name || ""} (${l.proficiency || ""})`).join(", "),
      70, y, { width: 455 }
    );
    y = doc.y + 10;
  }

  // Interests
  if (interests && interests.length > 0) {
    y = renderExecutiveSectionHeader(doc, "INTERESTS", y);
    doc.fontSize(10).font("Times-Roman").fillColor("#444444").text(
      interests.map(i => i.name || "").join(", "),
      70, y, { width: 455 }
    );
  }
}

function renderExecutiveSectionHeader(doc, title, y) {
  doc.fontSize(10).font("Times-Bold").fillColor("#333333").text(title, 70, y);
  doc.moveTo(70, doc.y + 2).lineTo(525, doc.y + 2).lineWidth(1.5).stroke("#333333");
  doc.lineWidth(1);
  return doc.y + 10;
}

// Creative Template - Bold colors, modern layout
function renderCreativeTemplate(doc, data) {
  const { personal, education, experience, projects, skills, certifications, achievements, responsibilities, languages, interests } = data;
  let y = 40;

  // Left sidebar background
  doc.rect(0, 0, 180, 842).fill("#2d3748");

  // Name in sidebar
  doc.fontSize(18).font("Helvetica-Bold").fillColor("#ffffff").text(personal.name || "Your Name", 20, y, { width: 140 });
  y += 30;
  doc.fontSize(10).font("Helvetica").fillColor("#a0aec0").text(personal.role || "Target Role", 20, y, { width: 140 });
  y += 25;

  // Contact in sidebar
  const contactParts = [personal.email, personal.phone, personal.location].filter(Boolean);
  if (contactParts.length > 0) {
    doc.fontSize(8).fillColor("#cbd5e0").text("CONTACT", 20, y, { width: 140 });
    y += 12;
    for (const part of contactParts) {
      doc.fontSize(8).fillColor("#e2e8f0").text(part, 20, y, { width: 140 });
      y += 12;
    }
    y += 5;
  }

  // Skills in sidebar
  if (skills && skills.length > 0) {
    doc.fontSize(8).fillColor("#cbd5e0").text("SKILLS", 20, y, { width: 140 });
    y += 12;
    for (const skill of skills) {
      doc.fontSize(8).font("Helvetica-Bold").fillColor("#e2e8f0").text(skill.category || "", 20, y, { width: 140 });
      y += 10;
      if (skill.items) {
        doc.fontSize(7).font("Helvetica").fillColor("#a0aec0").text(skill.items.join(", "), 20, y, { width: 140 });
        y = doc.y + 5;
      }
    }
    y += 5;
  }

  // Languages in sidebar
  if (languages && languages.length > 0) {
    doc.fontSize(8).fillColor("#cbd5e0").text("LANGUAGES", 20, y, { width: 140 });
    y += 12;
    for (const lang of languages) {
      doc.fontSize(8).fillColor("#e2e8f0").text(`${lang.name || ""} - ${lang.proficiency || ""}`, 20, y, { width: 140 });
      y += 10;
    }
  }

  // Main content area
  let mainY = 40;
  const mainX = 200;

  // Summary
  if (personal.summary) {
    doc.fontSize(9).font("Helvetica").fillColor("#4a5568").text(personal.summary, mainX, mainY, { width: 355, lineGap: 3 });
    mainY = doc.y + 12;
  }

  // Experience
  if (experience && experience.length > 0) {
    mainY = renderCreativeSectionHeader(doc, "EXPERIENCE", mainX, mainY);
    for (const exp of experience) {
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#1a202c").text(exp.title || "", mainX, mainY, { width: 300 });
      doc.fontSize(9).font("Helvetica").fillColor("#718096").text(`${exp.company || ""}${exp.location ? `, ${exp.location}` : ""}`, mainX, doc.y);
      if (exp.startDate || exp.endDate) {
        doc.fontSize(8).fillColor("#a0aec0").text(`${exp.startDate || ""} - ${exp.endDate || ""}`, mainX + 280, mainY, { width: 75, align: "right" });
      }
      mainY = doc.y + 2;
      if (exp.bullets) {
        for (const bullet of exp.bullets.filter(Boolean)) {
          doc.fontSize(8).fillColor("#4a5568").text(`• ${bullet}`, mainX + 10, mainY, { width: 345 });
          mainY = doc.y + 1;
        }
      }
      mainY = doc.y + 6;
    }
  }

  // Education
  if (education && education.length > 0) {
    mainY = renderCreativeSectionHeader(doc, "EDUCATION", mainX, mainY);
    for (const edu of education) {
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#1a202c").text(`${edu.degree || ""} ${edu.field ? `in ${edu.field}` : ""}`, mainX, mainY, { width: 300 });
      doc.fontSize(9).font("Helvetica").fillColor("#718096").text(edu.institution || "", mainX, doc.y);
      if (edu.startDate || edu.endDate) {
        doc.fontSize(8).fillColor("#a0aec0").text(`${edu.startDate || ""} - ${edu.endDate || ""}`, mainX + 280, mainY, { width: 75, align: "right" });
      }
      mainY = doc.y + 6;
    }
  }

  // Projects
  if (projects && projects.length > 0) {
    mainY = renderCreativeSectionHeader(doc, "PROJECTS", mainX, mainY);
    for (const proj of projects) {
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#1a202c").text(proj.name || "", mainX, mainY, { width: 355 });
      mainY = doc.y + 2;
      if (proj.description) {
        doc.fontSize(8).fillColor("#4a5568").text(proj.description, mainX, mainY, { width: 355 });
        mainY = doc.y + 2;
      }
      mainY = doc.y + 4;
    }
  }

  // Other sections
  const otherSections = [
    { title: "CERTIFICATIONS", items: certifications, text: (c) => `${c.name || ""} - ${c.issuer || ""}` },
    { title: "ACHIEVEMENTS", items: achievements, text: (a) => `${a.title || ""}: ${a.description || ""}` },
    { title: "LEADERSHIP", items: responsibilities, text: (r) => `${r.role || ""} at ${r.organization || ""}` }
  ];

  for (const section of otherSections) {
    if (section.items && section.items.length > 0) {
      mainY = renderCreativeSectionHeader(doc, section.title, mainX, mainY);
      for (const item of section.items) {
        doc.fontSize(8).fillColor("#4a5568").text(section.text(item), mainX, mainY, { width: 355 });
        mainY = doc.y + 3;
      }
      mainY += 5;
    }
  }
}

function renderCreativeSectionHeader(doc, title, x, y) {
  doc.fontSize(9).font("Helvetica-Bold").fillColor("#2d3748").text(title, x, y);
  doc.moveTo(x, doc.y + 2).lineTo(x + 355, doc.y + 2).lineWidth(2).strokeColor("#4299e1").stroke();
  doc.lineWidth(1).strokeColor("#000000");
  return doc.y + 8;
}

// Technical Template - Developer-focused, clean
function renderTechnicalTemplate(doc, data) {
  const { personal, education, experience, projects, skills, certifications, achievements, responsibilities, languages, interests } = data;
  let y = 40;

  // Header with code-like styling
  doc.fontSize(20).font("Courier-Bold").fillColor("#000000").text(`> ${personal.name || "Your Name"}`, 50, y);
  y += 25;
  doc.fontSize(11).font("Courier").fillColor("#0066cc").text(personal.role || "Target Role", 50, y);
  y += 18;

  const contactParts = [personal.email, personal.phone, personal.location].filter(Boolean);
  if (contactParts.length > 0) {
    doc.fontSize(8).font("Courier").fillColor("#666666").text(`// ${contactParts.join(" | ")}`, 50, y);
    y += 15;
  }

  doc.moveTo(50, y).lineTo(545, y).stroke("#cccccc");
  y += 12;

  // Summary
  if (personal.summary) {
    doc.fontSize(9).font("Courier").fillColor("#333333").text(`/* ${personal.summary} */`, 50, y, { width: 495, lineGap: 3 });
    y = doc.y + 12;
  }

  // Skills - prominent display
  if (skills && skills.length > 0) {
    y = renderTechnicalSectionHeader(doc, "TECHNICAL SKILLS", y);
    for (const skill of skills) {
      doc.fontSize(9).font("Courier-Bold").fillColor("#000000").text(`${skill.category || ""}: `, 50, y, { continued: true });
      doc.font("Courier").fillColor("#0066cc").text(skill.items ? skill.items.join(", ") : "");
      y = doc.y + 3;
    }
    y += 5;
  }

  // Experience
  if (experience && experience.length > 0) {
    y = renderTechnicalSectionHeader(doc, "EXPERIENCE", y);
    for (const exp of experience) {
      doc.fontSize(10).font("Courier-Bold").fillColor("#000000").text(exp.title || "", 50, y, { width: 400 });
      doc.fontSize(9).font("Courier").fillColor("#666666").text(`${exp.company || ""}${exp.location ? ` // ${exp.location}` : ""}`, 50, doc.y);
      if (exp.startDate || exp.endDate) {
        doc.fontSize(8).fillColor("#999999").text(`${exp.startDate || ""} - ${exp.endDate || ""}`, 450, y, { width: 95, align: "right" });
      }
      y = doc.y + 3;
      if (exp.description) {
        doc.fontSize(9).fillColor("#333333").text(exp.description, 50, y, { width: 495 });
        y = doc.y + 3;
      }
      if (exp.bullets) {
        for (const bullet of exp.bullets.filter(Boolean)) {
          doc.fontSize(9).fillColor("#333333").text(`  - ${bullet}`, 60, y, { width: 485 });
          y = doc.y + 2;
        }
      }
      y = doc.y + 8;
    }
  }

  // Projects
  if (projects && projects.length > 0) {
    y = renderTechnicalSectionHeader(doc, "PROJECTS", y);
    for (const proj of projects) {
      doc.fontSize(10).font("Courier-Bold").fillColor("#000000").text(`[Project] ${proj.name || ""}`, 50, y, { width: 400 });
      y = doc.y + 2;
      if (proj.description) {
        doc.fontSize(9).font("Courier").fillColor("#333333").text(proj.description, 50, y, { width: 495 });
        y = doc.y + 2;
      }
      if (proj.technologies) {
        doc.fontSize(8).fillColor("#0066cc").text(`Stack: ${proj.technologies}`, 50, y, { width: 495 });
        y = doc.y + 2;
      }
      y = doc.y + 6;
    }
  }

  // Education
  if (education && education.length > 0) {
    y = renderTechnicalSectionHeader(doc, "EDUCATION", y);
    for (const edu of education) {
      doc.fontSize(10).font("Courier-Bold").fillColor("#000000").text(`${edu.degree || ""} ${edu.field ? `in ${edu.field}` : ""}`, 50, y, { width: 400 });
      doc.fontSize(9).font("Courier").fillColor("#666666").text(edu.institution || "", 50, doc.y);
      if (edu.startDate || edu.endDate) {
        doc.fontSize(8).fillColor("#999999").text(`${edu.startDate || ""} - ${edu.endDate || ""}`, 450, y, { width: 95, align: "right" });
      }
      y = doc.y + 6;
    }
  }

  // Certifications
  if (certifications && certifications.length > 0) {
    y = renderTechnicalSectionHeader(doc, "CERTIFICATIONS", y);
    for (const cert of certifications) {
      doc.fontSize(9).font("Courier").fillColor("#333333").text(`[Cert] ${cert.name || ""} - ${cert.issuer || ""} (${cert.date || ""})`, 50, y, { width: 495 });
      y = doc.y + 4;
    }
    y += 5;
  }

  // Achievements
  if (achievements && achievements.length > 0) {
    y = renderTechnicalSectionHeader(doc, "ACHIEVEMENTS", y);
    for (const ach of achievements) {
      doc.fontSize(9).font("Courier").fillColor("#333333").text(`[!] ${ach.title || ""}: ${ach.description || ""}`, 50, y, { width: 495 });
      y = doc.y + 4;
    }
    y += 5;
  }

  // Other sections
  if (responsibilities && responsibilities.length > 0) {
    y = renderTechnicalSectionHeader(doc, "LEADERSHIP", y);
    for (const resp of responsibilities) {
      doc.fontSize(9).font("Courier").fillColor("#333333").text(`${resp.role || ""} @ ${resp.organization || ""}`, 50, y, { width: 495 });
      y = doc.y + 4;
    }
    y += 5;
  }

  if (languages && languages.length > 0) {
    y = renderTechnicalSectionHeader(doc, "LANGUAGES", y);
    doc.fontSize(9).font("Courier").fillColor("#333333").text(
      languages.map(l => `${l.name || ""}(${l.proficiency || ""})`).join(", "),
      50, y, { width: 495 }
    );
    y = doc.y + 10;
  }

  if (interests && interests.length > 0) {
    y = renderTechnicalSectionHeader(doc, "INTERESTS", y);
    doc.fontSize(9).font("Courier").fillColor("#333333").text(
      interests.map(i => i.name || "").join(", "),
      50, y, { width: 495 }
    );
  }
}

function renderTechnicalSectionHeader(doc, title, y) {
  doc.fontSize(9).font("Courier-Bold").fillColor("#0066cc").text(`## ${title}`, 50, y);
  doc.moveTo(50, doc.y + 2).lineTo(545, doc.y + 2).stroke("#0066cc");
  return doc.y + 8;
}

/**
 * Generates a DOCX resume based on the provided data and template.
 */
async function generateResumeDocx(resumeData, template = "classic") {
  const { personal, education, experience, projects, skills, certifications, achievements, responsibilities, languages, interests } = resumeData;

  const children = [];

  // Header
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: personal.name || "Your Name",
          bold: true,
          size: 48,
          font: "Calibri"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: personal.role || "Target Role",
          size: 24,
          color: "666666",
          font: "Calibri"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    })
  );

  const contactParts = [personal.email, personal.phone, personal.location].filter(Boolean);
  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join(" | "),
            size: 18,
            color: "999999",
            font: "Calibri"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      })
    );
  }

  // Divider
  children.push(
    new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
      },
      spacing: { after: 200 }
    })
  );

  // Summary
  if (personal.summary) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: personal.summary,
            size: 20,
            font: "Calibri",
            color: "444444"
          })
        ],
        spacing: { after: 200 }
      })
    );
  }

  // Helper to add section
  function addSection(title, items, renderItem) {
    if (!items || items.length === 0) return;
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 22,
            font: "Calibri"
          })
        ],
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
        },
        spacing: { before: 200, after: 100 }
      })
    );
    for (const item of items) {
      renderItem(item);
    }
  }

  // Education
  addSection("Education", education, (edu) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${edu.degree || ""} ${edu.field ? `in ${edu.field}` : ""}`,
            bold: true,
            size: 20,
            font: "Calibri"
          }),
          new TextRun({
            text: edu.startDate || edu.endDate ? `  (${edu.startDate || ""} - ${edu.endDate || ""})` : "",
            size: 18,
            color: "999999",
            font: "Calibri"
          })
        ],
        spacing: { after: 50 }
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: edu.institution || "",
            size: 20,
            color: "666666",
            font: "Calibri"
          })
        ],
        spacing: { after: 100 }
      })
    );
    if (edu.gpa) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `GPA: ${edu.gpa}`,
              size: 18,
              color: "999999",
              font: "Calibri"
            })
          ],
          spacing: { after: 100 }
        })
      );
    }
  });

  // Experience
  addSection("Experience", experience, (exp) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: exp.title || "",
            bold: true,
            size: 20,
            font: "Calibri"
          }),
          new TextRun({
            text: exp.startDate || exp.endDate ? `  (${exp.startDate || ""} - ${exp.endDate || ""})` : "",
            size: 18,
            color: "999999",
            font: "Calibri"
          })
        ],
        spacing: { after: 50 }
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${exp.company || ""}${exp.location ? `, ${exp.location}` : ""}`,
            size: 20,
            color: "666666",
            font: "Calibri"
          })
        ],
        spacing: { after: 50 }
      })
    );
    if (exp.description) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.description,
              size: 20,
              color: "444444",
              font: "Calibri"
            })
          ],
          spacing: { after: 50 }
        })
      );
    }
    if (exp.bullets) {
      for (const bullet of exp.bullets.filter(Boolean)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${bullet}`,
                size: 20,
                color: "444444",
                font: "Calibri"
              })
            ],
            indent: { left: 360 },
            spacing: { after: 30 }
          })
        );
      }
    }
    children.push(new Paragraph({ spacing: { after: 100 } }));
  });

  // Projects
  addSection("Projects", projects, (proj) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: proj.name || "",
            bold: true,
            size: 20,
            font: "Calibri"
          })
        ],
        spacing: { after: 50 }
      })
    );
    if (proj.description) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: proj.description,
              size: 20,
              color: "444444",
              font: "Calibri"
            })
          ],
          spacing: { after: 50 }
        })
      );
    }
    if (proj.technologies) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Technologies: ${proj.technologies}`,
              size: 18,
              color: "999999",
              font: "Calibri"
            })
          ],
          spacing: { after: 100 }
        })
      );
    }
  });

  // Skills
  addSection("Skills", skills, (skill) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${skill.category || ""}: `,
            bold: true,
            size: 20,
            font: "Calibri"
          }),
          new TextRun({
            text: skill.items ? skill.items.join(", ") : "",
            size: 20,
            color: "444444",
            font: "Calibri"
          })
        ],
        spacing: { after: 50 }
      })
    );
  });
  children.push(new Paragraph({ spacing: { after: 100 } }));

  // Certifications
  addSection("Certifications", certifications, (cert) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${cert.name || ""} - ${cert.issuer || ""} (${cert.date || ""})`,
            size: 20,
            color: "444444",
            font: "Calibri"
          })
        ],
        spacing: { after: 50 }
      })
    );
  });
  children.push(new Paragraph({ spacing: { after: 100 } }));

  // Achievements
  addSection("Achievements", achievements, (ach) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${ach.title || ""}: `,
            bold: true,
            size: 20,
            font: "Calibri"
          }),
          new TextRun({
            text: ach.description || "",
            size: 20,
            color: "444444",
            font: "Calibri"
          })
        ],
        spacing: { after: 50 }
      })
    );
  });
  children.push(new Paragraph({ spacing: { after: 100 } }));

  // Positions of Responsibility
  addSection("Positions of Responsibility", responsibilities, (resp) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${resp.role || ""} at ${resp.organization || ""}`,
            size: 20,
            color: "444444",
            font: "Calibri"
          })
        ],
        spacing: { after: 50 }
      })
    );
  });
  children.push(new Paragraph({ spacing: { after: 100 } }));

  // Languages
  if (languages && languages.length > 0) {
    addSection("Languages", [{}], () => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: languages.map(l => `${l.name || ""} (${l.proficiency || ""})`).join(", "),
              size: 20,
              color: "444444",
              font: "Calibri"
            })
          ],
          spacing: { after: 100 }
        })
      );
    });
  }

  // Interests
  if (interests && interests.length > 0) {
    addSection("Interests", [{}], () => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: interests.map(i => i.name || "").join(", "),
              size: 20,
              color: "444444",
              font: "Calibri"
            })
          ],
          spacing: { after: 100 }
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              bottom: 720,
              left: 900,
              right: 900
            }
          }
        },
        children
      }
    ]
  });

  return Packer.toBuffer(doc);
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

    const allowedTemplates = ["classic", "modern", "compact", "executive", "creative", "technical"];
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

/**
 * Express handler for DOCX generation.
 */
async function generateDocx(req, res) {
  try {
    const { resumeData, template = "classic" } = req.body;

    if (!resumeData || typeof resumeData !== "object") {
      return res.status(400).json({ error: "resumeData is required." });
    }

    const allowedTemplates = ["classic", "modern", "compact", "executive", "creative", "technical"];
    if (!allowedTemplates.includes(template)) {
      return res.status(400).json({ error: `template must be one of: ${allowedTemplates.join(", ")}` });
    }

    const docxBuffer = await generateResumeDocx(resumeData, template);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename="resume_${template}.docx"`);
    res.send(docxBuffer);
  } catch (error) {
    console.error("DOCX generation error:", error);
    res.status(500).json({ error: "Failed to generate DOCX." });
  }
}

module.exports = { generatePdf, generateDocx };
