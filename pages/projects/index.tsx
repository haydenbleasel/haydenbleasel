import { Fade } from "react-awesome-reveal";
import Layout from "../../components/Layout";
import { siteUrl } from "../../next-sitemap";
import Link from "../../components/Link";

import Section from "../../components/Section";
import Project from "../../components/Project";

const Projects = () => {
  return (
    <Layout
      name="Current and previous work"
      description="I’ve had the privilege of working with a wide range of companies and early-stage startups."
      image={{
        url: `${siteUrl}/images/work/cover.png`,
        width: 2628,
        height: 1752,
      }}
    >
      <Section>
        <h1>
          <span className="titleSans">Projects</span>
          <span className="titleSerif"> &amp; Apps</span>
        </h1>
      </Section>

      <Section>
        <Project
          date="2018 — Present"
          name="Neutral"
          role="Maker"
          link="https://neutral.sh/"
        >
          <div>
            <p>
              Neutral is a climate-focused app that combines a lifestyle
              questionnaire with U.S. EPA and other data sources to calculate
              your CO₂e emissions, then helps you offset it with a reforestation
              program.
            </p>
            <p>
              You can use it to calculate your carbon footprint, offset with a
              simple monthly subscription and follow your friends to track their
              impact.
            </p>
          </div>
          <div>
            <p>
              By partnering with environmental non-profits and tree-planting
              organisations, we’ve given you access to global reforestation
              initiatives, in your pocket, so you can offset your carbon
              emissions in your own backyard.
            </p>
            <p>
              So far, we’ve helped our users plant 1297 trees and offset 162.13
              tonnes of CO₂e across 31 programs.
            </p>
            <p>It’s just the beginning.</p>
          </div>
        </Project>

        <Project
          date="2016 — 2017"
          name="Bokeh"
          role="Designer"
          link="https://www.heybokeh.com/"
        >
          <div>
            <p>
              As part of my work at Tomorrow Studio, I’m currently designing
              Bokeh — an intelligent portfolio platform for professional
              photographers that grows with your work.
            </p>
          </div>
          <div>
            <p>
              It’s still very much in progress but you can follow along with my
              newest designs on Dribbble.
            </p>
          </div>
        </Project>

        <Project
          date="2014 — 2015"
          name="Presumi"
          role="Maker"
          link="/journal/presumi"
        >
          <div>
            <p>
              While in university, I created a product called Presumi — a
              resume-tracking and analytics platform that used a unique
              algorithm that allowed for detailed data collection all the way
              from the candidate to the employer.
            </p>
            <p>
              Built on top of this was a bespoke B2B analytics platform that
              used aggregated behavioural analytics to help employment
              marketplaces make strategic decisions.
            </p>
            <p>
              I started Presumi in 2016 as a B2C platform focused on helping
              candidates get their dream job. Before pivoting to B2B, we helped
              2000+ candidates secure jobs.
            </p>
          </div>
          <div>
            <p>
              After pivoting, I ended up licensing the platform to SEEK
              (Australia’s no. 1 jobs, employment, career and recruitment site)
              in Hong Kong for a while, where we managed 100K+ job applications
              and analysed 1M+ data points.
            </p>
            <p>
              Presumi was my first solo project where I designed and developed
              the entire platform from ground up. The front-end was built in
              React and Parse, the back-end was a unique resume tracking
              algorithm built in Node.js.
            </p>
          </div>
        </Project>
      </Section>
    </Layout>
  );
};

export default Projects;
