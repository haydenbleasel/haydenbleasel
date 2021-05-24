import { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';
import { Fade } from 'react-awesome-reveal';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import Client from '../../components/Client';
import styles from './Work.module.css';
import ArrowLink from '../../components/ArrowLink';
import { siteUrl } from '../../next-sitemap';
import Link from '../../components/Link';

import jellypepperClients from './jellypepperClients.json';
import jellypepperRoles from './jellypepperRoles.json';
import otherRoles from './otherRoles.json';

const PresumiAnimation = dynamic(() => import('../../components/Presumi'));

type ClientDescriptionProps = {
  name: string,
  prefix: string,
  projects?: any,
}

type Project = {
  name: string,
  link?: string,
}

function sortAlphabetically(a: any, b: any) {
  return b.name > a.name ? -1 : 1;
}

const createClientDescription = ({
  name,
  prefix,
  projects = [],
}: ClientDescriptionProps) => {
  let description = `We helped ${name}`;
  
  if (prefix) {
    description += ` ${prefix}`;
  }

  if (projects.length) {
    description += ' with ';
  } else {
    description += '.';
  }

  return (
    <>
      <span>{description}</span>
      {projects.map(({ name, link }: Project, index: number) => {

        const projectDescription = link ? (
          <Link href={link}>
            {name}
          </Link>
        ) : (
          <span>{name}</span>
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
        );

      })}
    </>
  )
};

const Work = () => {

  const [animationLoaded, setAnimationLoaded] = useState(false);
  const { ref, inView } = useInView({ threshold: 0, rootMargin: '100px' });

  useEffect(() => {
    (inView && !animationLoaded) && setAnimationLoaded(true);
  }, [inView]);
  
  return (
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

      <div className={`${styles.cover} grow`}>
        <Fade triggerOnce delay={800}>
          <Image
            layout="responsive"
            width={2628}
            height={1752}
            src="/images/work/cover.png"
            alt="Image of my concept UI work"
            quality={100}
          />
        </Fade>
      </div>

      <Fade triggerOnce>
        <div className={styles.projectsHeader}>
          <h2 className="heading-5">Jellypepper</h2>
          <p>Running an agency has given me the opportunity to see how companies from all different industries, all over the world, work and grow. My team and I have been fortunate enough to work with these folks...</p>
        </div>
      </Fade>

      <div className={styles.projects}>
        {[...jellypepperClients.startups, ...jellypepperClients.other].sort(sortAlphabetically).map((data, index) => (
          <div key={data.id} id={`jellypepper-${data.id}`}>
            <Fade triggerOnce delay={(index % 3) * 100}>
              <Client
                image={`/images/work/${data.id}.svg`}
                title={data.name}
                summary={data.tagline}
                description={createClientDescription(data)}
                caption={`Roles: ${['Creative Director', ...(jellypepperRoles[data.id] || [])].join(', ')}`}
              />
            </Fade>
          </div>
        ))}
      </div>

      <div className={styles.presumi} ref={ref}>
        <div className={styles.presumiInfo}>
          <p>While I was in university, I created a product for job seekers called Presumi — a unique resume-tracking algorithm coupled with a beautiful candidate dashboard that I ended up licensing to SEEK in Hong Kong.</p>
          <ArrowLink color="white" href="/journal/presumi">Read the story</ArrowLink>
        </div>
        {animationLoaded && (
          <PresumiAnimation />
        )}
      </div>

      <Fade triggerOnce>
        <div className={styles.projectsHeader}>
          <h2 className="heading-5">Other roles</h2>
          <p>Outside Jellypepper, I have been fortunate enough to work with the following companies.</p>
        </div>
      </Fade>

      <div className={styles.projects}>
        {otherRoles.map(({ image, role, company, type, start, end, location, description }, index) => (
          <div key={company} id={`role-${company}`}>
            <Fade triggerOnce delay={(index % 3) * 100}>
              <Client
                image={image}
                title={company}
                summary={role}
                description={description}
                caption={`${type} from ${start} to ${end} in ${location}.`}
              />
            </Fade>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default Work;