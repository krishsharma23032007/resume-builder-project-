import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from "docx";
import { saveAs } from "file-saver";
import type { ResumeData } from "@/types/resume";

type DocxExportProps = {
  data: ResumeData;
  className?: string;
};

function createSection(title: string, children: Paragraph[]) {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 20,
          font: "Arial"
        })
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 }
    }),
    ...children
  ];
}

function createExperienceParagraphs(experience: ResumeData["experience"]) {
  return experience.flatMap((exp) => [
    new Paragraph({
      children: [
        new TextRun({ text: exp.title, bold: true, size: 20, font: "Arial" }),
        new TextRun({ text: ` - ${exp.company}`, size: 20, font: "Arial" }),
        new TextRun({ text: exp.location ? `, ${exp.location}` : "", size: 20, font: "Arial" })
      ],
      spacing: { before: 120 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `${exp.startDate} - ${exp.endDate}`, italics: true, size: 18, font: "Arial", color: "666666" })
      ]
    }),
    ...(exp.description ? [new Paragraph({
      children: [new TextRun({ text: exp.description, size: 20, font: "Arial" })],
      spacing: { before: 60 }
    })] : []),
    ...exp.bullets.filter(Boolean).map((bullet) =>
      new Paragraph({
        children: [new TextRun({ text: `• ${bullet}`, size: 20, font: "Arial" })],
        indent: { left: 360 },
        spacing: { before: 40 }
      })
    )
  ]);
}

function createEducationParagraphs(education: ResumeData["education"]) {
  return education.flatMap((edu) => [
    new Paragraph({
      children: [
        new TextRun({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`, bold: true, size: 20, font: "Arial" })
      ],
      spacing: { before: 120 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: edu.institution, size: 20, font: "Arial" }),
        new TextRun({ text: ` | ${edu.startDate} - ${edu.endDate}`, size: 18, font: "Arial", color: "666666" })
      ]
    }),
    ...(edu.gpa ? [new Paragraph({
      children: [new TextRun({ text: `GPA: ${edu.gpa}`, size: 18, font: "Arial", color: "666666" })]
    })] : [])
  ]);
}

function createProjectsParagraphs(projects: ResumeData["projects"]) {
  return projects.flatMap((proj) => [
    new Paragraph({
      children: [
        new TextRun({ text: proj.name, bold: true, size: 20, font: "Arial" })
      ],
      spacing: { before: 120 }
    }),
    new Paragraph({
      children: [new TextRun({ text: proj.description, size: 20, font: "Arial" })]
    }),
    ...(proj.technologies ? [new Paragraph({
      children: [new TextRun({ text: `Technologies: ${proj.technologies}`, italics: true, size: 18, font: "Arial", color: "666666" })]
    })] : [])
  ]);
}

function createSkillsParagraphs(skills: ResumeData["skills"]) {
  return skills.map((skill) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${skill.category}: `, bold: true, size: 20, font: "Arial" }),
        new TextRun({ text: skill.items.join(", "), size: 20, font: "Arial" })
      ],
      spacing: { before: 60 }
    })
  );
}

function createCertificationsParagraphs(certifications: ResumeData["certifications"]) {
  return certifications.map((cert) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${cert.name}`, bold: true, size: 20, font: "Arial" }),
        new TextRun({ text: ` - ${cert.issuer} (${cert.date})`, size: 20, font: "Arial" })
      ],
      spacing: { before: 60 }
    })
  );
}

function createAchievementsParagraphs(achievements: ResumeData["achievements"]) {
  return achievements.map((ach) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${ach.title}: `, bold: true, size: 20, font: "Arial" }),
        new TextRun({ text: ach.description, size: 20, font: "Arial" })
      ],
      spacing: { before: 60 }
    })
  );
}

function createResponsibilitiesParagraphs(responsibilities: ResumeData["responsibilities"]) {
  return responsibilities.map((resp) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${resp.role}`, bold: true, size: 20, font: "Arial" }),
        new TextRun({ text: ` at ${resp.organization}`, size: 20, font: "Arial" })
      ],
      spacing: { before: 60 }
    })
  );
}

function createLanguagesParagraphs(languages: ResumeData["languages"]) {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: languages.map((l) => `${l.name} (${l.proficiency})`).join(", "),
          size: 20,
          font: "Arial"
        })
      ],
      spacing: { before: 60 }
    })
  ];
}

function createInterestsParagraphs(interests: ResumeData["interests"]) {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: interests.map((i) => i.name).join(", "),
          size: 20,
          font: "Arial"
        })
      ],
      spacing: { before: 60 }
    })
  ];
}

export function ResumeDocxExport({ data, className }: DocxExportProps) {
  async function handleExport() {
    const contactParts = [data.personal.email, data.personal.phone, data.personal.location].filter(Boolean);

    const sections = [
      // Header
      new Paragraph({
        children: [
          new TextRun({ text: data.personal.name || "Your Name", bold: true, size: 32, font: "Arial" })
        ],
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        children: [
          new TextRun({ text: data.personal.role || "Target Role", size: 24, font: "Arial", color: "666666" })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: contactParts.join(" | "), size: 18, font: "Arial", color: "999999" })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 }
      }),

      // Summary
      ...(data.personal.summary ? [
        new Paragraph({
          children: [new TextRun({ text: data.personal.summary, size: 20, font: "Arial" })],
          spacing: { before: 120, after: 240 }
        })
      ] : []),

      // Education
      ...createSection("Education", createEducationParagraphs(data.education)),

      // Experience
      ...createSection("Experience", createExperienceParagraphs(data.experience)),

      // Projects
      ...createSection("Projects", createProjectsParagraphs(data.projects)),

      // Skills
      ...createSection("Skills", createSkillsParagraphs(data.skills)),

      // Certifications
      ...createSection("Certifications", createCertificationsParagraphs(data.certifications)),

      // Achievements
      ...createSection("Achievements", createAchievementsParagraphs(data.achievements)),

      // Positions of Responsibility
      ...createSection("Positions of Responsibility", createResponsibilitiesParagraphs(data.responsibilities)),

      // Languages
      ...createSection("Languages", createLanguagesParagraphs(data.languages)),

      // Interests
      ...createSection("Interests", createInterestsParagraphs(data.interests))
    ];

    const doc = new Document({
      sections: [{
        properties: {},
        children: sections
      }]
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${data.personal.name || "Resume"}.docx`;
    saveAs(blob, fileName);
  }

  return (
    <button
      className={className}
      onClick={handleExport}
      type="button"
    >
      Export DOCX
    </button>
  );
}
