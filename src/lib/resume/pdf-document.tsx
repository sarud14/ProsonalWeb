import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: '40 48',
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    lineHeight: 1.45,
    color: '#1a1a1a',
  },
  header: {
    marginBottom: 20,
    borderBottom: '1.5pt solid #1a1a1a',
    paddingBottom: 12,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  role: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    letterSpacing: 1.8,
    color: '#555',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  contactLine: {
    fontSize: 8.5,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#1a1a1a',
    marginBottom: 8,
    marginTop: 16,
    borderBottom: '0.5pt solid #ccc',
    paddingBottom: 4,
  },
  expEntry: {
    marginBottom: 10,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  expTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
  },
  expPeriod: {
    fontSize: 8.5,
    color: '#666',
  },
  expOrg: {
    fontSize: 8.5,
    color: '#555',
    marginBottom: 4,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 8,
  },
  bulletDot: {
    width: 8,
    fontSize: 9,
  },
  bulletText: {
    flex: 1,
  },
  twoCol: {
    flexDirection: 'row',
    gap: 24,
  },
  colLeft: {
    flex: 1,
  },
  colRight: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  tag: {
    fontSize: 8,
    color: '#444',
    border: '0.5pt solid #ccc',
    padding: '2 6',
  },
  selectedWorkEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  selectedWorkName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
  },
  selectedWorkNote: {
    fontSize: 8.5,
    color: '#555',
  },
  eduEntry: {
    marginBottom: 6,
  },
  eduHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eduTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
  },
  eduNote: {
    fontSize: 8.5,
    color: '#555',
  },
  langRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 2,
  },
  langEntry: {
    fontSize: 9,
  },
  langLevel: {
    fontSize: 8,
    color: '#555',
    letterSpacing: 0.8,
  },
})

interface ResumeExperience {
  title: string
  org: string
  period: string
  bullets: string[]
}

interface ResumeSelectedWork {
  name: string
  note: string
}

interface ResumeEducation {
  title: string
  note: string
  period: string
}

interface ResumeLanguage {
  name: string
  level: string
}

export interface ResumePdfData {
  name: string
  role: string
  contactLine: string
  experience: ResumeExperience[]
  selectedWork: ResumeSelectedWork[]
  skills: string[]
  coreTools: string[]
  education: ResumeEducation[]
  languages: ResumeLanguage[]
}

export function ResumePdfDocument({
  data,
}: {
  data: ResumePdfData
}): React.JSX.Element {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.role}>{data.role}</Text>
          <Text style={styles.contactLine}>{data.contactLine}</Text>
        </View>

        {/* Experience */}
        <Text style={styles.sectionTitle}>Experience</Text>
        {data.experience.map((exp, i) => (
          <View key={i} style={styles.expEntry}>
            <View style={styles.expHeader}>
              <Text style={styles.expTitle}>{exp.title}</Text>
              <Text style={styles.expPeriod}>{exp.period}</Text>
            </View>
            <Text style={styles.expOrg}>{exp.org}</Text>
            {exp.bullets.map((b, j) => (
              <View key={j} style={styles.bullet}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{b}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* Two columns: Selected Work + Skills/Tools */}
        <View style={styles.twoCol}>
          <View style={styles.colLeft}>
            <Text style={styles.sectionTitle}>Selected Work</Text>
            {data.selectedWork.map((sw, i) => (
              <View key={i} style={styles.selectedWorkEntry}>
                <Text style={styles.selectedWorkName}>{sw.name}</Text>
                <Text style={styles.selectedWorkNote}>{sw.note}</Text>
              </View>
            ))}
          </View>
          <View style={styles.colRight}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.tagRow}>
              {data.skills.map((s, i) => (
                <Text key={i} style={styles.tag}>
                  {s}
                </Text>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Core Tools</Text>
            <View style={styles.tagRow}>
              {data.coreTools.map((t, i) => (
                <Text key={i} style={styles.tag}>
                  {t}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Education + Languages */}
        <View style={styles.twoCol}>
          <View style={styles.colLeft}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, i) => (
              <View key={i} style={styles.eduEntry}>
                <View style={styles.eduHeader}>
                  <Text style={styles.eduTitle}>{edu.title}</Text>
                  <Text style={styles.expPeriod}>{edu.period}</Text>
                </View>
                <Text style={styles.eduNote}>{edu.note}</Text>
              </View>
            ))}
          </View>
          <View style={styles.colRight}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.langRow}>
              {data.languages.map((lang, i) => (
                <View key={i}>
                  <Text style={styles.langEntry}>{lang.name}</Text>
                  <Text style={styles.langLevel}>{lang.level}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
