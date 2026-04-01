import { useEffect, useMemo, useState } from 'react'
import { BookOpen, ClipboardList, Filter, Plus, Sparkles, Trophy, Users } from 'lucide-react'
import api from '../../api/axios'
import { CLASS_OPTIONS, PRE_PRIMARY_CLASSES, formatClassLabel } from '../../constants/classes'
import { getSubjectsForClass } from '../../constants/resultTemplates'
import { extractErrorMessage } from '../../utils/error'

const SUBJECT_KEY_MAP = {
  ENGLISH: 'english',
  ENGLISH_GRAMMAR: 'english_grammar',
  HINDI: 'hindi',
  HINDI_GRAMMAR: 'hindi_grammar',
  MATHS: 'maths',
  EVS_SCIENCE: 'evs_science',
  SCIENCE: 'evs_science',
  URDU: 'urdu',
  COMPUTER: 'computer',
  GK: 'gk',
  MS_SST: 'ms_sst',
  SOCIAL_STUDIES: 'ms_sst',
  PT: 'pt',
  PHYSICAL_EDUCATION: 'pt',
  ART: 'art',
}

const REPORT_EXAMS = ['Term-1', 'Term-2', 'Final']
const GRADE_OPTIONS = ['A', 'B', 'C', 'D', 'E']
const CO_SCHOLASTIC_AREAS = [
  { key: 'art_education', label: 'Art Education / Cooking Education' },
  { key: 'health_physical', label: 'Health & Physical Education' },
  { key: 'discipline', label: 'Discipline' },
]

const buildEmptyMarks = (classValue) => {
  const marks = {}
  getSubjectsForClass(classValue).forEach((subject) => {
    marks[subject.key] = 0
  })
  return marks
}

const buildEmptyGrades = () =>
  CO_SCHOLASTIC_AREAS.reduce((acc, area) => {
    acc[area.key] = ''
    return acc
  }, {})

const groupResultsByExam = (records) => {
  const grouped = {}

  records.forEach((record) => {
    const groupKey = `${record.student_id}-${record.exam_type}-${record.class_ ?? record.class}`
    const formKey = SUBJECT_KEY_MAP[record.subject]

    if (!grouped[groupKey]) {
      grouped[groupKey] = {
        id: groupKey,
        student_id: record.student_id,
        class: record.class_ ?? record.class,
        exam_type: record.exam_type,
        marks: {},
      }
    }

    if (formKey) {
      grouped[groupKey].marks[formKey] = record.marks
    }
  })

  return Object.values(grouped)
}

const InfoLine = ({ label, value }) => (
  <div className="grid grid-cols-[150px_1fr] gap-3 text-sm text-stone-800">
    <span className="font-semibold">{label}</span>
    <span className="border-b border-dotted border-stone-500 pb-1">{value || ' '}</span>
  </div>
)

