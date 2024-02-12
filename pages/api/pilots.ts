import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

const Pilots = async (_: NextApiRequest, res: NextApiResponse) => {
  const [pilotsGeneral, pilotsMonthly] = await prisma.$transaction([
    prisma.pilot.findMany({
      select: {
        pilotid: true,
        code: true,
        firstname: true,
        lastname: true,
        totalflights: true,
        totalhours: true,
        hub: true,
        retired: true,
        rank: {
          select: {
            rankimage: true,
          },
        },
        fieldValues: {
          select: {
            value: true,
            customfields: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    }),
    prisma.$queryRaw`SELECT pilots.pilotid, pilots.code, pilots.firstname, pilots.lastname, ROUND(SUM(pireps.flighttime), 2) hours, COUNT(pireps.pirepid) flights
    FROM pireps
    JOIN pilots ON pilots.pilotid = pireps.pilotid
    WHERE submitdate BETWEEN DATE_SUB(DATE(NOW()), INTERVAL DAY(NOW())-1 DAY) AND LAST_DAY(NOW())
    GROUP BY pilots.pilotid, pilots.code, pilots.firstname, pilots.lastname`,
  ])

  return res
    .status(200)
    .send(
      JSON.stringify({ pilotsGeneral, pilotsMonthly }, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    )
}

export default Pilots
