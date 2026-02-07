import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  // Friendly fallback when someone mistypes a route
  <div className="card">
    <h2>Page not found</h2>
    <p>We could not find the page you requested.</p>
    <Link to="/">Go home</Link>
  </div>
);

export default NotFoundPage;
