-- People can ask for their account and data to be deleted.
ALTER TABLE "User" ADD COLUMN "deletionRequestedAt" TIMESTAMP(3);
