const axios = require("axios");
require("dotenv").config();

const AZURE_API_KEY = process.env.AZURE_OPENAI_API_KEY;

async function callAzureGPT(systemPrompt, userPrompt, temperature = 0.7) {
  try {
    const response = await axios.post(
      "https://team7-4116-resource.openai.azure.com/openai/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
        max_tokens: 4000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": AZURE_API_KEY,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Azure GPT Error:", error.response?.data || error.message);
    throw new Error("AI service unavailable");
  }
}

async function tailorResume(resumeText, jobDescription, jobTitle) {
  const systemPrompt = `You are an expert resume writer and career coach. Your task is to tailor a resume to match a specific job description. 
  
Rules:
- Keep the candidate's real experience and skills
- Reword bullet points to emphasize relevant skills for the target role
- Add relevant keywords from the job description naturally
- Improve action verbs and quantify achievements where possible
- Return the tailored resume as clean, well-formatted text
- Mark sections you changed by wrapping them with **double asterisks**
- Do NOT fabricate experience or skills the candidate doesn't have`;

  const userPrompt = `
TARGET JOB: ${jobTitle}

JOB DESCRIPTION:
${jobDescription}

ORIGINAL RESUME:
${resumeText}

Please tailor this resume for the target job. Wrap any changed or added text in **double asterisks** so the user can see what was modified.`;

  return callAzureGPT(systemPrompt, userPrompt);
}

async function generateCoverLetter(resumeText, jobDescription, jobTitle, company) {
  const systemPrompt = `You are an expert cover letter writer. Write compelling, personalized cover letters that connect the candidate's experience to the job requirements. 

Rules:
- Keep it concise (3-4 paragraphs)
- Reference specific skills and experiences from the resume
- Connect them to specific requirements from the job description
- Use a professional but warm tone
- Include a strong opening and call to action
- Do NOT fabricate experience`;

  const userPrompt = `
Write a cover letter for:

POSITION: ${jobTitle} at ${company}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${resumeText}`;

  return callAzureGPT(systemPrompt, userPrompt);
}

async function matchJobScore(resumeText, jobDescription) {
  const systemPrompt = `You are a job matching AI. Analyze resume-job fit and return ONLY valid JSON with no markdown formatting. Return exactly this structure:
{
  "score": <number 0-100>,
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "summary": "brief explanation"
}`;

  const userPrompt = `
RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Analyze the match and return JSON only.`;

  const result = await callAzureGPT(systemPrompt, userPrompt, 0.3);

  try {
    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      score: 50,
      matchingSkills: [],
      missingSkills: [],
      summary: result,
    };
  }
}

module.exports = { tailorResume, generateCoverLetter, matchJobScore, callAzureGPT };