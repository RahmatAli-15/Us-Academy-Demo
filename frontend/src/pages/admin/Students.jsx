import { useEffect, useMemo, useState } from 'react'
import { Edit2, Plus, Sparkles, Trash2, UserPlus, Users, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { CLASS_OPTIONS, formatClassLabel } from '../../constants/classes'
import { extractErrorMessage } from '../../utils/error'
const YES_NO_OPTIONS = ['Yes', 'No']
const GENDER_OPTIONS = ['Male', 'Female', 'Other']
const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const RATION_CARD_OPTIONS = ['APL', 'BPL', 'AAY', 'Antyodaya', 'Other']

const EMPTY_FORM_DATA = {
  name: '',
  class: '',
  dob: '',
  dob_in_words: '',
  aadhaar_number: '',
  pen_number: '',
  apaar_id: '',
  admission_class: '',
  subject: '',
  father_name: '',
  father_aadhaar_number: '',
  mother_name: '',
  mother_aadhaar_number: '',
  guardian_name: '',
  guardian_aadhaar_number: '',
  guardian_relationship: '',
  admission_date: '',
  previous_class: '',
  previous_school: '',
  gender: '',
  religion: '',
  caste: '',
  sub_caste: '',
  residence_period_uttar_pradesh: '',
  disability: '',
  disability_type: '',
  disability_percentage: '',
  ration_card_type: '',
  father_education: '',
  father_occupation: '',
  mother_education: '',
  mother_occupation: '',
  category_bpl: '',
  indian_citizenship: '',
  out_of_school_child: '',
  last_academic_result: '',
  previous_academic_marks: '',
  school_last_attended_days: '',
  mobile_number_1: '',
  whatsapp_number_2: '',
  phone: '',
  address: '',
  pin_code: '',
  account_holder_name: '',
  account_holder_aadhaar_number: '',
  bank_name: '',
  branch_name: '',
  ifsc_code: '',
  aadhaar_registered_mobile: '',
  aadhaar_registered_pin_code: '',
  email: '',
  blood_group: '',
  weight: '',
  height: '',
  guardian_declaration:
    'All the information I have provided is completely true. My child is not enrolled in any other school. No facts have been concealed. If any information I have provided is found to be false, I will be solely responsible for it.',
}

const Field = ({
  as = 'input',
  className = '',
  label,
  name,
  options = [],
  required = false,
  rows = 3,
  type = 'text',
  value,
  onChange,
}) => {
  const baseClassName =
    'mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition focus:border-[#234B6F] focus:ring-2 focus:ring-[#234B6F]/15'

  return (
    <label className={className}>
      <span className="text-sm font-medium text-stone-700">{label}</span>
      {as === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={baseClassName}
        >
          <option value="">Select</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          className={`${baseClassName} resize-y`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={baseClassName}
        />
      )}
    </label>
  )
}

const SummaryCard = ({ icon: Icon, label, value, tone = 'blue' }) => {
  const tones = {
    blue: 'from-blue-600/15 to-cyan-500/10 text-blue-700 ring-blue-200',
    emerald: 'from-emerald-500/15 to-teal-500/10 text-emerald-700 ring-emerald-200',
    amber: 'from-amber-500/15 to-orange-500/10 text-amber-700 ring-amber-200',
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

const Students = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState(EMPTY_FORM_DATA)
  const [profilePhotoFile, setProfilePhotoFile] = useState(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('')
  const displayedClassLabel = useMemo(
    () => (selectedClass ? formatClassLabel(selectedClass) : 'No class selected'),
    [selectedClass]
  )

  useEffect(() => {
    if (selectedClass) {
      fetchStudents()
    }
  }, [selectedClass])

  useEffect(() => {
    if (!location.state?.openNew) return

    resetForm(selectedClass || '')
    setEditingId(null)
    setShowModal(true)
    navigate(location.pathname, { replace: true })
  }, [location.pathname, location.state, navigate, selectedClass])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/admin/students/class/${selectedClass}`)
      setStudents(response.data)
      setError('')
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const resetForm = (classValue = '') => {
    setFormData({
      ...EMPTY_FORM_DATA,
      class: classValue,
      admission_class: classValue ? formatClassLabel(String(classValue)) : '',
    })
    setProfilePhotoFile(null)
    setProfilePhotoPreview('')
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    resetForm(selectedClass || '')
  }

  useEffect(() => {
    return () => {
      if (profilePhotoPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(profilePhotoPreview)
      }
    }
  }, [profilePhotoPreview])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: value,
      }

      if (name === 'mobile_number_1') {
        next.phone = value
      }

      if (name === 'class' && !next.admission_class) {
        next.admission_class = value ? formatClassLabel(String(value)) : ''
      }

      return next
    })
  }

  const buildPayload = () => {
    const trimmedEntries = Object.entries(formData).map(([key, value]) => {
      if (typeof value !== 'string') {
        return [key, value]
      }
      return [key, value.trim()]
    })

    const payload = Object.fromEntries(trimmedEntries)
    payload.phone = payload.mobile_number_1 || payload.phone || ''

    Object.keys(payload).forEach((key) => {
      if (
        !['name', 'class', 'dob', 'aadhaar_number'].includes(key) &&
        payload[key] === ''
      ) {
        payload[key] = null
      }
    })

    return payload
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (profilePhotoPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(profilePhotoPreview)
    }

    setProfilePhotoFile(file)
    setProfilePhotoPreview(URL.createObjectURL(file))
  }

  const uploadStudentPhoto = async (studentId) => {
    if (!profilePhotoFile || !studentId) return

    const uploadData = new FormData()
    uploadData.append('photo', profilePhotoFile)

    await api.post(`/admin/students/${studentId}/photo`, uploadData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const payload = buildPayload()
      let savedStudentId = editingId

      if (editingId) {
        await api.put(`/admin/students/${editingId}`, payload)
        await uploadStudentPhoto(editingId)
        setSuccess('Student updated successfully')
      } else {
        const response = await api.post('/admin/students', payload)
        const generatedStudentId = response?.data?.student_id
        savedStudentId = response?.data?.id
        await uploadStudentPhoto(savedStudentId)
        if (generatedStudentId) {
          setSuccess(`Student created successfully with ID: ${generatedStudentId}`)
        } else {
          setSuccess('Student created successfully')
        }
      }

      closeModal()
      if (selectedClass) {
        fetchStudents()
      }
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  const handleEdit = (student) => {
    const classValue = student.class_ ?? student.class ?? ''
    setProfilePhotoFile(null)
    setProfilePhotoPreview(
      student.profile_photo_url ? `${api.defaults.baseURL}${student.profile_photo_url}` : ''
    )
    setFormData({
      ...EMPTY_FORM_DATA,
      name: student.name ?? '',
      class: classValue,
      dob: student.dob ?? '',
      dob_in_words: student.dob_in_words ?? '',
      aadhaar_number: student.aadhaar_number ?? '',
      pen_number: student.pen_number ?? '',
      apaar_id: student.apaar_id ?? '',
      admission_class: student.admission_class ?? (classValue ? formatClassLabel(String(classValue)) : ''),
      subject: student.subject ?? '',
      father_name: student.father_name ?? '',
      father_aadhaar_number: student.father_aadhaar_number ?? '',
      mother_name: student.mother_name ?? '',
      mother_aadhaar_number: student.mother_aadhaar_number ?? '',
      guardian_name: student.guardian_name ?? '',
      guardian_aadhaar_number: student.guardian_aadhaar_number ?? '',
      guardian_relationship: student.guardian_relationship ?? '',
      admission_date: student.admission_date ?? '',
      previous_class: student.previous_class ?? '',
      previous_school: student.previous_school ?? '',
      gender: student.gender ?? '',
      religion: student.religion ?? '',
      caste: student.caste ?? '',
      sub_caste: student.sub_caste ?? '',
      residence_period_uttar_pradesh: student.residence_period_uttar_pradesh ?? '',
      disability: student.disability ?? '',
      disability_type: student.disability_type ?? '',
      disability_percentage: student.disability_percentage ?? '',
      ration_card_type: student.ration_card_type ?? '',
      father_education: student.father_education ?? '',
      father_occupation: student.father_occupation ?? '',
      mother_education: student.mother_education ?? '',
      mother_occupation: student.mother_occupation ?? '',
      category_bpl: student.category_bpl ?? '',
      indian_citizenship: student.indian_citizenship ?? '',
      out_of_school_child: student.out_of_school_child ?? '',
      last_academic_result: student.last_academic_result ?? '',
      previous_academic_marks: student.previous_academic_marks ?? '',
      school_last_attended_days: student.school_last_attended_days ?? '',
      mobile_number_1: student.mobile_number_1 ?? student.phone ?? '',
      whatsapp_number_2: student.whatsapp_number_2 ?? '',
      phone: student.phone ?? student.mobile_number_1 ?? '',
      address: student.address ?? '',
      pin_code: student.pin_code ?? '',
      account_holder_name: student.account_holder_name ?? '',
      account_holder_aadhaar_number: student.account_holder_aadhaar_number ?? '',
      bank_name: student.bank_name ?? '',
      branch_name: student.branch_name ?? '',
      ifsc_code: student.ifsc_code ?? '',
      aadhaar_registered_mobile: student.aadhaar_registered_mobile ?? '',
      aadhaar_registered_pin_code: student.aadhaar_registered_pin_code ?? '',
      email: student.email ?? '',
      blood_group: student.blood_group ?? '',
      weight: student.weight ?? '',
      height: student.height ?? '',
      profile_photo_path: student.profile_photo_path ?? '',
      guardian_declaration:
        student.guardian_declaration ?? EMPTY_FORM_DATA.guardian_declaration,
    })
    setEditingId(student.id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return

    try {
      await api.delete(`/admin/students/${id}`)
      setSuccess('Student deleted successfully')
      if (selectedClass) {
        fetchStudents()
      }
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  const handleAddNew = () => {
    resetForm(selectedClass || '')
    setEditingId(null)
    setShowModal(true)
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-7 text-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.7)] sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.35),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(245,158,11,0.18),_transparent_28%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100 backdrop-blur">
              <Sparkles size={14} />
              Admissions desk
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Students
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
              Manage admissions, open the printable school-style form, and keep class-wise student records organized.
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            <Plus size={18} /> Add Student
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard icon={Users} label="Students Loaded" value={students.length} tone="blue" />
        <SummaryCard icon={UserPlus} label="Current Class" value={displayedClassLabel} tone="amber" />
        <SummaryCard icon={Edit2} label="Form Mode" value={editingId ? 'Editing' : showModal ? 'Creating' : 'Idle'} tone="emerald" />
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

      <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)] backdrop-blur">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Class Filter</p>
          <h2 className="text-xl font-bold text-slate-900">Browse class-wise student records</h2>
        </div>
        <select
          value={selectedClass || ''}
          onChange={(e) => setSelectedClass(e.target.value || null)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 shadow-sm outline-none transition focus:border-[#234B6F] focus:bg-white focus:ring-4 focus:ring-[#234B6F]/10 md:w-72"
        >
          <option value="">Select a class</option>
          {CLASS_OPTIONS.map((cls) => (
            <option key={cls} value={cls}>
              {formatClassLabel(cls)}
            </option>
          ))}
        </select>
      </section>

      {selectedClass && (
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)]">
          <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Student Register</p>
            <h3 className="text-lg font-bold text-slate-900">{displayedClassLabel}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-slate-100/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Student ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Class</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Primary Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                      Loading...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                      No students found in this class.
                    </td>
                  </tr>
                ) : (
                  students.map((student, index) => (
                    <tr key={student.id} className={`border-t border-slate-100 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{student.student_id}</td>
                      <td className="px-6 py-4 text-sm text-slate-900">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-800">
                        {student.class_ ?? student.class}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {student.mobile_number_1 ?? student.phone ?? '-'}
                      </td>
                      <td className="space-x-2 px-6 py-4 text-sm">
                        <button
                          onClick={() => handleEdit(student)}
                          className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-2 font-medium text-blue-700 transition hover:bg-blue-100"
                        >
                          <Edit2 size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-2 font-medium text-red-700 transition hover:bg-red-100"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/55 p-3 sm:p-6">
          <div className="max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-[#f7f2e8] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-[#f7f2e8]/95 px-5 py-4 backdrop-blur">
              <div>
                <h2 className="text-2xl font-bold text-stone-900">
                  {editingId ? 'Edit Student Admission Form' : 'Student Admission Form'}
                </h2>
                <p className="mt-1 text-sm text-stone-600">
                  Fill the admission details below in the same style as the school form.
                </p>
              </div>
              <button onClick={closeModal} className="text-stone-500 hover:text-stone-800">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
              <div className="rounded-2xl border border-stone-300 bg-white p-4 sm:p-8">
                <div className="border-b border-stone-300 pb-6">
                  <div className="grid gap-6 lg:grid-cols-[1fr_140px]">
                    <div>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-stone-800 text-center text-[10px] font-bold leading-tight text-stone-800">
                          U.S.
                          <br />
                          Academy
                        </div>
                        <div>
                          <h3 className="text-2xl font-black uppercase tracking-wide text-stone-900 sm:text-4xl">
                            U.S. Academy of Education
                          </h3>
                          <p className="mt-2 inline-block border border-stone-400 px-3 py-1 text-center text-xs font-semibold uppercase tracking-wide text-stone-700 sm:text-sm">
                            Application Form For Admission In The School
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-dashed border-stone-400 bg-stone-50 p-3 text-center text-xs text-stone-600">
                      <div className="flex min-h-[120px] flex-col items-center justify-center rounded-lg border border-stone-300 bg-white p-3">
                        {profilePhotoPreview ? (
                          <img
                            src={profilePhotoPreview}
                            alt="Student profile preview"
                            className="mb-3 h-24 w-24 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-xl border border-stone-300 bg-stone-100 px-2 text-center">
                            Student photo
                          </div>
                        )}
                        <label className="cursor-pointer rounded-lg bg-[#234B6F] px-3 py-2 text-white hover:bg-[#1d3f5e]">
                          Upload Image
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-8">
                  <section>
                    <h4 className="mb-4 border-b border-stone-200 pb-2 text-lg font-semibold text-stone-900">
                      Student Information
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <Field label="Name of Student" name="name" value={formData.name} onChange={handleInputChange} required />
                      <Field as="select" label="Class" name="class" value={formData.class} onChange={handleInputChange} options={CLASS_OPTIONS} required />
                      <Field label="Aadhaar Number" name="aadhaar_number" value={formData.aadhaar_number} onChange={handleInputChange} required />
                      <Field label="Child UDISE PEN / Permanent Education Number" name="pen_number" value={formData.pen_number} onChange={handleInputChange} />
                      <Field label="APAAR ID / Student ID" name="apaar_id" value={formData.apaar_id} onChange={handleInputChange} />
                      <Field label="Admission Required In Class" name="admission_class" value={formData.admission_class} onChange={handleInputChange} />
                      <Field type="date" label="Date of Birth" name="dob" value={formData.dob} onChange={handleInputChange} required />
                      <Field label="Date of Birth in Words" name="dob_in_words" value={formData.dob_in_words} onChange={handleInputChange} />
                      <Field label="Subject" name="subject" value={formData.subject} onChange={handleInputChange} />
                    </div>
                  </section>

                  <section>
                    <h4 className="mb-4 border-b border-stone-200 pb-2 text-lg font-semibold text-stone-900">
                      Parent and Guardian Details
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <Field label="Father's Name" name="father_name" value={formData.father_name} onChange={handleInputChange} />
                      <Field label="Father's Aadhaar Number" name="father_aadhaar_number" value={formData.father_aadhaar_number} onChange={handleInputChange} />
                      <Field label="Mother's Name" name="mother_name" value={formData.mother_name} onChange={handleInputChange} />
                      <Field label="Mother's Aadhaar Number" name="mother_aadhaar_number" value={formData.mother_aadhaar_number} onChange={handleInputChange} />
                      <Field label="Name of Guardian" name="guardian_name" value={formData.guardian_name} onChange={handleInputChange} />
                      <Field label="Guardian Aadhaar Number" name="guardian_aadhaar_number" value={formData.guardian_aadhaar_number} onChange={handleInputChange} />
                      <Field label="Relationship With Child" name="guardian_relationship" value={formData.guardian_relationship} onChange={handleInputChange} />
                    </div>
                  </section>

                  <section>
                    <h4 className="mb-4 border-b border-stone-200 pb-2 text-lg font-semibold text-stone-900">
                      Admission and Academic History
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <Field type="date" label="Date of Submission / Admission" name="admission_date" value={formData.admission_date} onChange={handleInputChange} />
                      <Field label="Previous Class" name="previous_class" value={formData.previous_class} onChange={handleInputChange} />
                      <Field label="Name of Previous School" name="previous_school" value={formData.previous_school} onChange={handleInputChange} />
                      <Field label="Student's Result in Last Academic Session" name="last_academic_result" value={formData.last_academic_result} onChange={handleInputChange} />
                      <Field label="Marks Obtained in Previous Academic Session" name="previous_academic_marks" value={formData.previous_academic_marks} onChange={handleInputChange} />
                      <Field label="Number of Days Attended School Last Term" name="school_last_attended_days" value={formData.school_last_attended_days} onChange={handleInputChange} />
                    </div>
                  </section>

                  <section>
                    <h4 className="mb-4 border-b border-stone-200 pb-2 text-lg font-semibold text-stone-900">
                      Category and Eligibility
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <Field as="select" label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} options={GENDER_OPTIONS} />
                      <Field label="Religion" name="religion" value={formData.religion} onChange={handleInputChange} />
                      <Field label="Caste" name="caste" value={formData.caste} onChange={handleInputChange} />
                      <Field label="Sub Caste" name="sub_caste" value={formData.sub_caste} onChange={handleInputChange} />
                      <Field label="Residence in Uttar Pradesh" name="residence_period_uttar_pradesh" value={formData.residence_period_uttar_pradesh} onChange={handleInputChange} />
                      <Field as="select" label="Disability (Yes/No)" name="disability" value={formData.disability} onChange={handleInputChange} options={YES_NO_OPTIONS} />
                      <Field label="Type of Disability" name="disability_type" value={formData.disability_type} onChange={handleInputChange} />
                      <Field label="Disability Percentage" name="disability_percentage" value={formData.disability_percentage} onChange={handleInputChange} />
                      <Field as="select" label="Ration Card Type" name="ration_card_type" value={formData.ration_card_type} onChange={handleInputChange} options={RATION_CARD_OPTIONS} />
                      <Field as="select" label="BPL / Weekly Underprivileged Group" name="category_bpl" value={formData.category_bpl} onChange={handleInputChange} options={YES_NO_OPTIONS} />
                      <Field as="select" label="Indian Citizenship" name="indian_citizenship" value={formData.indian_citizenship} onChange={handleInputChange} options={YES_NO_OPTIONS} />
                      <Field as="select" label="Out of School Child" name="out_of_school_child" value={formData.out_of_school_child} onChange={handleInputChange} options={YES_NO_OPTIONS} />
                    </div>
                  </section>

                  <section>
                    <h4 className="mb-4 border-b border-stone-200 pb-2 text-lg font-semibold text-stone-900">
                      Family Education and Occupation
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <Field label="Father's Educational Qualification" name="father_education" value={formData.father_education} onChange={handleInputChange} />
                      <Field label="Father's Occupation / Business" name="father_occupation" value={formData.father_occupation} onChange={handleInputChange} />
                      <Field label="Mother's Educational Qualification" name="mother_education" value={formData.mother_education} onChange={handleInputChange} />
                      <Field label="Mother's Occupation / Business" name="mother_occupation" value={formData.mother_occupation} onChange={handleInputChange} />
                    </div>
                  </section>

                  <section>
                    <h4 className="mb-4 border-b border-stone-200 pb-2 text-lg font-semibold text-stone-900">
                      Contact and Address
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <Field label="Mobile Number 1" name="mobile_number_1" value={formData.mobile_number_1} onChange={handleInputChange} />
                      <Field label="WhatsApp Number 2" name="whatsapp_number_2" value={formData.whatsapp_number_2} onChange={handleInputChange} />
                      <Field label="Email ID" name="email" value={formData.email} onChange={handleInputChange} />
                      <Field label="PIN Code" name="pin_code" value={formData.pin_code} onChange={handleInputChange} />
                      <Field label="Aadhaar Registered Mobile" name="aadhaar_registered_mobile" value={formData.aadhaar_registered_mobile} onChange={handleInputChange} />
                      <Field label="Aadhaar Registered PIN Code" name="aadhaar_registered_pin_code" value={formData.aadhaar_registered_pin_code} onChange={handleInputChange} />
                      <Field as="textarea" className="md:col-span-2 xl:col-span-3" label="Address" name="address" value={formData.address} onChange={handleInputChange} rows={3} />
                    </div>
                  </section>

                  <section>
                    <h4 className="mb-4 border-b border-stone-200 pb-2 text-lg font-semibold text-stone-900">
                      Banking Information
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <Field label="Account Holder Name" name="account_holder_name" value={formData.account_holder_name} onChange={handleInputChange} />
                      <Field label="Account Holder's Aadhaar Number" name="account_holder_aadhaar_number" value={formData.account_holder_aadhaar_number} onChange={handleInputChange} />
                      <Field label="Bank Name" name="bank_name" value={formData.bank_name} onChange={handleInputChange} />
                      <Field label="Branch Name" name="branch_name" value={formData.branch_name} onChange={handleInputChange} />
                      <Field label="IFSC Code" name="ifsc_code" value={formData.ifsc_code} onChange={handleInputChange} />
                    </div>
                  </section>

                  <section>
                    <h4 className="mb-4 border-b border-stone-200 pb-2 text-lg font-semibold text-stone-900">
                      Health Information
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <Field as="select" label="Blood Group" name="blood_group" value={formData.blood_group} onChange={handleInputChange} options={BLOOD_GROUP_OPTIONS} />
                      <Field label="Weight" name="weight" value={formData.weight} onChange={handleInputChange} />
                      <Field label="Height" name="height" value={formData.height} onChange={handleInputChange} />
                    </div>
                  </section>

                  <section>
                    <div className="rounded-xl border border-stone-300 p-4">
                      <h4 className="text-xl font-semibold text-stone-900">Guardian Declaration</h4>
                      <Field
                        as="textarea"
                        className="mt-4 block"
                        label="Declaration"
                        name="guardian_declaration"
                        value={formData.guardian_declaration}
                        onChange={handleInputChange}
                        rows={6}
                      />
                      <p className="mt-6 text-sm text-stone-700">
                        Signature / thumbprint of parent or guardian
                      </p>
                    </div>
                  </section>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#234B6F] px-5 py-3 font-semibold text-white hover:bg-[#1d3f5e]"
                >
                  {editingId ? 'Update Student Record' : 'Save Student Record'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl bg-stone-200 px-5 py-3 font-semibold text-stone-900 hover:bg-stone-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Students
