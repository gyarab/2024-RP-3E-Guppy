import { motion } from 'framer-motion'; // For animations
import Card from '../shared/ui/AboutCard'; // Import Card component

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="about-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="about-content">
        <motion.h1 variants={itemVariants}>About Guppy</motion.h1>
        <motion.div className="about-section" variants={itemVariants}>
          <p>
            Guppy is a simple and intuitive social network designed to connect
            people within organizations, communities, or friend groups. Think of
            it like a streamlined, focused version of Reddit, where you can
            easily create and manage your own dedicated spaces.
          </p>
        </motion.div>

        <motion.div className="about-section" variants={itemVariants}>
          <h2>What can you do with Guppy?</h2>
          <div className="feature-cards">
            <Card header="Build Organizations" text="Set up your own dedicated space." iconPath=""/>
            <Card header="Share Information" text="Keep everyone informed." iconPath=""/>
            <Card header="Share Memes" text="Have some fun!" iconPath=""/>
            <Card header="Connect with Others" text="Stay in touch." iconPath=""/>
            <Card header="Customization (Coming Soon)" text="Tailor your organization." iconPath=""/>
          </div>
        </motion.div>

        <motion.div className="about-section" variants={itemVariants}>
        <h2>Why Guppy?</h2>
          <p>
            In a world of cluttered social media, Guppy offers refreshing
            simplicity. We believe in a focused environment, connecting you
            with the people who matter most.
          </p>
        </motion.div>

        <motion.div className="about-section" variants={itemVariants}>
          <h2>Our Mission</h2>
          <p>
            Our mission is to empower communities with a simple yet powerful
            platform for communication and connection.
          </p>
        </motion.div>

        <motion.div className="about-section" variants={itemVariants}>
          <h2>Contact Us</h2>
          <p>
            Have questions, feedback, or suggestions?
            <a href="mailto:info@guppyapp.com">Contact us</a>.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;