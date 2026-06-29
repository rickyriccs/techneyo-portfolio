import { Link } from "react-router-dom";

type Breadcrumb = {
  label: string;
  path: string;
};

const Breadcrumbs = ({ items }: { items: Breadcrumb[] }) => (
  <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/50">
    {items.map((item, index) => (
      <span key={item.path} className="flex items-center gap-2">
        {index > 0 && <span>/</span>}
        {index === items.length - 1 ? (
          <span className="text-white/75">{item.label}</span>
        ) : (
          <Link to={item.path} className="hover:text-white">
            {item.label}
          </Link>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumbs;
