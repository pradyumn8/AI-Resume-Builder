import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ExperienceForm = ({ data, onChange }) => {

  const { token } = useSelector(state => state.auth)
  const [generatingIndex, setGeneratingIndex] = useState(-1)

  const addExperience = () => {
    const newExperience = {
      company: '',
      position: '',
      start_date: '',
      end_date: '',
      description: '',
      is_current: false,
    }
    onChange([...(data), newExperience])
  }

  const removeExperience = (index) => {
    const updated = (data).filter((_, i) => i !== index)
    onChange(updated)
  }

  const updateExperience = (index, field, value) => {
    const updated = [...(data)]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const generateDescription = async (index) => {
    setGeneratingIndex(index)
    const experience = data[index]
    const prompt = `enhance this job description ${experience.description} for the position of ${experience.position} at ${experience.company}.`

    try {
      const {data} = await api.post('api/ai/enhance-job-desc',{userContent:prompt},{headers:{Authorization:token}})
      updateExperience(index,"description", data.enhancedContent)
    } catch (error) {
     toast.error(error.message) 
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Professional Experience
          </h3>
          <p className="text-sm text-gray-500">Add your job experience</p>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-2 px-3 py-1 text-sm text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          <Plus className="size-4" />
          Add Experience
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No work experience added yet.</p>
          <p>Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((exp, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Experience #{index + 1}</h4>
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
                  value={exp.company || ''}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  type="text"
                  placeholder="Company Name"
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white"
                />

                <input
                  value={exp.position || ''}
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                  type="text"
                  placeholder="Job Title"
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white"
                />

                <input
                  value={exp.start_date || ''}
                  onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                  type="month"
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white"
                />

                <input
                  value={exp.end_date || ''}
                  onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                  type="month"
                  disabled={!!exp.is_current}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white disabled:bg-gray-100"
                />
              </div>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!exp.is_current}
                  onChange={(e) => updateExperience(index, 'is_current', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Currently working here</span>
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Job Description</label>
                  <button
                    type="button"
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded disabled:opacity-50"
                  onClick={() => generateDescription(index)}
                  disabled={generatingIndex === index || !experience.position || !experience.company}
                  >
                    {generatingIndex === index ?(
                      <Loader2 className='w-3 h-3 animate-spin'/>
                    ):(
                      <Sparkles className='w-3 h-3'/>
                    )}
                    Enhance with AI
                  </button>
                </div>
                <textarea
                  value={exp.description || ''}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  rows={4}
                  className="w-full text-sm px-3 py-2 rounded-lg resize-none border border-gray-300 bg-white"
                  placeholder="Describe your key responsibilities and achievements..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExperienceForm

