/*
  Warnings:

  - You are about to drop the column `userId` on the `Blogs` table. All the data in the column will be lost.
  - Added the required column `UserId` to the `Blogs` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Blogs] DROP CONSTRAINT [Blogs_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Blogs] DROP COLUMN [userId];
ALTER TABLE [dbo].[Blogs] ADD [UserId] NVARCHAR(1000) NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[Blogs] ADD CONSTRAINT [Blogs_UserId_fkey] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
