declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    SESSION_SECRET: string;
    CORS_ORIGIN: string;
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URI: string;
    REFRESH_TOKEN: string;
  }
}