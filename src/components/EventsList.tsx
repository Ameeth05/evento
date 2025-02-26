import EventCard from "./EventCard";
import { getEvents } from "@/lib/server-utils";
import PaginationControls from "./PaginationControls";

type EventsListProps = {
  city: string;
  page?: number;
};

export default async function EventsList({ city, page = 1 }: EventsListProps) {
  // Add artificial delay
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  const { events, totalCount } = await getEvents(city, page);

  const previousPath = page > 1 ? `/events/${city}?page=${page - 1}` : "";
  const nextPath =
    totalCount > page * 6 ? `/events/${city}?page=${page + 1}` : "";
  return (
    <section className="max-w-[1100px] flex flex-wrap gap-10 justify-center px-[20px]">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}

      <PaginationControls previousPath={previousPath} nextPath={nextPath} />
    </section>
  );
}
