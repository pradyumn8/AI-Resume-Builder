import { GraduationCap, Plus, Trash2 } from 'lucide-react'
import React from 'react'

const EducationForm = ({ data, onChange }) => {

  const addEducation = () => {
    const newEducation = {
      institution: '',
      degree: '',
      field: '',
      graducation_date: '',
      gpa: '',
    }
    onChange([...(data || []), newEducation])
  }

  const removeEducation = (index) => {
    const updated = (data || []).filter((_, i) => i !== index)
    onChange(updated)
  }
  const updateEducation = (index, field, value) => {
    const updated = [...(data || [])]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Education
          </h3>
          <p className="text-sm text-gray-500">Add your job details</p>
        </div>
        <button
          type="button"
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          <Plus className="size-4" />
          Add Education
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No education added yet.</p>
          <p>Click "Add Education" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((edu, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Education #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="p-1 rounded hover:bg-gray-100"
                  aria-label="Remove experience"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={edu.institution || ''}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  type="text"
                  placeholder="Institution Name"
                  className="px-3 py-2 text-sm"
                />

                <input
                  value={edu.degree || ''}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  type="text"
                  placeholder="Degree (e.g., Bachelor of Science)"
                  className="px-3 py-2 text-sm"
                />

                <input
                  value={edu.field || ''}
                  onChange={(e) => updateEducation(index, 'field', e.target.value)}
                  type="text"
                  placeholder='Field of Study'
                  className="px-3 py-2 text-sm"
                />

                <input
                  value={edu.graducation_date || ''}
                  onChange={(e) => updateEducation(index, 'graducation_date', e.target.value)}
                  type="month"
                  className="px-3 py-2 text-sm"
                />
              </div>

              <input
                value={edu.gpa || ''}
                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                type="text"
                placeholder='GPA (Optional)'
                className="px-3 py-2 text-sm"
              />

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EducationForm