import { JobOpportunity } from "../../../DB/Models/jobModel.js";
import { User } from "../../../DB/Models/userModel.js";

export const createJob = async (req, res) => {
  const { _id } = req.loggedInUser;
  const { companyId } = req.params;
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;

  const job = await JobOpportunity.create({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: _id,
    companyId: companyId,
  });

  res.status(200).json({ message: "Job created successfully", job });
};
