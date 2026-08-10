import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";

const colors = {
  black: "#1a1a1a",
  gray: "#666666",
  lightGray: "#999999",
  accent: "#2563eb",
  white: "#ffffff"
};

type TemplateType = "classic" | "modern" | "compact" | "executive" | "minimal" | "creative" | "technical";

// Classic Template Styles
const classicStyles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica", fontSize: 10, color: colors.black },
  header: { textAlign: "center", borderBottom: 1, borderBottomColor: colors.black, paddingBottom: 10, marginBottom: 15 },
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  role: { fontSize: 12, color: colors.gray, marginBottom: 6 },
  contact: { fontSize: 8, color: colors.lightGray, flexDirection: "row", justifyContent: "center", gap: 10 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 10, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, borderBottom: 0.5, borderBottomColor: colors.black, paddingBottom: 3, marginBottom: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  bold: { fontWeight: "bold" },
  text: { fontSize: 9, color: colors.gray, lineHeight: 1.4 },
  bullet: { fontSize: 9, color: colors.gray, marginLeft: 10, marginBottom: 1 },
  summary: { fontSize: 9, color: colors.gray, lineHeight: 1.5, marginBottom: 10 }
});

// Modern Template Styles
const modernStyles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica", fontSize: 10, color: colors.black },
  header: { borderLeft: 3, borderLeftColor: colors.accent, paddingLeft: 12, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  role: { fontSize: 12, color: colors.accent, marginBottom: 6 },
  contact: { fontSize: 8, color: colors.lightGray, flexDirection: "row", gap: 10 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 10, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, color: colors.accent, borderBottom: 0.5, borderBottomColor: colors.accent, paddingBottom: 3, marginBottom: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  bold: { fontWeight: "bold" },
  text: { fontSize: 9, color: colors.gray, lineHeight: 1.4 },
  bullet: { fontSize: 9, color: colors.gray, marginLeft: 10, marginBottom: 1 },
  summary: { fontSize: 9, color: colors.gray, lineHeight: 1.5, fontStyle: "italic", marginBottom: 10 }
});

// Compact Template Styles
const compactStyles = StyleSheet.create({
  page: { padding: 20, fontFamily: "Helvetica", fontSize: 9, color: colors.black },
  header: { textAlign: "center", borderBottom: 0.5, borderBottomColor: colors.black, paddingBottom: 6, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: "bold", marginBottom: 2 },
  role: { fontSize: 10, color: colors.gray, marginBottom: 4 },
  contact: { fontSize: 7, color: colors.lightGray, flexDirection: "row", justifyContent: "center", gap: 8 },
  section: { marginBottom: 8 },
  sectionTitle: { fontSize: 8, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, borderBottom: 0.5, borderBottomColor: colors.black, paddingBottom: 2, marginBottom: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  bold: { fontWeight: "bold" },
  text: { fontSize: 8, color: colors.gray, lineHeight: 1.3 },
  bullet: { fontSize: 8, color: colors.gray, marginLeft: 8, marginBottom: 0.5 },
  summary: { fontSize: 8, color: colors.gray, lineHeight: 1.3, marginBottom: 6 }
});

// Executive Template Styles
const executiveStyles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: colors.black },
  header: { borderBottom: 2, borderBottomColor: "#1e3a5f", paddingBottom: 15, marginBottom: 20 },
  name: { fontSize: 28, fontWeight: "bold", color: "#1e3a5f", marginBottom: 6 },
  role: { fontSize: 14, color: colors.gray, marginBottom: 8 },
  contact: { fontSize: 9, color: colors.lightGray, flexDirection: "row", gap: 12 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 2, color: "#1e3a5f", borderBottom: 1, borderBottomColor: "#1e3a5f", paddingBottom: 4, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  bold: { fontWeight: "bold", color: "#1e3a5f" },
  text: { fontSize: 10, color: colors.gray, lineHeight: 1.5 },
  bullet: { fontSize: 10, color: colors.gray, marginLeft: 12, marginBottom: 2 },
  summary: { fontSize: 10, color: colors.gray, lineHeight: 1.6, marginBottom: 12 }
});

// Minimal Template Styles
const minimalStyles = StyleSheet.create({
  page: { padding: 35, fontFamily: "Helvetica", fontSize: 10, color: colors.black },
  header: { marginBottom: 20 },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  role: { fontSize: 12, color: colors.gray, marginBottom: 6 },
  contact: { fontSize: 8, color: colors.lightGray, flexDirection: "row", gap: 10 },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 11, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  bold: { fontWeight: "bold" },
  text: { fontSize: 9, color: colors.gray, lineHeight: 1.4 },
  bullet: { fontSize: 9, color: colors.gray, marginLeft: 10, marginBottom: 1 },
  summary: { fontSize: 9, color: colors.gray, lineHeight: 1.5, marginBottom: 10 }
});

// Creative Template Styles
const creativeStyles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica", fontSize: 10, color: colors.black },
  header: { backgroundColor: "#ff6b6b", padding: 20, marginBottom: 20, borderRadius: 4 },
  name: { fontSize: 24, fontWeight: "bold", color: colors.white, marginBottom: 4 },
  role: { fontSize: 12, color: colors.white, marginBottom: 6 },
  contact: { fontSize: 8, color: colors.white, flexDirection: "row", gap: 10 },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 11, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, color: "#ff6b6b", borderBottom: 1, borderBottomColor: "#ff6b6b", paddingBottom: 3, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  bold: { fontWeight: "bold" },
  text: { fontSize: 9, color: colors.gray, lineHeight: 1.4 },
  bullet: { fontSize: 9, color: colors.gray, marginLeft: 10, marginBottom: 1 },
  summary: { fontSize: 9, color: colors.gray, lineHeight: 1.5, marginBottom: 10 }
});

