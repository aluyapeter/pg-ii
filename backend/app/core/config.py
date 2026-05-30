from pydantic_settings import SettingsConfigDict, BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Productivity Gourmet API"
    DATABASE_URL: str

    ENVIRONMENT: str = "development"

    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    ADMIN_USERNAME: str
    ADMIN_PASSWORD_HASH: str
    JWT_SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    FRONTEND_URL: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"

settings = Settings()