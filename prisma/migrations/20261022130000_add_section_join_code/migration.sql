-- Students join a class with its short code. Adding the column with a
-- volatile default gives every existing class its own code.
ALTER TABLE "Section" ADD COLUMN "joinCode" TEXT NOT NULL DEFAULT upper(substr(md5((random())::text || (clock_timestamp())::text), 1, 6));

CREATE UNIQUE INDEX "Section_joinCode_key" ON "Section"("joinCode");
