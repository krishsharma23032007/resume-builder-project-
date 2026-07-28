# AI Resume Backend

Node.js/Express backend for an AI Resume Builder and Analyzer. Firebase handles auth and Firestore from the frontend; this service only verifies Firebase ID tokens, parses PDFs, scores resumes, compares resumes to job descriptions, and calls Gemini for AI writing features.

## Stack

- Node.js + Express
- Firebase Admin SDK
- `@google/generative-ai` using `gemini-2.5-flash`
- `pdf-parse`
- `multer`
- `dotenv`
- `cors`

## Setup

```bash
cd ai-resume-backend
npm install
cp .env.example .env
npm run dev
```

Production:

```bash
npm start
```

The server uses `PORT` from the environment and falls back to `5000`.

## Environment Variables

```env
PORT=5000
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
GEMINI_API_KEY=
```

Optional production CORS variable:

```env
FRONTEND_URL=https://your-frontend-domain.com
```

If `NODE_ENV=production` and `FRONTEND_URL` is set, only that origin is allowed. In development, all origins are allowed.

## Firebase Service Account

1. Open the Firebase Console.
2. Select your project.
3. Go to Project settings > Service accounts.
4. Click Generate new private key.
5. Copy these values into your environment:
   - `project_id` -> `FIREBASE_PROJECT_ID`
   - `client_email` -> `FIREBASE_CLIENT_EMAIL`
   - `private_key` -> `FIREBASE_PRIVATE_KEY`

For Render, paste `FIREBASE_PRIVATE_KEY` as a single-line value with `\n` characters, or as a JSON string. This backend normalizes both formats.

## Gemini API Key

1. Open [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create an API key.
3. Add it as `GEMINI_API_KEY`.

This backend uses only `gemini-2.5-flash`.

## Authentication

Protected routes require a Firebase ID token:

```http
Authorization: Bearer <firebase-id-token>
```

The middleware verifies the token with Firebase Admin and attaches:

```js
req.user = { uid, email }
```

## API Endpoints

### GET `/api/health`

No auth required.

Example:

```bash
curl http://localhost:5000/api/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2026-07-22T10:00:00.000Z"
}
```

### POST `/api/analyze`

Protected. Upload a PDF resume using multipart/form-data field name `resume`.

Example:

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Authorization: Bearer <firebase-id-token>" \
  -F "resume=@/path/to/resume.pdf"
```

Response:

```json
{
  "atsScore": 82,
  "formattingScore": 10,
  "contentScore": 78,
  "readabilityScore": 90,
  "missingSections": ["Certifications"],
  "suggestions": ["Add a clear Certifications section."],
  "extractedText": "First 500 characters of extracted resume text..."
}
```

### POST `/api/match`

Protected. Compares resume data against a job description using rule-based keyword matching.

Example:

```bash
curl -X POST http://localhost:5000/api/match \
  -H "Authorization: Bearer <firebase-id-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeData": {
      "skills": ["React", "Node.js", "MongoDB"],
      "experience": [{"bullets": ["Built REST APIs using Node.js and Express."]}]
    },
    "jobDescription": "We need React, Node.js, TypeScript, AWS, Docker and REST API experience."
  }'
```

Response:

```json
{
  "matchPercentage": 50,
  "matchedKeywords": ["React", "Node.js", "REST API"],
  "missingKeywords": ["AWS", "Docker", "TypeScript"],
  "skillGaps": ["AWS", "Docker", "TypeScript"],
  "experienceGaps": ["Resume does not clearly show experience with: AWS, Docker, TypeScript."],
  "recommendations": ["Tailor the resume skills and experience sections to the job description."]
}
```

### POST `/api/ai/improve`

Protected. Improves a single resume bullet with Gemini.

Example:

```bash
curl -X POST http://localhost:5000/api/ai/improve \
  -H "Authorization: Bearer <firebase-id-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "bullet": "Worked on backend APIs",
    "context": "Built features for a resume builder app",
    "jobTitle": "Backend Developer"
  }'
```

Response:

```json
{
  "improved": "Developed scalable backend APIs for a resume builder platform, improving feature delivery and data flow reliability.",
  "explanation": "Starts with an action verb and focuses on ownership and impact."
}
```

### POST `/api/ai/summary`

Protected. Generates a 2-3 sentence professional summary.

Example:

```bash
curl -X POST http://localhost:5000/api/ai/summary \
  -H "Authorization: Bearer <firebase-id-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeData": {
      "personalInfo": {"name": "Asha Kumar"},
      "experience": [{"title": "Frontend Developer", "years": 2}],
      "education": [{"degree": "B.Tech Computer Science"}],
      "skills": ["React", "JavaScript", "Firebase"],
      "projects": ["AI Resume Builder"]
    }
  }'
```

Response:

```json
{
  "summary": "Frontend developer with 2 years of experience building responsive web applications with React, JavaScript, and Firebase. Strong focus on user-centric product development and scalable application architecture."
}
```

### POST `/api/ai/cover-letter`

Protected. Generates a cover letter under 300 words.

Example:

```bash
curl -X POST http://localhost:5000/api/ai/cover-letter \
  -H "Authorization: Bearer <firebase-id-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeData": {
      "personalInfo": {"name": "Asha Kumar"},
      "skills": ["React", "Node.js", "Firebase"],
      "experience": [{"title": "Full Stack Developer", "bullets": ["Built resume analysis features."]}]
    },
    "jobDescription": "Hiring a full stack developer with React, Node.js, Firebase and REST API experience.",
    "tone": "formal"
  }'
```

Response:

```json
{
  "coverLetter": "Dear Hiring Manager,...",
  "tone": "formal"
}
```

## Error Format

Errors return:

```json
{
  "error": "Descriptive message."
}
```

Common statuses:

- `400` invalid request body or upload
- `401` missing/invalid Firebase token
- `413` uploaded PDF larger than 5MB
- `422` PDF text could not be extracted
- `429` rate limit exceeded
- `500` server error

## Rate Limiting

The backend uses a simple in-memory limiter:

- 100 requests per IP
- 15-minute window

This is sufficient for a two-user demo on Render free tier. For larger production traffic, use a shared store such as Redis.

## Render Deployment

1. Push this backend to GitHub.
2. Create a new Render Web Service.
3. Choose Node.js environment.
4. Set build command:

```bash
npm install
```

5. Set start command:

```bash
npm start
```

6. Add environment variables in the Render dashboard:
   - `PORT`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`
   - `GEMINI_API_KEY`
   - `FRONTEND_URL` for production CORS, optional but recommended

7. Deploy and test:

```bash
curl https://your-render-service.onrender.com/api/health
```

## Notes

- The backend does not store user data.
- Firestore reads/writes should stay in the React frontend.
- Resume analysis and JD matching are rule-based to keep them fast and free.
- Gemini is used only for bullet improvement, summary generation, and cover letter generation.
