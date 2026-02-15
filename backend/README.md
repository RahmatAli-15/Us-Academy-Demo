# Backend API

Production-ready FastAPI backend with PostgreSQL, SQLAlchemy ORM, and python-dotenv.

## Project Structure

```
backend/
├── app/
│   ├── core/
│   │   ├── config.py       # Configuration management
│   │   └── database.py     # Database engine and session
│   ├── models/             # SQLAlchemy models
│   ├── schemas/            # Pydantic schemas
│   ├── routes/             # API route handlers
│   ├── enums/              # Application enums
│   ├── services/           # Business logic
│   └── main.py             # FastAPI application
├── .env                    # Environment variables (don't commit)
├── .env.example            # Environment variables template
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## Setup Instructions

### 1. Create Python Virtual Environment

```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On Unix/macOS
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update with your settings:

```bash
cp .env.example .env
```

Then edit `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SECRET_KEY=your-actual-secret-key
```

### 4. Ensure PostgreSQL is Running

Make sure your PostgreSQL database exists and is accessible via the `DATABASE_URL`.

### 5. Run the Application

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## Development

- **Models**: Add SQLAlchemy models in `app/models/`
- **Schemas**: Add Pydantic request/response schemas in `app/schemas/`
- **Routes**: Add API endpoints in `app/routes/`
- **Services**: Add business logic in `app/services/`
- **Enums**: Add enumeration types in `app/enums/`

## Database Migrations

For database schema migrations, consider using Alembic (not included in this base setup).

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Secret key for JWT tokens or other security purposes

## Production Deployment

Before deploying to production:

1. Set `SECRET_KEY` to a secure random string
2. Update `DATABASE_URL` with production database credentials
3. Set `echo=False` in `database.py` to disable SQL logging
4. Use a production ASGI server like Gunicorn with Uvicorn workers
5. Add proper error handling and logging
6. Configure CORS if needed

Example production run:
```bash
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```
