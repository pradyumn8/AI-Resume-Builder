import { Sparkles } from 'lucide-react'
import React from 'react'

const ProfrssionalSummaryForm = ({ data, onChange, setResumeData }) => {
    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Summary</h3>
                    <p className='text-sm text-gray-500'>Add summary for your resume here</p>
                </div>
                <button className='flex items-center gap-2 px-3 py-1 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
                    <Sparkles className='size-4' />
                    AI Enhance
                </button>
            </div>

            <div className='mt-6'>
                <textarea rows={7} value={data || ""} onChange={(e)=>onChange(e.target.value)} className='w-full p-3 px-4 mt-2 border txet-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 outline-none transition-colors resize-none' placeholder='Write a compelling professinal summary that highlights your key strengths and career objectives...'></textarea>

                <p className='text-xs text-gray-500 max-w-4/5 mx-auto text-center'>Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.</p>
            </div>
        </div>
    )
}

export default ProfrssionalSummaryForm