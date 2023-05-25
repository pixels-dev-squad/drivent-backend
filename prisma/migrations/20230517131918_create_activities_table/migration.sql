-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "startsAt" TIME NOT NULL,
    "endsAt" TIME NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activities_booking" (
    "id" SERIAL NOT NULL,
    "activityId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Activities_booking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activities_booking" ADD CONSTRAINT "Activities_booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activities_booking" ADD CONSTRAINT "Activities_booking_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
