import Container from './Container';
import Button from './Button';
import ScrollReveal from './ScrollReveal';
import styles from './HomeCTA.module.scss';

export default function HomeCTA() {
  return (
    <section className={styles.section}>
      <Container className={styles.container}>
        <div className={styles.inner}>
        
            <ScrollReveal direction="up" delay={0}>
            <h2 className={styles.title}>The Irony: Success Is Killing Your Business</h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={150}>
            <p className={styles.description}>
                More clients means more messages. More messages means less time
                delivering. Less delivery time means unhappy clients. I break this
                cycle.
            </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={300} className={styles.action}>
            {/* Using the newly added inverse variant */}
            <Button href="/contact" variant="inverse">
                Break Free
            </Button>
            </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}