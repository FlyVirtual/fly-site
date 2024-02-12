import { PrismaClient } from "@prisma/client"
import { DateTime } from "luxon"
import type { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

const Stats = async (_: NextApiRequest, res: NextApiResponse) => {
  const [
    totalFlights,
    totalHours,
    totalMiles,
  ] = await prisma.$transaction([
    prisma.pirep.count({
      where: {
        accepted: {
          equals: 1,
        },
        submitdate: {
          gte: DateTime.now().startOf("month").toJSDate(),
          lte: DateTime.now().endOf("month").toJSDate()
        }
      },
    }),
    prisma.$queryRaw`SELECT SUM(TIME_TO_SEC(flighttime_stamp)) AS total FROM pireps WHERE accepted = 1 AND
    submitdate BETWEEN DATE_SUB(DATE(NOW()), INTERVAL DAY(NOW())-1 DAY) AND LAST_DAY(NOW())`,
    prisma.pirep.aggregate({
      _sum: {
        distance: true,
      },
      where: {
        accepted: {
          equals: 1,
        },
        submitdate: {
          gte: DateTime.now().startOf("month").toJSDate(),
          lte: DateTime.now().endOf("month").toJSDate()
        }
      },
    }),
  ])

  res.status(200).json({
    totalFlights,
    totalHours: Math.round((totalHours as any)[0].total / 3600),
    totalMiles: totalMiles._sum.distance,
  })
}

export default Stats
