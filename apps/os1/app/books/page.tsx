import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@haydenbleasel/design-system/components/ui/tabs";
import type { Metadata } from "next";
import Image from "next/image";

import { PageBody, PageHeader } from "@/components/page-header";
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

  const sections = [
    { books: reading, label: "Currently Reading", value: "reading" },
    { books: read, label: "Read", value: "read" },
    { books: toRead, label: "To Read", value: "to-read" },
  ].filter((section) => section.books.length > 0);

  return (
    <Tabs defaultValue={sections[0]?.value}>
      <PageHeader title="Books" withTabs>
        <TabsList className="gap-4" variant="line">
          {sections.map((section) => (
            <TabsTrigger
              className="flex-none px-0 font-normal"
              key={section.value}
              value={section.value}
            >
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </PageHeader>

      <PageBody>
        {sections.map((section) => (
          <TabsContent key={section.value} value={section.value}>
            <div className="-ml-3 -mt-2 grid gap-2">
              {section.books.map((book) => (
                <Book key={book.link} book={book} />
              ))}
            </div>
          </TabsContent>
        ))}
      </PageBody>
    </Tabs>
  );
};

export default BooksPage;
