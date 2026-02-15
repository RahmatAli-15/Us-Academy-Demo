# US Academy School Management System

Full-stack school management project with:
- `backend`: FastAPI + SQLAlchemy + PostgreSQL
- `frontend`: React (Vite) + Tailwind CSS
- `backend/uploads`: uploaded PDFs (served as static files)

## Project Structure

```text
abc/
|-- backend/
|   |-- app/
|   |-- uploads/
|   |-- .env
|   |-- .env.example
|   `-- requirements.txt
|-- frontend/
|   |-- src/
|   `-- package.json
`-- uploads/
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL

## Backend Setup

1. Open terminal in `backend`:

```powershell
cd backend
```

2. Create and activate virtual environment:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

3. Install dependencies:

```powershell
pip install -r requirements.txt
```

4. Configure environment:

```powershell
Copy-Item .env.example .env
```

Set values in `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SECRET_KEY=replace_with_a_secure_secret
```

5. Run backend:

```powershell
uvicorn app.main:app --reload
```

Backend URLs:
- API: `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`
- Health: `http://127.0.0.1:8000/health`

## Frontend Setup

1. Open terminal in `frontend`:

```powershell
cd frontend
```

2. Install dependencies:

```powershell
npm install
```

3. Create frontend env file (if missing) and set API base URL:

```env
VITE_API_URL=http://127.0.0.1:8000
```

4. Run frontend:

```powershell
npm run dev
```

Frontend URL (default Vite):
- `http://127.0.0.1:5173`

## Authentication

Default admin is auto-created on backend startup:
- Username: `admin`
- Password: `Admin@123`

Student login uses:
- `student_id`
- `dob`

## PDF Upload/Download

Uploaded files are stored under `backend/uploads/<category>/<filename>.pdf`.

Static file routes:
- `GET /uploads/<subfolder>/<filename>`
- `GET /notice/<filename>` (legacy compatibility)

Forced download route:
- `GET /pdfs/download/{filename}`

Examples:
- `http://127.0.0.1:8000/uploads/notice/example.pdf`
- `http://127.0.0.1:8000/notice/example.pdf`
- `http://127.0.0.1:8000/pdfs/download/example.pdf`

## Notes

- Backend CORS currently allows:
  - `http://localhost:3000`
  - `http://localhost:3001`
  - `http://127.0.0.1:3000`
  - `http://127.0.0.1:3001`
- If you run frontend on another port (for example `5173`), add it to backend CORS in `backend/app/main.py`.

## Common Troubleshooting

1. `404` for PDF URL:
- Verify file exists in `backend/uploads/...`
- Confirm backend is restarted after config changes.

2. `401 Unauthorized` in frontend:
- Login again to refresh token.

3. DB connection errors:
- Check PostgreSQL is running.
- Validate `DATABASE_URL`.

4. CORS error in browser:
- Add your frontend origin to `allow_origins` in `backend/app/main.py`.

## Scripts

Frontend:
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

Backend:
- `uvicorn app.main:app --reload`
