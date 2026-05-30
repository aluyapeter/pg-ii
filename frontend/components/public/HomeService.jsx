import Container from './Container';
import ServiceCard from './ServiceCard';
import ScrollReveal from './ScrollReveal';
import styles from './HomeServices.module.scss';

// Mocking the data structure. In a dynamic build, this would come from your FastAPI backend.
const servicesData = [
  {
    id: 1,
    title: 'Client Communications Management',
    description: 'Professional email and client correspondence management for service providers and executives. Your leads followed up, your clients responded to, your inbox under control.',
    href: '/services/client-communications',
    icon: <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  },
  {
    id: 2,
    title: 'Customer Service Management',
    description: 'Outsourced customer service for e-commerce brands and high-volume service businesses. I handle enquiries, ease anxious customers, and escalate what needs your attention.',
    href: '/services/customer-service',
    icon: <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  },
  {
    id: 3,
    title: 'Social Media Inbox Management',
    description: 'DM and inbox management for content creators and influencers. I sort the brand deals from the noise, respond in your voice, and make sure no collaboration offer disappears.',
    href: '/services/social-inbox',
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
      </>
    )
  },
  {
    id: 4,
    title: 'Virtual Assistant Services',
    description: 'AI-assisted operational support from flexible task management to high-trust Executive VA partnerships. I meet you at the level your business needs right now.',
    href: '/services/virtual-assistant',
    icon: <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
  }
];

export default function HomeServices() {
  return (
    <section className={styles.section} id="services">
      <Container>
        
        {/* Section Header */}
        <div className={styles.header}>
          <ScrollReveal direction="up" delay={0}>
            <p className={styles.eyebrow} aria-hidden="true">What I Offer</p>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={100}>
            <h2 className={styles.title}>Four Services. One Operational Partner.</h2>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={200}>
            <p className={styles.description}>
              Each service is built around a specific operational pressure point. Find the 
              one that matches where your business is breaking down — or start with a Fit 
              Call and we will figure it out together.
            </p>
          </ScrollReveal>
        </div>

        {/* Services Grid */}
        <div className={styles.grid}>
          {servicesData.map((service, index) => (
            // We multiply the index by 150ms to create a staggered left-to-right cascade effect
            <ScrollReveal key={service.id} direction="up" delay={300 + (index * 150)}>
              <ServiceCard 
                title={service.title}
                description={service.description}
                href={service.href}
                icon={service.icon}
              />
            </ScrollReveal>
          ))}
        </div>

      </Container>
    </section>
  );
}