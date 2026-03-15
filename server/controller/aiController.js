import Resume from "../models/Resume.js";
import ai from '../configs/ai.js'


// controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: 'Missing required fields' })
        }
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert in resume writing. Your task is to enchance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skils, experiecne, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else."
                },
                {
                    role: "user",
                    content: userContent,
                }
            ]
        })
        const enchancedContent = response.choices[0].message.content;
        return res.status(200).json({ enchancedContent })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// controller for enchancing a resume's job description
// POST: /api/ai/enhance-job-desc
export const enchanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: 'Missing required fields' })
        }
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert in resume writing. Your task is to enchance the job description should be only in 1-2 sentence also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else."
                },
                {
                    role: "user",
                    content: userContent,
                }
            ]
        })
        const enchancedContent = response.choices[0].message.content;
        return res.status(200).json({ enchancedContent })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// controller for uploading a resume to the database
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
    try {

        const { resumeText, title } = req.body;
        const userId = req.userId;

        if (!resumeText) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const systemPrompt = "You are an expert AI Agent to extract data from resume."

        const userPrompt = `extract data from this resume: 
        ${resumeText}
        
        Provide data in the following JSON format with no additional text before or after:
        
        {
            "professional_summary": "Summary text here",
            "skills": ["Skill 1", "Skill 2"],
            "personal_info": {
                "image": "",
                "full_name": "John Doe",
                "profession": "Software Engineer",
                "email": "john@example.com",
                "phone": "+1 234 567 8900",
                "location": "City, Country",
                "linkedin": "https://linkedin.com/in/johndoe",
                "website": "https://johndoe.com"
            },
            "experience": [
                {
                    "company": "Company Name",
                    "position": "Job Title",
                    "start_date": "Jan 2020",
                    "end_date": "Present",
                    "description": "Job description here",
                    "is_current": "true"
                }
            ],
            "project": [
                {
                    "name": "Project Name",
                    "type": "Personal/Academic",
                    "description": "Project description"
                }
            ],
            "education": [
                {
                    "institution": "University Name",
                    "degree": "Bachelor of Science",
                    "field": "Computer Science",
                    "graduation_date": "May 2019",
                    "gpa": "3.8"
                }
            ]
        }
        `;



        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt,
                }
            ],
            response_format: { type: 'json_object' }
        })
        const extractedData = response.choices[0].message.content;
        const parsedData = JSON.parse(extractedData)
        const newResume = await Resume.create({ userId, title, ...parsedData })

        res.json({ resumeId: newResume._id })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}