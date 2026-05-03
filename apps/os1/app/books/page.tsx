import type { Metadata } from "next";
import Image from "next/image";

import { PageHeader } from "@/components/page-header";
import { getRead, getReading, getToRead } from "@/lib/oku";
import type { OkuBook } from "@/lib/oku";

export const metadata: Metadata = {
  description: "What I've been reading on Oku.",
  title: "Books | OS1",
};

const Book = ({ book }: { book: OkuBook }) => (
  <a
    href={book.link}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-4 rounded-lg px-3 py-2 no-underline transition-colors hover:bg-accent"
  >
    {book.cover && (
      <Image
        src={book.cover}
        alt={book.title}
        className="h-14 w-10 shrink-0 rounded object-cover"
        width={40}
        height={56}
      />
    )}
    <div className="min-w-0 flex-1">
      <p className="truncate font-medium text-foreground">{book.title}</p>
      <p className="truncate text-sm text-muted-foreground">{book.author}</p>
    </div>
  </a>
);

const BooksPage = async () => {
  const [reading, read, toRead] = await Promise.all([
    getReading(),
    getRead(),
    getToRead(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Books"
        description={
          <>
            What I&apos;ve been reading on Oku.{" "}
            {reading.length + read.length + toRead.length} books tracked.
          </>
        }
      />

      {reading.length > 0 && (
        <section className="flex flex-col gap-2 rounded-2xl bg-sidebar p-2">
          <div className="px-4 pt-2 pb-1">
            <h2 className="text-sm font-medium text-muted-foreground">
              Currently Reading
            </h2>
          </div>
          <div className="grid gap-2 rounded-2xl bg-background p-2 shadow-sm/5">
            {reading.map((book) => (
              <Book key={book.link} book={book} />
            ))}
          </div>
        </section>
      )}

      {read.length > 0 && (
        <section className="flex flex-col gap-2 rounded-2xl bg-sidebar p-2">
          <div className="px-4 pt-2 pb-1">
            <h2 className="text-sm font-medium text-muted-foreground">Read</h2>
          </div>
          <div className="grid gap-2 rounded-2xl bg-background p-2 shadow-sm/5">
            {read.map((book) => (
              <Book key={book.link} book={book} />
            ))}
          </div>
        </section>
      )}

      {toRead.length > 0 && (
        <section className="flex flex-col gap-2 rounded-2xl bg-sidebar p-2">
          <div className="px-4 pt-2 pb-1">
            <h2 className="text-sm font-medium text-muted-foreground">
              To Read
            </h2>
          </div>
          <div className="grid gap-2 rounded-2xl bg-background p-2 shadow-sm/5">
            {toRead.map((book) => (
              <Book key={book.link} book={book} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BooksPage;
