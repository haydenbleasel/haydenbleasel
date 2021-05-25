import Layout from "../../components/layout";
import Link from "../../components/link";
import Section from "../../components/section";
import Role from "../../components/role";
import Title from "../../components/title";
import Outlink from "../../components/outlink";

const Work = () => (
  <Layout
    title="Selected Work"
    description="I’ve had the privilege of working with a wide range of companies and early-stage startups."
  >
    <Title sans="Selected" serif="Work" />

    <Section>
      <Role
        caption="2018 — Present"
        title="Director &amp; Lead Product Designer"
        subtitle="Jellypepper"
        id="jellypepper"
        image="/images/work/jellypepper.png"
      >
        <div>
          <p className="small">
            Jellypepper is an award-winning digital agency for bright ideas. I
            started Jellypepper in 2016 in an effort to explore the world a
            bit more, see how different industries and people worked.
          </p>
          <p className="small">
            I’m very hands-on, frequently spearheading or joining the product
            design and development teams in ideating, creating and shipping
            client experiences. It’s also helped me figure out what I care
            about, what I value and what I want to work on in the future.
          </p>
        </div>
        <div>
          <p className="small">
            It’s been a fantastic journey so far. I’ve grown a tight-knit team
            of 5, met some brilliant people and worked on all sorts of
            interesting projects in areas such as self-driving cars, future of
            work AI, ARM virtualization, 3D biotechnology, cybersecurity and
            even space logistics.
          </p>
          <p className="small">
            We’ve worked for a bunch of fantastic companies, browse{" "}
            <Link href="https://jellypepper.com/work">our case studies</Link>{" "}
            on our website.
          </p>
        </div>
      </Role>

      <Role
        caption="2016 — 2017"
        title="Head of Product and Design"
        subtitle="Spaceship"
        id="spaceship"
        image="/images/work/spaceship.png"
      >
        <div>
          <p className="small">
            Spaceship started in mid-2016 as a technology-focused
            superannuation fund (if you’re not from Down Under, superannuation
            is a bit like a 401k pension plan).
          </p>
          <p className="small">
            The idea was a new type of super fund focused on tech companies
            where you can get exposure in companies such as Apple, Google and
            Facebook - “invest where the world is going, not where it’s been”.
          </p>
          <p className="small">
            I joined Spaceship in September 2016. We raised $1.6M from
            Atlassian’s Mike Cannon-Brookes and ShowPo’s Jane Lu, then in June
            the next year raised $19.5M from NEA, Sequoia Capital and Valar
            Ventures.
          </p>
        </div>
        <div>
          <p className="small">
            During my time at Spaceship, I worked with some insanely talented
            people to grow a waitlist of 28,000 people, design and build the
            marketing website and superannuation portal. I also created the
            foundations of the Spaceship design system that ran our multiple
            platforms and contributed towards the overall brand styleguide.
          </p>
          <p className="small">
            Spaceship was a challenge and a rare opportunity to change the way
            milennials engaged with their finances. I loved the work we did at
            Spaceship and I hope they find the persistence to break through
            the regulatory restraints and truly disrupt the superannuation
            industry.
          </p>
        </div>
      </Role>

      <Role
        caption="2015"
        title="Product Design Intern"
        subtitle="Palantir"
        id="palantir"
        image="/images/work/palantir.png"
      >
        <div>
          <p className="small">
            For a few months in late 2015, I worked as a Product Design intern
            at Palantir’s Palo Alto HQ. I was part of a small team tasked with
            designing an anti-fraud focused pilot project. It was my first
            purely design-focused role and helped kickstart my career in
            Product Design.
          </p>
          <p className="small">
            Palantir is one of the most inspiring companies I’ve worked with.
            I learnt so much from their design team and was able to work on
            something that really impacted people’s lives. Hopefully I can
            work with them again one day.
          </p>
          <p className="small">
            The project I was working on consisted of three key parts. The
            first was an object-node graphing system called Graph View which
            built on the core visualisation techniques of their flagship
            product, Gotham. Isolated subsets of data from Graph View were
            brought into a relative, time-based visualisation system called
            Stacks.
          </p>
        </div>
        <div>
          <p className="small">
            Stacks helped show object frequency and positioning over time
            which could be used to find recurring patterns. The level of
            granularity required for most cases meant we needed a library that
            didn’t use a bezier curve to simplify things and allowed for
            dynamic scaling of time range.
          </p>
          <p className="small">
            The last part was an Object Viewer — an inspector for individual
            or small groups objects. It showed the object’s properties with
            varying visualisation based on property type — string, pointer,
            geolocation, etc. It also listed that object’s relationships to
            other important items. By doing this, you were able to inspect a
            particular object in detail then traverse its relationships.
          </p>
          <p className="small">
            I was also able to contribute a bit to their internal design
            system (now open-source) called Blueprint.
          </p>
        </div>
      </Role>

      <Role
        caption="2014 — 2015"
        title="Product Designer &amp; Front-End Developer"
        subtitle="Sumry"
        id="sumry"
        image="/images/work/sumry.png"
      >
        <div>
          <p className="small">
            Sumry is help you land your dream job by interweaving your unique
            story with your professional achievements, sprinkled with your own
            personality to create a timeline that help future employers
            understand the real you.
          </p>
          <p className="small">
            I initially joined the Sumry team in mid-2014 as a front-end
            developer. During this time, I learned to ideate, design, build
            and launch a real product. I was also fortunate enough to dabble
            in customer support, where I realised that startups have the
            unfair advantage of being able to really get to know their
            customers. Some of our users even used Sumry to get jobs at
            companies such as Facebook and Google.
          </p>
        </div>
        <div>
          <p className="small">
            My focus was designing and implemented an entirely new user
            interface and platform from ground up, built on Angular. I also
            spent a lot of time refining the logo, colour palette, social
            media and overall brand identity.
          </p>
          <p className="small">
            The overhaul was extensive and covered a lot of missing pieces in
            the product strategy. We created an analytics dashboard so users
            could see the impressions they were getting, gamified data
            collection by highlighting missing fields and profile completion
            and even added a great little feature called Storyteller — a
            guided approach to creating a profile by answering a few easy
            questions.
          </p>
        </div>
      </Role>
      
      <Outlink link="https://www.linkedin.com/in/haydenbleasel" text="View more work on LinkedIn" />
    </Section>
  </Layout>
);

export default Work;
