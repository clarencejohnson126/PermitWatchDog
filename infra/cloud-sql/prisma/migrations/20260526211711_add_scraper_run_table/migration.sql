-- CreateTable
CREATE TABLE "ScraperRun" (
    "id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL,
    "total_filings_ingested" INTEGER NOT NULL,
    "errors_count" INTEGER NOT NULL,
    "source_breakdown" JSONB NOT NULL,

    CONSTRAINT "ScraperRun_pkey" PRIMARY KEY ("id")
);