// Technical Template Styles
const technicalStyles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Courier", fontSize: 9, color: colors.black },
  header: { borderBottom: 1, borderBottomColor: colors.black, paddingBottom: 10, marginBottom: 15 },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  role: { fontSize: 11, color: colors.gray, marginBottom: 6 },
  contact: { fontSize: 8, color: colors.lightGray, flexDirection: "row", gap: 10 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 10, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, borderBottom: 0.5, borderBottomColor: colors.black, paddingBottom: 3, marginBottom: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  bold: { fontWeight: "bold" },
  text: { fontSize: 8, color: colors.gray, lineHeight: 1.3 },
  bullet: { fontSize: 8, color: colors.gray, marginLeft: 8, marginBottom: 0.5 },
  summary: { fontSize: 8, color: colors.gray, lineHeight: 1.3, marginBottom: 8 }
});

function getStyles(template: TemplateType) {
  switch (template) {
    case "modern": return modernStyles;
    case "compact": return compactStyles;
    case "executive": return executiveStyles;
    case "minimal": return minimalStyles;
    case "creative": return creativeStyles;
    case "technical": return technicalStyles;
    default: return classicStyles;
  }
}

function ResumeDocument({ data, template }: { data: ResumeData; template: TemplateType }) {
  const styles = getStyles(template);
  const contactParts = [data.personal.email, data.personal.phone, data.personal.location].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personal.name || "Your Name"}</Text>
          <Text style={styles.role}>{data.personal.role || "Target Role"}</Text>
          {contactParts.length > 0 && (
            <Text style={styles.contact}>{contactParts.join(" | ")}</Text>
          )}
        </View>

        {/* Summary */}
        {data.personal.summary && (
          <Text style={styles.summary}>{data.personal.summary}</Text>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((e) => (
              <View key={e.id} style={{ marginBottom: 6 }}>
                <View style={styles.row}>
                  <Text style={styles.bold}>{e.degree}{e.field ? ` in ${e.field}` : ""}</Text>
                  <Text style={{ fontSize: 8, color: colors.lightGray }}>{e.startDate} - {e.endDate}</Text>
                </View>
                <Text style={styles.text}>{e.institution}</Text>
                {e.gpa && <Text style={{ fontSize: 8, color: colors.lightGray }}>GPA: {e.gpa}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experience.map((e) => (
              <View key={e.id} style={{ marginBottom: 8 }}>
                <View style={styles.row}>
                  <Text style={styles.bold}>{e.title}</Text>
                  <Text style={{ fontSize: 8, color: colors.lightGray }}>{e.startDate} - {e.endDate}</Text>
                </View>
                <Text style={styles.text}>{e.company}{e.location ? `, ${e.location}` : ""}</Text>
                {e.description && <Text style={styles.text}>{e.description}</Text>}
                {e.bullets.filter(Boolean).map((b, i) => (
                  <Text key={i} style={styles.bullet}>• {b}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((p) => (
              <View key={p.id} style={{ marginBottom: 6 }}>
                <Text style={styles.bold}>{p.name}</Text>
                <Text style={styles.text}>{p.description}</Text>
                {p.technologies && <Text style={{ fontSize: 8, color: colors.lightGray }}>Tech: {p.technologies}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {data.skills.map((s) => (
              <Text key={s.id} style={styles.text}>
                <Text style={styles.bold}>{s.category}: </Text>{s.items.join(", ")}
              </Text>
            ))}
          </View>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {data.certifications.map((c) => (
              <Text key={c.id} style={styles.text}>{c.name} - {c.issuer} ({c.date})</Text>
            ))}
          </View>
        )}

        {/* Achievements */}
        {data.achievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            {data.achievements.map((a) => (
              <Text key={a.id} style={styles.text}>
                <Text style={styles.bold}>{a.title}: </Text>{a.description}
              </Text>
            ))}
          </View>
        )}

        {/* Positions of Responsibility */}
        {data.responsibilities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Positions of Responsibility</Text>
            {data.responsibilities.map((r) => (
              <Text key={r.id} style={styles.text}>{r.role} at {r.organization}</Text>
            ))}
          </View>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text style={styles.text}>
              {data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}
            </Text>
          </View>
        )}

        {/* Interests */}
        {data.interests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <Text style={styles.text}>
              {data.interests.map((i) => i.name).join(", ")}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

type ExportButtonProps = {
  data: ResumeData;
  template: TemplateType;
  className?: string;
  useServer?: boolean;
};

export function ResumePdfExport({ data, template, className, useServer = false }: ExportButtonProps) {
  const fileName = `${data.personal.name || "Resume"}_${template}.pdf`;

  if (useServer) {
    return (
      <button
        className={className}
        onClick={async () => {
          try {
            const { resumeService } = await import("@/services/resumeService");
            const blob = await resumeService.generatePdf(data, template);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          } catch (error) {
            console.error("Server PDF generation failed, falling back to client:", error);
          }
        }}
        type="button"
      >
        Export PDF (Server)
      </button>
    );
  }

  return (
    <PDFDownloadLink
      className={className}
      document={<ResumeDocument data={data} template={template} />}
      fileName={fileName}
    >
      {({ loading }) => (loading ? "Generating PDF..." : "Export PDF")}
    </PDFDownloadLink>
  );
}

export { ResumeDocument };
export type { TemplateType };
