import React from 'react';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import Client from '../../components/Client';

import styles from './Work.module.css';

type ClientDescriptionProps = {
  name: string,
  project_prefix: string,
  projects?: any,
}

function sortAlphabetically(a, b) {
  return b.data.name > a.data.name ? -1 : 1;
}

const jellypepperRoles = {
  'baraja': ['Creative Director', 'Visual Designer', 'Web Developer'],
  'brighte': ['Creative Director', 'Web Developer'],
  'clipchamp': ['Creative Director', 'Digital Product Designer'],
  'corellium': ['Creative Director', 'Visual Designer', 'Web Developer'],
  'faethm': ['Creative Director', 'Visual Designer', 'Web Developer'],
  'flirtey': ['Creative Director', 'Visual Designer', 'Web Developer'],
  'google': ['Creative Director', 'Visual Designer'],
  'inventia': ['Creative Director', 'Visual Designer', 'Web Developer'],
  'lightswap': ['Creative Director', 'Web Developer'],
  'pursuited': ['Creative Director', 'Visual Designer'],
  'ribit': ['Creative Director', 'Visual Designer'],
  'shippit': ['Creative Director', 'Visual Designer'],
  'simply-wall-st': ['Creative Director', 'Visual Designer'],
  'snug': ['Creative Director', 'Visual Designer'],
  'spaceship-voyager': ['Creative Director', 'Digital Product Designer'],
  'tank-stream-ventures': ['Creative Director', 'Visual Designer', 'Web Developer'],
  'upguard': ['Creative Director', 'Visual Designer', 'Web Developer'],
  'westfield': ['Creative Director', 'Digital Product Designer'],
  'zibbet': ['Creative Director', 'Digital Product Designer'],
};

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
      {projects.map(({ project_description, project_link }, index) => {

        const projectDescription = project_link.url ? (
          <Link href={project_link.url} target={project_link.target}>
            {project_description}
          </Link>
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

const Work = ({ jellypepperProjects }) => (
  <Layout title="Home | Next.js + TypeScript Example">

    <Hero
      title="Work"
      description="I’ve had the privilege of working with a wide range of companies and early-stage startups."
    />

    <h2>Jellypepper</h2>
    <p>Running an agency has given me the opportunity to see how companies from all different industries, all over the world, work and grow. My team and I have been fortunate enough to work with these folks...</p>

    <div className={styles.jellypepperProjects}>
      {jellypepperProjects.sort(sortAlphabetically).map(({ uid, data }) => (
        <div key={uid} id={uid}>
          <Client
            image={data.logo.url}
            title={data.name}
            summary={data.description}
            description={createClientDescription(data)}
            caption={`Roles: ${jellypepperRoles[uid]?.join(', ') ?? 'Creative Director'}`}
          />
        </div>
      ))}
    </div>

    <h2>Other roles</h2>
    <p>Outside Jellypepper, I have been fortunate enough to work with the following companies.</p>
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