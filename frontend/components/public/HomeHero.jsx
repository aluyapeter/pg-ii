import Container from './Container';
import Button from './Button';
import StatCard from './StatCard';
import ScrollReveal from './ScrollReveal'; // Pulling in our custom Client Component wrapper
import styles from './HomeHero.module.scss';

export default function HomeHero() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.grid}>
          
          {/* Left Column: Copy & Actions */}
          <div className={styles.content}>
            <ScrollReveal direction="up" delay={0}>
              <p className={styles.eyebrow} aria-hidden="true">Virtual Assistant & Operations Support</p>
            </ScrollReveal>

            {/* <ScrollReveal direction="up" delay={100}>
              <h2 className={styles.subhead}>
                Virtual Assistant & Operations Support for Service Providers, Executives & Creators
              </h2>
            </ScrollReveal> */}

            {/* <ScrollReveal direction="up" delay={200}>
              <h1 className={styles.title}>
                Crafting Success <br /> From Your <span className={styles.highlight}>Stumbles</span>
              </h1>
            </ScrollReveal> */}
            {/* Removed the redundant eyebrow text entirely */}

            <ScrollReveal direction="up" delay={100}>
              <h1 className={styles.subhead}>
                Virtual Assistant & Operations Support for Service Providers, Executives & Creators
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <h2 className={styles.title}>
                Crafting Success <br /> From Your <span className={styles.highlight}>Stumbles</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={300}>
              <p className={styles.description}>
                You are good at what you do. The communications, inbox management, 
                and operational layer around it is where things break down. 
                I step in at exactly that point — and push for better.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400}>
              <div className={styles.actions}>
                <Button href="#services" variant="primary">Explore Services</Button>
                <Button href="/contact" variant="outline">Get In Touch</Button>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: 2x2 Stats Grid */}
          <div className={styles.statsGrid}>
            <ScrollReveal direction="left" delay={300}>
              <StatCard 
                value="US, UK" 
                label="& EMEA Clients" 
              />
            </ScrollReveal>
            
            <ScrollReveal direction="left" delay={400}>
              <StatCard 
                value="4" 
                label="Specialist Services" 
              />
            </ScrollReveal>
            
            <ScrollReveal direction="left" delay={500}>
              <StatCard 
                value="24hr" 
                label="Standard Response Time" 
              />
            </ScrollReveal>
            
            <ScrollReveal direction="left" delay={600}>
              <StatCard 
                value="AI+" 
                label="Assisted & Human-Led" 
              />
            </ScrollReveal>
          </div>

        </div>
      </Container>
    </section>
  );
}