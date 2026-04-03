"""Application configuration"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    DATABASE_URL: str
    SECRET_KEY: str
    ADMIN_OTP_EMAIL: str = "Usacademyofeducation@gmail.com"
    
    # JWT Settings
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Gmail SMTP settings for admin OTP
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""

    # CORS Settings
    CORS_ORIGINS: str = (
        "http://localhost:3000,"
        "http://localhost:3001,"
        "http://127.0.0.1:3000,"
        "http://127.0.0.1:3001,"
        "http://localhost:5173,"
        "http://127.0.0.1:5173,"
        "https://sms-frontend-s0pu.onrender.com"
    )
    CORS_ALLOW_ORIGIN_REGEX: str = (
        r"https://.*\.onrender\.com"
    )
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


settings = Settings()
