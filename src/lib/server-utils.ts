import "server-only";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import prisma from "./db";
import { capitalize } from "./utils";

export async function getEvents(city: string, page = 1) {
  // const response = await fetch(
  //   `https://bytegrad.com/course-assets/projects/evento/api/events?city=${city}`,

  //   // It prevents the data caching
  //   // {
  //   //   cache: "no-cache",
  //   // }

  //   {
  //     // This sets the revalidation time for the data fetching to 300 seconds (5 minutes).
  //     // It ensures that the data is re-fetched from the server every 5 minutes,
  //     // keeping the page content relatively fresh without overloading the server with requests.
  //     next: {
  //       revalidate: 300,
  //     },
  //   }
  // );

  // const events: EventoEvent[] = await response.json();

  const events = await prisma.eventoEvent.findMany({
    where: {
      city: city === "all" ? undefined : capitalize(city),
    },
    orderBy: {
      date: "asc",
    },
    take: 6,
    skip: (page - 1) * 6,
  });

  let totalCount;
  if (city === "all") {
    totalCount = await prisma.eventoEvent.count();
  } else {
    totalCount = await prisma.eventoEvent.count({
      where: {
        city: capitalize(city),
      },
    });
  }

  return {
    events,
    totalCount,
  };
}

// export async function getEvent(slug: string) {
//   const event = await prisma.eventoEvent.findUnique({
//     where: {
//       slug: slug,
//     },
//   });

//   if (!event) {
//     return notFound();
//   }

//   return event;
// }

// Prisma doesn't automatically cache query results like the Fetch API does.
// To implement caching for Prisma queries, we need to use unstable_cache.
// This allows us to cache the results and improve performance for repeated queries.

export const getEvent = unstable_cache(async (slug: string) => {
  const event = await prisma.eventoEvent.findUnique({
    where: {
      slug: slug,
    },
  });

  if (!event) {
    return notFound();
  }

  return event;
});
