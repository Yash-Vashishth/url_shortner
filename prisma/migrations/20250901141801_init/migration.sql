-- CreateTable
CREATE TABLE "public"."url" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "url_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "url_url_key" ON "public"."url"("url");

-- CreateIndex
CREATE UNIQUE INDEX "url_slug_key" ON "public"."url"("slug");
