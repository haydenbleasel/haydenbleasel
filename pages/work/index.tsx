import React from 'react';
import Prismic from '@prismicio/client';
import Image from 'next/image';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import Client from '../../components/Client';
import jellypepperRoles from './jellypepperRoles.json';
import otherRoles from './otherRoles.json';
import styles from './Work.module.css';
import ArrowLink from '../../components/ArrowLink';
import { siteUrl } from '../../next-sitemap';

type ClientDescriptionProps = {
  name: string,
  project_prefix: string,
  projects?: any,
}

type ProjectLink = {
  url: string,
  target: string,
}

type Project = {
  project_description: string,
  project_link: ProjectLink,
}

type PrismicDocument = {
  uid: string,
  data: any,
}

type WorkProps = {
  jellypepperProjects: PrismicDocument[],
}

function sortAlphabetically(a: any, b: any) {
  return b.data.name > a.data.name ? -1 : 1;
}

const createClientDescription = ({
  name,
  project_prefix,
  projects = [],
}: ClientDescriptionProps) => {
  let description = `We helped ${name}`;
  
  if (project_prefix) {
    description += ` ${project_prefix}`;
  }

  if (projects.length) {
    description += ' with ';
  } else {
    description += '.';
  }

  return (
    <>
      <span>{description}</span>
      {projects.map(({ project_description, project_link }: Project, index: number) => {

        const projectDescription = project_link.url ? (
          <a href={project_link.url} target={project_link.target}>
            {project_description}
          </a>
        ) : (
          <span>{project_description}</span>
        );
        
        let projectDivider = (
          <span>, </span>
        );
        
        if (index === projects.length - 1) {
          projectDivider = (
            <span>.</span>
          );
        } else if (index === projects.length - 2) {
          projectDivider = (
            <span>&nbsp;and&nbsp;</span>
          );
        }

        return (
          <span key={index}>
            {projectDescription}
            {projectDivider}
          </span>
        )

        })}
    </>
  )
};

const Work = ({ jellypepperProjects }: WorkProps) => (
  <Layout
    title="Current and previous work"
    description="I’ve had the privilege of working with a wide range of companies and early-stage startups."
    image={{
      url: `${siteUrl}/images/work/cover.png`,
      width: 2628,
      height: 1752,
    }}
  >

    <Hero
      title="Work"
      description="I’ve had the privilege of working with a wide range of companies and early-stage startups."
    />

    <div className={styles.cover}>
      <Image
        layout="responsive"
        width={2628}
        height={1752}
        src="/images/work/cover.png"
        alt="Image of my concept UI work"
        quality={100}
      />
    </div>

    <div className={styles.projectsHeader}>
      <h2 className="heading-5">Jellypepper</h2>
      <p>Running an agency has given me the opportunity to see how companies from all different industries, all over the world, work and grow. My team and I have been fortunate enough to work with these folks...</p>
    </div>

    <div className={styles.projects}>
      {jellypepperProjects.sort(sortAlphabetically).map(({ uid, data }) => (
        <div key={uid} id={uid}>
          <Client
            image={data.logo.url}
            title={data.name}
            summary={data.description}
            description={createClientDescription(data)}
            caption={`Roles: ${['Creative Director', ...(jellypepperRoles[uid] || [])].join(', ')}`}
          />
        </div>
      ))}
    </div>

    <div className={styles.presumi}>
      <p>While I was in university, I created a product for job seekers called Presumi — a unique resume-tracking algorithm coupled with a beautiful candidate dashboard that I ended up licensing to SEEK in Hong Kong.</p>
      <ArrowLink color="var(--white)" href="/thoughts/presumi">Read the story</ArrowLink>
    </div>

    <div className={styles.projectsHeader}>
      <h2 className="heading-5">Other roles</h2>
      <p>Outside Jellypepper, I have been fortunate enough to work with the following companies.</p>
    </div>

    <div className={styles.projects}>
      {otherRoles.map(({ image, role, company, type, start, end, location, description }) => (
        <div key={company} id={company}>
          <Client
            image={image}
            title={company}
            summary={role}
            description={description}
            caption={`${type} from ${start} to ${end} in ${location}.`}
          />
        </div>
      ))}
    </div>
  </Layout>
);

export async function getStaticProps() {
  const {
    NEXT_PUBLIC_PRISMIC_ENDPOINT,
    NEXT_PUBLIC_PRISMIC_ACCESS_TOKEN,
  } = process.env;

  const client = Prismic.client(`https://${NEXT_PUBLIC_PRISMIC_ENDPOINT}.prismic.io/api/v2`, {
    accessToken: NEXT_PUBLIC_PRISMIC_ACCESS_TOKEN
  });

  const { results } = await client.query(
    Prismic.Predicates.at('document.type', 'client')
  );

  return {
    props: {
      jellypepperProjects: results,
    },
  }
}

export default Work;