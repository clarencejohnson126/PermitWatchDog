-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "gemarkung" TEXT NOT NULL,
    "flur" TEXT NOT NULL,
    "flurstueck" TEXT NOT NULL,
    "bauantrag_nr" TEXT NOT NULL,
    "aktenzeichen" TEXT NOT NULL,
    "lifecycle_stage" TEXT NOT NULL,
    "bescheid_auflagen" TEXT[],
    "abstandsflaeche_nachbarn" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
