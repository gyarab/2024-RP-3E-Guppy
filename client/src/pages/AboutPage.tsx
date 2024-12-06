import Button from "../shared/ui/Button";
import TagList from "../shared/ui/TagList";

function AboutPage() {
  return (
    <div className="container home-container">
      <main className="main">
        <section className="section">
          <h2 className="section__title">About Page</h2>
          <p className="section__text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            suscipit, enim nec posuere luctus, metus nisl tincidunt magna, ac
            ultricies turpis nunc id velit. Nullam auctor, libero et ultricies
            tincidunt, nisl elit luctus purus, nec tristique eros felis et
            sapien. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Nullam suscipit, enim nec posuere luctus, met
          </p>
        </section>
      </main>
      <aside className="aside">
        <h3 className="aside__title">Side Panel</h3>
        <div className="aside__content">
          <div className="aside__item">
            <TagList tags={["React", "TypeScript", "Node.js", "Express"]} />
          </div>
          <div className="aside__item">
            <h4 className="aside__subtitle">Related Links</h4>
            <ul className="aside__list">
              <li className="aside__list-item">
                <Button>React Documentation</Button>
              </li>
              <li className="aside__list-item">
                <Button>TypeScript Documentation</Button>
              </li>
              <li className="aside__list-item">
                <Button>Node.js Documentation</Button>
              </li>
              <li className="aside__list-item">
                <Button>Express Documentation</Button>
              </li>
            </ul>
          </div>
          <div className="aside__item">
            <h4 className="aside__subtitle">Contact</h4>
            <p className="aside__text">
              Email:
              <a href="mailto:example@mail.com">example@mail.com</a>
            </p>
            <p className="aside__text">
              Phone:
              <a href="tel:+1234567890">+1234567890</a>
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default AboutPage;
