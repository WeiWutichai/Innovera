-- Fix schema/DB drift: a prior migration (20260120080455_add_owner_role_and_user_products)
-- set User.isApproved DEFAULT true, which silently auto-approved every new
-- credential signup and disabled the admin approval gate. The Prisma schema
-- has always declared @default(false); this realigns the database with it.
--
-- NOTE: existing rows are intentionally left unchanged so currently-approved
-- users are not locked out. Admins should audit accounts created while the
-- default was true.
ALTER TABLE "User" ALTER COLUMN "isApproved" SET DEFAULT false;
