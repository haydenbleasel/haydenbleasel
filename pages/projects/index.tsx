import { siteUrl } from "../../next-sitemap";
import Layout from "../../components/layout";
import Section from "../../components/section";
import Role from "../../components/role";
import Title from "../../components/title";

const Projects = () => (
  <Layout
    title="Current and previous work"
    description="I’ve had the privilege of working with a wide range of companies and early-stage startups."
    image={{
      url: `${siteUrl}/images/work/cover.png`,
      width: 2628,
      height: 1752,
    }}
  >
    <Title sans="Projects" serif="&amp; Apps" />

    <Section>
      <Role
        caption="Currently growing"
        title="Neutral"
        id="neutral"
        subtitle="Maker"
        link="https://neutral.sh/"
        image="/images/projects/neutral.png"
      >
        <div>
          <p className="small">
            Neutral is a climate-focused app that combines a lifestyle
            questionnaire with U.S. EPA and other data sources to calculate
            your CO₂e emissions, then helps you offset it with a reforestation
            program.
          </p>
          <p className="small">
            You can use it to calculate your carbon footprint, offset with a
            simple monthly subscription and follow your friends to track their
            impact.
          </p>
        </div>
        <div>
          <p className="small">
            By partnering with environmental non-profits and tree-planting
            organisations, we’ve given you access to global reforestation
            initiatives, in your pocket, so you can offset your carbon
            emissions in your own backyard.
          </p>
          <p className="small">
            So far, we’ve helped our users plant over a thousand trees and offset hundreds of
            tonnes of CO₂e. It’s just the beginning.</p>
        </div>
      </Role>

      <Role
        caption="Currently designing"
        title="Bokeh"
        id="bokeh"
        subtitle="Designer"
        link="https://www.heybokeh.com/"
        image="/images/projects/bokeh.png"
      >
        <div>
          <p className="small">
            As part of my work at Tomorrow Studio, I’m currently designing
            Bokeh — an intelligent portfolio platform for professional
            photographers that grows with your work.
          </p>
        </div>
        <div>
          <p className="small">
            It’s still very much in progress but you can follow along with my
            newest designs on Dribbble.
          </p>
        </div>
      </Role>

      <Role
        caption="Shut down"
        title="Presumi"
        id="presumi"
        subtitle="Maker"
        link="https://haydenbleasel.medium.com/presumi-4d4a2ba0fc6c?source=rss-7e02ca3f6f37------2"
        image="/images/projects/presumi.png"
      >
        <div>
          <p className="small">
            While in university, I created a product called Presumi — a
            resume-tracking and analytics platform that used a unique
            algorithm that allowed for detailed data collection all the way
            from the candidate to the employer.
          </p>
          <p className="small">
            Built on top of this was a bespoke B2B analytics platform that
            used aggregated behavioural analytics to help employment
            marketplaces make strategic decisions.
          </p>
          <p className="small">
            I started Presumi in 2016 as a B2C platform focused on helping
            candidates get their dream job. Before pivoting to B2B, we helped
            2000+ candidates secure jobs.
          </p>
        </div>
        <div>
          <p className="small">
            After pivoting, I ended up licensing the platform to SEEK
            (Australia’s no. 1 jobs, employment, career and recruitment site)
            in Hong Kong for a while, where we managed 100K+ job applications
            and analysed 1M+ data points.
          </p>
          <p className="small">
            Presumi was my first solo project where I designed and developed
            the entire platform from ground up. The front-end was built in
            React and Parse, the back-end was a unique resume tracking
            algorithm built in Node.js.
          </p>
        </div>
      </Role>
    </Section>
  </Layout>
);

export default Projects;
