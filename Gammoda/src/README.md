# Gammo Development Association - Careers Website

A modern, responsive careers website for Gammo Development Association (GamoDA) that allows users to browse jobs, create candidate profiles, apply for positions, and track application status.

## Features

### Public Pages
- **Home**: Hero section with company overview and featured projects
- **About**: Mission, vision, values, team, and timeline
- **Portfolio**: Filterable project gallery showcasing community impact
- **Contact**: Contact form and company information
- **Careers**: Searchable, filterable job listings
- **Job Details**: Full job descriptions with apply functionality

### Candidate Features
- **Authentication**: Register and login with JWT-based auth
- **Profile Management**: Update personal information and upload resume
- **Job Applications**: Apply to jobs with resume and cover letter
- **Application Tracking**: View application status and history

## Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Axios** for API calls
- **Lucide React** for icons
- **Sonner** for toast notifications

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gda-careers
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK_MODE=true
```

5. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Mock Mode vs Real API

### Mock Mode (Default)
The application runs with mock data by default, perfect for development and testing without a backend.

To use mock mode, set in `.env`:
```env
VITE_USE_MOCK_MODE=true
```

### Real API Mode
To connect to your backend API:

1. Set `VITE_USE_MOCK_MODE=false` in `.env`
2. Update `VITE_API_BASE_URL` to your API endpoint
3. Ensure your backend implements the API contract below

## API Contract

### Jobs

**GET** `/api/jobs?search=&department=&location=&status=&page=&limit=`
- Response: `{ data: Job[], total: number, page: number, limit: number }`

**GET** `/api/jobs/:id`
- Response: `Job` object

**POST** `/api/jobs` (Admin)
- Create new job posting

**PATCH** `/api/jobs/:id` (Admin)
- Update job posting

**DELETE** `/api/jobs/:id` (Admin)
- Delete job posting

### Candidates & Applications

**POST** `/api/candidates/register`
- Body: `{ name, email, password, phone? }`
- Response: `{ token: string, user: Candidate }`

**POST** `/api/candidates/login`
- Body: `{ email, password }`
- Response: `{ token: string, user: Candidate }`

**GET** `/api/candidates/me` (Auth required)
- Response: `Candidate` object with applications

**POST** `/api/candidates/apply` (Auth required)
- Body: `multipart/form-data` with `jobId`, `resume` file, `coverLetter`
- Response: `{ applicationId: string, status: string }`

**PATCH** `/api/candidates/profile` (Auth required)
- Body: Candidate data or `multipart/form-data` for resume upload
- Response: Updated `Candidate` object

### Types

```typescript
interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  jobType: string;
  salaryRange?: string;
  status: "open" | "closed" | "draft";
  postedDate: string;
  closingDate?: string;
  description: string;
  requirements: string;
  applicationsCount?: number;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  resume?: {
    filename: string;
    url: string;
  };
  applications?: Application[];
}

interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  status: ApplicationStatus;
  appliedDate: string;
  coverLetter?: string;
  statusHistory: StatusHistoryItem[];
}

type ApplicationStatus = 
  | "applied"
  | "under_review"
  | "shortlisted"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";
```

## Branding & Logo

The site uses "Gammo Development Association" (GamoDA) branding with a configurable logo.

### Updating the Logo

1. Replace `/public/assets/logo.svg` with your logo file
2. Or update the `logoSrc` in `/config/siteConfig.ts`:

```typescript
export const siteConfig = {
  logoSrc: "/path/to/your/logo.png", // Update this
  // ...
};
```

The Logo component automatically shows "GDA" initials as a fallback if the logo file is not found.

### Updating Company Information

Edit `/config/siteConfig.ts` to update:
- Company name and contact information
- Social media links
- Navigation structure

## Project Structure

```
/
├── config/
│   ├── siteConfig.ts       # Company branding and site configuration
│   └── apiConfig.ts        # API endpoints and configuration
├── components/
│   ├── Logo.tsx            # Configurable logo component
│   ├── Header.tsx          # Site header with navigation
│   ├── Footer.tsx          # Site footer
│   ├── SEO.tsx             # SEO meta tags component
│   ├── JobCard.tsx         # Job listing card
│   └── ui/                 # shadcn/ui components
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Portfolio.tsx
│   ├── Contact.tsx
│   ├── Careers.tsx
│   ├── JobDetail.tsx
│   ├── JobApply.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Dashboard.tsx
├── contexts/
│   └── AuthContext.tsx     # Authentication context
├── utils/
│   ├── api.ts              # API client wrapper
│   └── mockApi.ts          # Mock API implementation
├── types/
│   └── index.ts            # TypeScript type definitions
└── App.tsx                 # Main app with routing
```

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Testing

```bash
# Run tests
npm test

# Run E2E tests
npm run test:e2e
```

## Security Considerations

- Uses JWT tokens for authentication
- Stores auth tokens in localStorage
- File upload validation (size and type)
- Protected routes for authenticated users
- CORS configuration required on backend
- Use HTTPS in production
- Implement rate limiting on backend
- Add CAPTCHA for application submissions

## Integration with HR Backend

The careers site is designed to integrate with your existing HR backend system. Job postings created/updated in the HR system should be reflected on this site.

Recommended approaches:
1. **Polling**: Frontend re-fetches jobs every 30-60 seconds
2. **Webhooks**: Backend notifies frontend of changes
3. **SSR/SSG**: Use Next.js with ISR for automatic updates

## Acceptance Criteria

✅ Candidate can sign up and create profile  
✅ Candidate can upload and update resume  
✅ Candidate can browse and search jobs  
✅ Candidate can apply to jobs  
✅ Candidate can view application status  
✅ Public job changes reflect within 60 seconds (configurable)  
✅ Responsive design across all devices  
✅ Accessible with keyboard navigation  
✅ SEO-friendly job pages  

## Support

For questions or issues, contact: careers@gamoda.org

## License

Copyright © 2025 Gammo Development Association. All rights reserved.
