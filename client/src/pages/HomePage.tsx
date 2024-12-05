import Dropdown from "../shared/ui/Dropdown";
import TagList from "../shared/ui/TagList";

function HomePage() {
  return (
    <div className="container home-container">
      <main className="main">
        <section className="section hero">
          <h2 className="section__title">Hero Section</h2>
          <p className="section__content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            suscipit, enim nec posuere luctus, metus nisl tincidunt magna, ac
            ultricies turpis nunc id velit. Nullam auctor, libero et ultricies
            tincidunt, nisl elit luctus purus, nec tristique eros felis et
            sapien. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Nullam suscipit, enim nec posuere luctus, metus nisl tincidunt
            magna, ac ultricies turpis nunc id velit. Nullam auctor, libero et
            ultricies tincidunt, nisl elit luctus purus, nec tristique eros
            felis et sapien.
          </p>
          <Dropdown
            items={["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]}
          />
        </section>
      </main>
      <aside className="aside">
        <h3 className="aside__title">Side Panel</h3>
        <div className="aside__content">
          <div className="aside__item">
            <TagList tags={["React", "TypeScript", "Node.js", "Express"]} />
          </div>
        </div>
      </aside>
    </div>
  );
}

export default HomePage;
