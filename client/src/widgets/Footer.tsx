function Footer() {
  return (
    <footer className="footer">
      <div className="footer__upper">
        <div className="container">
          <div className="footer__list">
            <div className="footer__item">
              <h3 className="footer__item__title">About Us</h3>
              <p className="footer__item__text">
                Learn more about our mission, vision, and the values that drive
                our work.
              </p>
            </div>
            <div className="footer__item">
              <h3 className="footer__item__title">Quick Links</h3>
              <a href="#" className="footer__item__link">
                Home
              </a>
              <a href="#" className="footer__item__link">
                Services
              </a>
              <a href="#" className="footer__item__link">
                Contact Us
              </a>
              <a href="#" className="footer__item__link">
                Blog
              </a>
            </div>
            <div className="footer__item">
              <h3 className="footer__item__title">Support</h3>
              <a href="#" className="footer__item__link">
                FAQ
              </a>
              <a href="#" className="footer__item__link">
                Help Center
              </a>
              <a href="#" className="footer__item__link">
                Privacy Policy
              </a>
              <a href="#" className="footer__item__link">
                Terms of Service
              </a>
            </div>
            <div className="footer__item">
              <h3 className="footer__item__title">Follow Us</h3>
              <div className="footer__social">
                <a href="#" className="footer__item__link">
                  Facebook
                </a>
                <a href="#" className="footer__item__link">
                  Twitter
                </a>
                <a href="#" className="footer__item__link">
                  Instagram
                </a>
                <a href="#" className="footer__item__link">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__lower">
        <p className="copyright-title">
          &copy; {new Date().getFullYear()} Guppy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
