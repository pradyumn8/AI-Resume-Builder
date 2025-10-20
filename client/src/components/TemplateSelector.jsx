import { Check, Layout } from 'lucide-react';
import React, { useState } from 'react';

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const templates = [
    { id: 'Classic', name: 'Classic', preview: 'A clean, traditional resume format with clear sections and a professional typography.' },
    { id: 'Modern', name: 'Modern', preview: 'A contemporary design with bold headings, vibrant colors, and a focus on visual hierarchy.' },
    { id: 'Minimal', name: 'Minimal', preview: 'A sleek, simple layout that emphasizes content over design, using ample white space and subtle accents.' },
    { id: 'Minimal Image', name: 'Minimal with Image', preview: 'A minimalist design that incorporates a profile image for a personal touch while maintaining a clean layout.' },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(o => !o)}
        className="flex items-center gap-1 text-sm text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 ring-1 ring-blue-300 hover:ring-2 transition-all px-3 py-2 rounded-lg"
      >
        <Layout size={14} /> <span className="max-sm:hidden">Template</span>
      </button>

      {isOpen && (
        <div className="absolute top-full w-80 p-3 mt-2 space-y-3 z-10 bg-white rounded-md border border-gray-200 shadow-sm">
          {templates.map((t) => {
            const selected = selectedTemplate === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => { onChange(t.id); setIsOpen(false); }}
                className={[
                  'relative w-full text-left p-3 border rounded-md cursor-pointer transition-all',
                  selected ? 'border-blue-400 bg-blue-100'
                           : 'border-gray-300 hover:border-gray-400 hover:bg-gray-100',
                ].join(' ')}
              >
                {selected && (
                  <div className="absolute top-2 right-2">
                    <div className="size-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-800">{t.name}</h4>
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-gray-600 italic">
                    {t.preview}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
