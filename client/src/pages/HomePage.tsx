import { Link } from "react-router-dom";
import Button from "../shared/ui/Button";
import { motion } from "framer-motion";

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to Our Platform
        </motion.h1>
        <motion.p
          className="hero__subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Connecting people with technology like never before.
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
            <Link to="/signup">Sign Up</Link>
          </Button>
        </motion.div>
      </section>

      <section className="features">
        <h2 className="section-title">Why Choose Us?</h2>
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
            title="Reliable"
            description="Our platform is built for reliability and performance."
          />
          <FeatureCard
            icon={
              <motion.img
                src="/icons/profile.svg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            }
            title="Community"
            description="Join a thriving community of like-minded individuals."
          />
          <FeatureCard
            icon={
              <motion.img
                src="/icons/star.svg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />
            }
            title="Support"
            description="24/7 support to help you whenever you need it."
          />
        </motion.div>
      </section>

      <section className="testimonials">
        <h2 className="section-title">What People Say</h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          "This platform has changed the way I work and collaborate! Absolutely
          amazing."
        </motion.p>
        <motion.p
          className="testimonials__author"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          - Happy User
        </motion.p>
      </section>
    </div>
  );
}

export default HomePage;

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
