-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('MANAGE', 'CREATE', 'READ', 'WRITE', 'DELETE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "permission" "Permission"[];
