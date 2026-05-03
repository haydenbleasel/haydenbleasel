import { Suspense } from "react";

import { CallToAction } from "@/components/call-to-action";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Newsletter } from "@/components/newsletter";
import { OS1 } from "@/components/os1";
import { Projects } from "@/components/projects";
import { Section } from "@/components/section";
import { Speaking } from "@/components/speaking";
import { Work } from "@/components/work";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  image: "https://haydenbleasel.com/opengraph-image.png",
  jobTitle: "Member of Technical Staff",
  name: "Hayden Bleasel",
  sameAs: [
    "https://x.com/haydenbleasel",
    "https://www.linkedin.com/in/haydenbleasel/",
    "https://github.com/haydenbleasel",
  ],
  url: "https://haydenbleasel.com",
  worksFor: {
    "@type": "Organization",
    name: "OpenAI",
  },
};

const Home = () => (
  <>
    <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    <Header>
      <Hero />
      <Suspense
        fallback={
          <p>
            Follow me on{" "}
            <a
              href="https://x.com/haydenbleasel"
              rel="noopener noreferrer"
              target="_blank"
            >
              X
            </a>
            , or join my mailing list below for infrequent updates.
          </p>
        }
      >
        <CallToAction />
      </Suspense>
      <Newsletter />
    </Header>
    <Section title="Work">
      <Work />
    </Section>
    <Section title="Projects">
      <Projects />
    </Section>
    <Section title="Speaking & Interviews">
      <Speaking />
    </Section>
    <OS1 />
  </>
);

export default Home;
