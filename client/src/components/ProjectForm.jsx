import { Plus, Trash2 } from 'lucide-react'
import React from 'react'

const ProjectForm = ({ data, onChange }) => {
  
  const addProject = () => {
    const newProject = {
      name: '',
      type: '',
      description: '',
    }
    onChange([...(data || []), newProject])
  }

  const removeProject = (index) => {
    const updated = (data || []).filter((_, i) => i !== index)
    onChange(updated)
  }
  const updateProject = (index, field, value) => {
    const updated = [...(data || [])]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }  
  return (
      <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Project
          </h3>
          <p className="text-sm text-gray-500">Add your job details</p>
        </div>
        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-2 px-3 py-1 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          <Plus className="size-4" />
          Add Project
        </button>
      </div>

        <div className="space-y-4">
          {data.map((project, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Project #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="p-1 rounded hover:bg-gray-100"
                  aria-label="Remove Project"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid gap-3">
                <input
                  value={project.name || ''}
                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                  type="text"
                  placeholder="Project Name"
                  className="px-3 py-2 text-sm"
                />

                <input
                  value={project.type || ''}
                  onChange={(e) => updateProject(index, 'type', e.target.value)}
                  type="text"
                  placeholder="Project Type"
                  className="px-3 py-2 text-sm"
                />

                <textarea rows={4}
                  value={project.description || ''}
                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                  placeholder='Describe your project'
                  className="px-3 py-2 text-sm"
                />

             
              </div>

           
            </div>
          ))}
        </div>
    </div>
  )
}

export default ProjectForm