const SummaryCard = ({ icon: Icon, label, value, tone = 'blue' }) => {
  const tones = {
    blue: 'from-blue-600/15 to-cyan-500/10 text-blue-700 ring-blue-200',
    amber: 'from-amber-500/15 to-orange-500/10 text-amber-700 ring-amber-200',
    emerald: 'from-emerald-500/15 to-teal-500/10 text-emerald-700 ring-emerald-200',
    violet: 'from-violet-500/15 to-fuchsia-500/10 text-violet-700 ring-violet-200',
  }

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${tones[tone]} p-4 ring-1`}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
        <Icon size={20} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-stone-900">{value}</p>
    </div>
  )
}

const Results = () => {
  const [results, setResults] = useState([])
  const [students, setStudents] = useState([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [filterExam, setFilterExam] = useState('All')
  const [formData, setFormData] = useState({
    student_id: '',
    exam_type: 'Term-1',
    marks: buildEmptyMarks('1'),
    co_scholastic_grades: buildEmptyGrades(),
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    fetchResultsBySelection()
  }, [selectedClass, selectedStudentId])

  const selectedStudent = useMemo(
    () => students.find((student) => String(student.id) === String(formData.student_id)),
    [formData.student_id, students]
  )

  const activeClass = selectedStudent?.class_ ?? selectedStudent?.class ?? selectedClass ?? '1'
  const activeSubjects = useMemo(() => getSubjectsForClass(activeClass), [activeClass])
  const isPrePrimary = PRE_PRIMARY_CLASSES.includes(activeClass)

  const groupedResults = useMemo(() => groupResultsByExam(results), [results])
  const displayedResults = groupedResults.filter((record) => filterExam === 'All' || record.exam_type === filterExam)
  const resultColumns = useMemo(
    () => getSubjectsForClass(displayedResults[0]?.class || selectedClass || activeClass),
    [activeClass, displayedResults, selectedClass]
  )

  const totalMarks = useMemo(
    () => activeSubjects.reduce((sum, subject) => sum + Number(formData.marks[subject.key] || 0), 0),
    [activeSubjects, formData.marks]
  )

  const visibleStudents = useMemo(
    () => new Set(displayedResults.map((record) => record.student_id)).size,
    [displayedResults]
  )

  const averageMarks = useMemo(() => {
    if (!displayedResults.length || !resultColumns.length) return 0

    const total = displayedResults.reduce(
      (sum, result) =>
        sum +
        resultColumns.reduce((subjectSum, subject) => subjectSum + Number(result.marks[subject.key] || 0), 0),
      0
    )

    return Math.round(total / displayedResults.length)
  }, [displayedResults, resultColumns])

  const activeFilterLabel = selectedStudentId
    ? students.find((student) => String(student.id) === String(selectedStudentId))?.name || 'Selected student'
    : selectedClass
      ? formatClassLabel(selectedClass)
      : 'No filter'

  const fetchStudents = async () => {
    setStudentsLoading(true)
    try {
      const response = await api.get('/admin/students')
      setStudents(response.data || [])
    } catch (err) {
      setError(extractErrorMessage(err))
      setStudents([])
    } finally {
      setStudentsLoading(false)
    }
  }

  const fetchResultsBySelection = async () => {
    if (!selectedClass && !selectedStudentId) {
      setResults([])
      setError('')
      return
    }

    setLoading(true)
    try {
      const response = selectedStudentId
        ? await api.get(`/admin/results/student/${selectedStudentId}`)
        : await api.get(`/admin/results/class/${selectedClass}`)

      setResults(response.data || [])
      setError('')
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const resetForm = (classValue = selectedClass || '1') => {
    setFormData({
      student_id: '',
      exam_type: 'Term-1',
      marks: buildEmptyMarks(classValue),
      co_scholastic_grades: buildEmptyGrades(),
    })
    setShowForm(false)
  }

  const handleStudentChange = (value) => {
    const matchedStudent = students.find((student) => String(student.id) === String(value))
    const nextClass = matchedStudent?.class_ ?? matchedStudent?.class ?? selectedClass ?? '1'

    setFormData({
      student_id: value,
      exam_type: formData.exam_type,
      marks: buildEmptyMarks(nextClass),
      co_scholastic_grades: buildEmptyGrades(),
    })
  }

  const handleMarkChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      marks: {
        ...prev.marks,
        [key]: value === '' ? '' : Number(value),
      },
    }))
  }

  const handleGradeChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      co_scholastic_grades: {
        ...prev.co_scholastic_grades,
        [key]: value,
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const studentId = Number(formData.student_id)
      const matchedStudent = students.find((student) => student.id === studentId)
      const studentClass = matchedStudent?.class_ ?? matchedStudent?.class ?? selectedClass ?? ''

      if (!studentId || !studentClass) {
        setError('Please select a valid student')
        return
      }

      const marks = {}
      activeSubjects.forEach((subject) => {
        marks[subject.apiKey] = Number(formData.marks[subject.key] ?? 0)
      })

      const response = await api.post('/admin/results', {
        student_id: studentId,
        student_class: studentClass,
        exam_type: formData.exam_type,
        marks,
      })

      const affected = response.data?.created_count ?? activeSubjects.length
      setSuccess(`Result saved successfully for ${affected} subjects`)
      setShowForm(false)
      fetchResultsBySelection()
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-7 text-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.7)] sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.35),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.18),_transparent_28%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100 backdrop-blur">
              <Sparkles size={14} />
              Academic performance desk
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Results overview
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
              Track report-card entries, review class performance quickly, and keep subject marks organized in one calm workspace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-300">Current focus</p>
              <p className="mt-1 text-sm font-semibold text-white">{activeFilterLabel}</p>
            </div>
            <button
              onClick={() => {
                setFormData({
                  student_id: '',
                  exam_type: 'Term-1',
                  marks: buildEmptyMarks(selectedClass || '1'),
                  co_scholastic_grades: buildEmptyGrades(),
                })
                setShowForm((prev) => !prev)
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <Plus size={18} /> {showForm ? 'Close Form' : 'Add Result'}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={ClipboardList} label="Entries Visible" value={displayedResults.length} tone="blue" />
        <SummaryCard icon={Users} label="Students Covered" value={visibleStudents} tone="emerald" />
        <SummaryCard icon={BookOpen} label="Subjects Shown" value={resultColumns.length} tone="violet" />
        <SummaryCard icon={Trophy} label="Avg. Marks" value={averageMarks} tone="amber" />
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 shadow-sm">
          {success}
        </div>
      )}

      {showForm && (
        <div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/90 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.28)] backdrop-blur">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-blue-50 px-6 py-5">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Report Card Entry</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Create a polished subject-wise result sheet</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <select
                name="student_id"
                value={formData.student_id}
                onChange={(e) => handleStudentChange(e.target.value)}
                disabled={studentsLoading}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              >
                <option value="">
                  {studentsLoading ? 'Loading students...' : 'Select Student'}
                </option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.student_id} - {student.name} ({formatClassLabel(student.class_ ?? student.class)})
                  </option>
                ))}
              </select>

              <select
                value={formData.exam_type}
                onChange={(e) => setFormData((prev) => ({ ...prev, exam_type: e.target.value }))}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                {REPORT_EXAMS.map((exam) => (
                  <option key={exam} value={exam}>
                    {exam}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-[linear-gradient(180deg,#fffdfa_0%,#f8fbff_100%)] p-4 sm:p-8">
            <div className="mx-auto max-w-6xl rounded-[28px] border border-stone-300 bg-white p-4 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.25)] sm:p-6">
              <div className="border-b border-stone-300 pb-5 text-center">
                <h2 className="text-3xl font-black uppercase tracking-wide text-stone-900">
                  US Academy, Sihali Jageer
                </h2>
                <p className="mt-2 text-base font-semibold text-stone-700">
                  Progress Report Session
                  <span className="ml-2 inline-block border-b border-stone-500 px-6">{new Date().getFullYear()}</span>
                  <span className="mx-2">-</span>
                  <span className="inline-block border-b border-stone-500 px-6">{new Date().getFullYear() + 1}</span>
                </p>
                <p className="mt-2 text-sm text-stone-600">
                  {isPrePrimary ? 'Nursery / LKG / UKG report format' : 'Class 1 to 10 report format'}
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <InfoLine label="Student's Name" value={selectedStudent?.name} />
                  <InfoLine label="Father's Name" value={selectedStudent?.father_name} />
                  <InfoLine label="Mother's Name" value={selectedStudent?.mother_name} />
                </div>
                <div className="space-y-3">
                  <InfoLine label="D.O.B." value={selectedStudent?.dob} />
                  <InfoLine label="Class" value={selectedStudent ? formatClassLabel(selectedStudent.class_ ?? selectedStudent.class) : ''} />
                  <InfoLine label="Exam" value={formData.exam_type} />
                </div>
              </div>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full border-collapse border border-stone-400 text-sm">
                  <thead>
                    <tr className="bg-stone-100">
                      <th className="border border-stone-400 px-3 py-3 text-left font-bold">Scholastic Areas</th>
                      <th className="border border-stone-400 px-3 py-3 text-center font-bold">Maximum Marks</th>
                      <th className="border border-stone-400 px-3 py-3 text-center font-bold">Marks Obtained</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSubjects.map((subject) => (
                      <tr key={subject.key}>
                        <td className="border border-stone-300 px-3 py-3 font-medium text-stone-800">
                          {subject.label}
                        </td>
                        <td className="border border-stone-300 px-3 py-3 text-center font-semibold text-stone-700">
                          100
                        </td>
                        <td className="border border-stone-300 px-3 py-2">
                          <input
                            type="number"
                            value={formData.marks[subject.key] ?? 0}
                            onChange={(e) => handleMarkChange(subject.key, e.target.value)}
                            min="0"
                            max="100"
                            className="w-full border-0 bg-transparent text-center text-sm font-semibold text-stone-900 outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-stone-50">
                      <td className="border border-stone-400 px-3 py-3 text-right font-bold text-stone-900">
                        Total Mark
                      </td>
                      <td className="border border-stone-400 px-3 py-3 text-center font-bold text-stone-900">
                        {activeSubjects.length * 100}
                      </td>
                      <td className="border border-stone-400 px-3 py-3 text-center font-bold text-stone-900">
                        {totalMarks}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {!isPrePrimary && (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full border-collapse border border-stone-400 text-sm">
                    <thead>
                      <tr className="bg-stone-100">
                        <th className="border border-stone-400 px-3 py-3 text-left font-bold">Co-Scholastic Area</th>
                        <th className="border border-stone-400 px-3 py-3 text-center font-bold">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CO_SCHOLASTIC_AREAS.map((area) => (
                        <tr key={area.key}>
                          <td className="border border-stone-300 px-3 py-3 font-medium text-stone-800">{area.label}</td>
                          <td className="border border-stone-300 px-3 py-2 text-center">
                            <select
                              value={formData.co_scholastic_grades[area.key] || ''}
                              onChange={(e) => handleGradeChange(area.key, e.target.value)}
                              className="w-full border-0 bg-transparent text-center text-sm font-semibold text-stone-900 outline-none"
                            >
                              <option value="">Select Grade</option>
                              {GRADE_OPTIONS.map((grade) => (
                                <option key={grade} value={grade}>
                                  {grade}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-2xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:bg-gray-400"
                >
                  {saving ? 'Saving...' : 'Save Full Report'}
                </button>
                <button
                  type="button"
                  onClick={() => resetForm(activeClass)}
                  className="flex-1 rounded-2xl bg-stone-100 px-6 py-3 font-semibold text-stone-900 transition hover:bg-stone-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <section className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)] backdrop-blur">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Filters</p>
            <h2 className="text-xl font-bold text-slate-900">Narrow down the result list</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
            <Filter size={16} />
            Live filtered view
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <select
            value={selectedClass}
            onChange={(e) => {
              const value = e.target.value
              setSelectedClass(value)
              if (value) setSelectedStudentId('')
            }}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          >
            <option value="">Filter by Class</option>
            {CLASS_OPTIONS.map((cls) => (
              <option key={cls} value={cls}>
                {formatClassLabel(cls)}
              </option>
            ))}
          </select>

          <select
            value={selectedStudentId}
            onChange={(e) => {
              const value = e.target.value
              setSelectedStudentId(value)
              if (value) setSelectedClass('')
            }}
            disabled={studentsLoading}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          >
            <option value="">
              {studentsLoading ? 'Loading students...' : 'Filter by Student'}
            </option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.student_id} - {student.name}
              </option>
            ))}
          </select>

          <select
            value={filterExam}
            onChange={(e) => setFilterExam(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          >
            <option>All</option>
            {REPORT_EXAMS.map((exam) => (
              <option key={exam} value={exam}>
                {exam}
              </option>
            ))}
          </select>
        </div>
      </section>

      {!selectedClass && !selectedStudentId && (
        <section className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <ClipboardList size={24} />
          </div>
          <h3 className="mt-4 text-xl font-bold text-slate-900">Start with a class or a student</h3>
          <p className="mt-2 text-sm text-slate-600">
            Choose a filter above to reveal report-card entries and subject marks.
          </p>
        </section>
      )}

      {(selectedClass || selectedStudentId) && (
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)]">
          <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Result Register</p>
                <h3 className="text-lg font-bold text-slate-900">Subject-wise marks table</h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
                <Users size={16} />
                {displayedResults.length} row{displayedResults.length === 1 ? '' : 's'}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-100/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Student ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Class</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Exam</th>
                  {resultColumns.map((subject) => (
                    <th key={subject.key} className="px-3 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                      {subject.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={resultColumns.length + 3} className="px-6 py-12 text-center text-slate-500">
                      Loading...
                    </td>
                  </tr>
                ) : displayedResults.length === 0 ? (
                  <tr>
                    <td colSpan={resultColumns.length + 3} className="px-6 py-12 text-center text-slate-500">
                      No results found
                    </td>
                  </tr>
                ) : (
                  displayedResults.map((result, index) => (
                    <tr key={result.id} className={`border-t border-slate-100 transition hover:bg-blue-50/40 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{result.student_id}</td>
                      <td className="px-6 py-4 text-sm text-slate-800">{formatClassLabel(result.class)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{result.exam_type}</td>
                      {resultColumns.map((subject) => (
                        <td key={subject.key} className="px-3 py-4 text-center text-sm font-medium text-slate-700">
                          {result.marks[subject.key] ?? '-'}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

export default Results
