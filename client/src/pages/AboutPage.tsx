import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../shared/ui/Button";

function AboutPage() {
  return (
    <div className="about-page">
      <section className="hero">
        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          About Guppy
        </motion.h1>
        <motion.p
          className="hero__subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          A simple and intuitive social network designed to connect people within organizations, 
          communities, or friend groups.
        </motion.p>
        <motion.div
          className="hero__buttons"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button additionalClasses="hero__button" noArrow>
            <Link to="/orgs">Join Organizations</Link>
          </Button>
          <Button additionalClasses="hero__button" noArrow>
            <Link to="/signup">Get Started</Link>
          </Button>
        </motion.div>
      </section>

      <section className="features">
        <h2 className="section-title">What can you do with Guppy?</h2>
        <motion.div
          className="features__grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <FeatureCard
            icon={
              <motion.img
                src="/icons/suitcase.svg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            }
            title="Build Organizations"
            description="Set up your own dedicated space for your team, community, or friend group."
          />
          <FeatureCard
            icon={
              <motion.img
                src="/icons/share.svg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            }
            title="Share Information"
            description="Keep everyone informed with posts, updates, and important announcements."
          />
          <FeatureCard
            icon={
              <motion.img
                src="/icons/comment.svg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />
            }
            title="Connect with Others"
            description="Engage in discussions, share ideas, and build meaningful connections."
          />
        </motion.div>
      </section>

      <section className="mission">
        <h2 className="section-title">Why Guppy?</h2>
        <motion.p
          className="mission__text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          In a world of cluttered social media, Guppy offers refreshing simplicity. 
          We believe in a focused environment, connecting you with the people who matter most.
        </motion.p>
        
        <h2 className="section-title">Our Mission</h2>
        <motion.p
          className="mission__text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Our mission is to empower communities with a simple yet powerful platform 
          for communication and connection.
        </motion.p>
      </section>

      <section className="contact">
        <h2 className="section-title">Contact Us</h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Have questions, feedback, or suggestions? 
          <a href="mailto:info@guppyapp.com" className="contact__link"> Contact us</a>.
        </motion.p>
      </section>
    </div>
  );
}

export default AboutPage;

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: JSX.Element;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="feature-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="feature-card__icon">{icon}</div>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__description">{description}</p>
    </motion.div>
  );
}
