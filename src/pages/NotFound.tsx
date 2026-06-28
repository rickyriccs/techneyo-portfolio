import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, SearchX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="public-premium flex min-h-screen items-center justify-center overflow-hidden px-4 text-white">
      <div className="premium-grid-bg" />
      <div className="premium-card relative z-10 max-w-xl p-8 text-center">
        <SearchX size={34} className="mx-auto mb-5 text-cyan-200" />
        <p className="premium-eyebrow">404</p>
        <h1 className="mb-4 font-display text-4xl font-bold">This page is not in the system.</h1>
        <p className="mb-6 text-white/62">The route you opened does not exist, but the website, services and contact flow are ready.</p>
        <Link to="/" className="premium-btn premium-btn-primary">
          Return to Home <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
