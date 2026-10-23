-- Accounts created or reset by the registrar start with a temporary
-- password that must be changed at first sign-in.
ALTER TABLE "User" ADD COLUMN "mustChangePassword" BOOLEAN NOT NULL DEFAULT false;
