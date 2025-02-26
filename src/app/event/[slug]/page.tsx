import H1 from "@/components/H1";
import { getEvent } from "@/lib/server-utils";
import { Metadata } from "next";
import Image from "next/image";

type EventPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const slug = params.slug;

  const event = await getEvent(slug);

  return {
    title: event.name,
  };
}

export async function generateStaticParams() {
  // This function is part of Next.js Static Site Generation (SSG) process
  // It pre-generates paths for the most popular event pages at build time
  // This improves performance by serving pre-rendered pages instantly

  // TODO: Replace with actual logic to fetch top 100 most popular events
  // For now, we're using a hardcoded list of example slugs
  return [
    { slug: "comedy-extravaganza" },
    { slug: "dj-practice-session" },
    // ... more slugs would be added here
  ];

  // Each object in this array will generate a static page at build time
  // The 'slug' property corresponds to the [slug] dynamic segment in the route
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = params;
  const event = await getEvent(slug);
  console.log(event);

  return (
    <main>
      <section className="relative overflow-hidden flex justify-center items-center py-14 md:py-20">
        <Image
          src={event.imageUrl}
          alt="Event background image"
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover z-0 blur-3xl"
          quality={50}
          priority
        />
        <div className="z-1 relative flex flex-col gap-6 lg:gap-16 lg:flex-row">
          <Image
            src={event.imageUrl}
            alt={event.name}
            width={300}
            height={201}
            className="rounded-xl border-2 border-white/50 object-cover"
          />
          <div className="flex flex-col">
            <p className="text-white/75">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>

            <H1 className="mb-2 mt-1 whitespace-nowrap lg:text-5xl">
              {event.name}
            </H1>

            <p className="whitespace-nowrap text-xl text-white/75">
              Organised by
              <span className="italic"> {event.organizerName}</span>
            </p>

            <button className="bg-white/20 text-lg mt-5 capitalize  w-[95vw] sm:w-full py-2 rounded-md border-white/10 border-2 lg:mt-auto state-effects">
              Get tickets
            </button>
          </div>
        </div>
      </section>

      <div className="min-h-[75vh] text-center px-5 py-16">
        <Section>
          <h2 className="text-2xl mb-8">About this event</h2>
          <p className="max-w-4xl mx-auto text-lg leading-8 text-white/75">
            {event.description}
          </p>
        </Section>

        <Section>
          <h2 className="text-2xl mb-8">Location</h2>
          <p className="max-w-4xl mx-auto text-lg leading-8 text-white/75">
            {event.location}
          </p>
        </Section>
      </div>
    </main>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <section className="mb-12">{children}</section>;
}
