import Link from 'next/link';
import Container from './Container';
import styles from './PublicFooter.module.scss';
import { LinkedInIcon, InstagramIcon, FacebookIcon, ThreadsIcon } from '../icons/SocialIcons';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          
          {/* Column 1: Brand & Socials */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              Productivity Gourmet
            </Link>
            <p>
              Virtual assistant and operations support for service providers, 
              executives, and creators. US, UK, and EMEA.
            </p>
            <div className={styles.socials}>
              <a href="https://www.linkedin.com/in/productivity-gourmet" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href="https://www.instagram.com/productivity_gourmet/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://web.facebook.com/ProductivityGourmet/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://www.threads.net/@productivity_gourmet" target="_blank" rel="noopener noreferrer" aria-label="Threads">
                <ThreadsIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className={styles.linkCol}>
            <h4>Services</h4>
            <ul>
              <li><Link href="/services">Customer Service</Link></li>
              <li><Link href="/services">Client Communications</Link></li>
              <li><Link href="/services">Social Media Inbox</Link></li>
              <li><Link href="/services">Virtual Assistant</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className={styles.linkCol}>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/blog">The Plog</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal & Contact */}
          <div className={styles.linkCol}>
            <h4>Contact</h4>
            <ul>
              <li><a target="_blank" rel="noopener noreferrer" href="mailto:hello@productivitygourmet.com">hello@productivitygourmet.com</a></li>
              <li><span>EMEA Region</span></li>
            </ul>
            <h4 style={{ marginTop: '1rem' }}>Legal</h4>
            <ul>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className={styles.bottomBar}>
          <p>&copy; {currentYear} Productivity Gourmet. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}