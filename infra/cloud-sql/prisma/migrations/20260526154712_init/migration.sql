-- CreateTable
CREATE TABLE "Filing" (
    "id" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "publish_date" TIMESTAMP(3) NOT NULL,
    "gemeinde" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content_text" TEXT NOT NULL,
    "pdf_storage_path" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Filing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Filing_source_url_key" ON "Filing"("source_url");
