-- Auth.js (NextAuth v5) Prisma Adapter tables
-- Required by PrismaAdapter + strategy: 'database' in app/lib/auth/auth.ts.
-- These tables store OAuth accounts, database-backed sessions, and
-- magic-link / email verification tokens.

-- CreateTable: Auth.js User (auth identity, separate from domain UserAccount)
CREATE TABLE "users" (
  "id"             TEXT         NOT NULL,
  "name"           TEXT,
  "email"          TEXT,
  "email_verified" TIMESTAMP(3),
  "image"          TEXT,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateTable: Auth.js Account (OAuth provider linkage)
CREATE TABLE "accounts" (
  "id"                   TEXT    NOT NULL,
  "user_id"              TEXT    NOT NULL,
  "type"                 TEXT    NOT NULL,
  "provider"             TEXT    NOT NULL,
  "provider_account_id"  TEXT    NOT NULL,
  "refresh_token"        TEXT,
  "access_token"         TEXT,
  "expires_at"           INTEGER,
  "token_type"           TEXT,
  "scope"                TEXT,
  "id_token"             TEXT,
  "session_state"        TEXT,
  CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key"
  ON "accounts"("provider", "provider_account_id");

-- CreateTable: Auth.js Session (database-backed sessions)
CREATE TABLE "sessions" (
  "id"            TEXT         NOT NULL,
  "session_token" TEXT         NOT NULL,
  "user_id"       TEXT         NOT NULL,
  "expires"       TIMESTAMP(3) NOT NULL,
  CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateTable: Auth.js VerificationToken (magic-link / email tokens)
CREATE TABLE "verificationtokens" (
  "identifier" TEXT         NOT NULL,
  "token"      TEXT         NOT NULL,
  "expires"    TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_token_key"
  ON "verificationtokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key"
  ON "verificationtokens"("identifier", "token");

-- AddForeignKey: accounts.user_id -> users.id
ALTER TABLE "accounts"
  ADD CONSTRAINT "accounts_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: sessions.user_id -> users.id
ALTER TABLE "sessions"
  ADD CONSTRAINT "sessions_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
