
import Resume from "../models/Resume.js";
import imagekit from "../configs/imageKit.js";
import fs from 'fs';


// controller for creating a new resume
// POST: /api/reusmes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    // create new resume
    const newResume = await Resume.create({ userId, title })
    // return success message
    return res.status(200).json({ message: 'Resume created successfully', resume: newResume })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

// controller for deleting a resume
// DELETE: /api/resumes/delete
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    await Resume.findOneAndDelete({ userId, _id: resumeId })

    // return success message
    return res.status(200).json({ message: 'Resume deleted successfully' })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

// get user resume by id
// GET: /api/resumes/get
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId })

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' })
    }

    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    return res.status(200).json({ resume })

  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}


// get resume by id public
// GET: /api/resumes/public
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId })

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" })
    }
    return res.status(200).json({ resume })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}


// controller for updating a resume
// PUT: /api/resumes/update
// export const updateResume = async (req, res) => {
//     try {
//         const userId = req.userId;
//         // const { resumeId, resumeData, removeBackground } = req.body;
//         const { resumeId, resumeData, removeBackground } = req.body;
//     if (!resumeId) return res.status(400).json({ message: 'resumeId is required' });
//         const image = req.file;

//         let resumeDataCopy;
//         if(typeof resumeData === 'string'){
//             resumeDataCopy = await JSON.parse(resumeData)
//         } else {
//             resumeDataCopy = structuredClone(resumeData)
//         }

//         // if(image){

//         //     const imageBufferData = fs.createReadStream(image.path)

//         //     const response = await imagekit.files.upload({
//         //         file:imageBufferData,
//         //         fileName: 'resume.png',
//         //         folder:'user-resumes',
//         //         transformation: {
//         //             pre: 'w-300,h-300,fo-face,z-0.75' (removeBackground ? ',e-bgremove' : '')
//         //         }
//         //     });
//         //     resumeDataCopy.personal_info.image = response.url
//         // }
//         if (image) {
//    const response = await imagekit.upload({
//      file: image.buffer, // from memoryStorage
//      fileName: image.originalname || 'resume.png',
//      folder: 'user-resumes',
//      transformation: [
//        { width: 300, height: 300, focus: 'face', zoom: 0.75 },
//        ...(removeBackground ? [{ effect: 'bgremove' }] : [])
//      ],
//      transformationPosition: 'pre'
//    });
//    resumeDataCopy.personal_info = resumeDataCopy.personal_info || {};
//    resumeDataCopy.personal_info.image = response.url;
//  }

//         const resume = await Resume.findByIdAndUpdate({ userId, _id: resumeId }, 
//         resumeDataCopy, { new: true })

//         return res.status(200).json({message:'Saved successfully', resume})
//     } catch (error) {
//         return res.status(400).json({ message: error.message })
//     }
// }

export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.body;
    if (!resumeId) return res.status(400).json({ message: 'resumeId is required' });

    // normalize removeBackground to boolean
    const removeBackground = typeof req.body.removeBackground === 'string'
      ? ['1', 'true', 'yes', 'on'].includes(req.body.removeBackground.toLowerCase())
      : !!req.body.removeBackground;

    const image = req.file;

    let resumeDataCopy;
    if (typeof req.body.resumeData === 'string') {
      resumeDataCopy = JSON.parse(req.body.resumeData);
    } else {
      // multer + form-data => always string, but keep fallback
      resumeDataCopy = structuredClone(req.body.resumeData || {});
    }

    if (image) {
      // ImageKit SDK for Node uses imagekit.upload
      const response = await imagekit.upload({
        file: image.buffer,                                // requires memoryStorage
        fileName: image.originalname || 'resume.png',
        folder: 'user-resumes',
        transformation: [
          { width: 300, height: 300, focus: 'face', zoom: 0.75 },
          ...(removeBackground ? [{ effect: 'bgremove' }] : [])
        ],
        transformationPosition: 'pre'
      });
      resumeDataCopy.personal_info = resumeDataCopy.personal_info || {};
      resumeDataCopy.personal_info.image = response.url;
    }

    // ❌ WRONG: findByIdAndUpdate({ userId, _id: resumeId }, …)
    // ✅ EITHER filter or id
    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      { $set: resumeDataCopy },
      { new: true }
    );

    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    return res.status(200).json({ message: 'Saved successfully', resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
