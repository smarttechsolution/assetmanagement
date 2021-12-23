import React from "react";
import { Link } from "react-router-dom";
import useAuthentication from "services/authentication/AuthenticationService";

interface Props {}

const NotFound = (props: Props) => {
  const { isAuthenticated } = useAuthentication();

  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h3>Oops! Page not found</h3>
          <h1>
            <span>4</span>
            <span>0</span>
            <span>4</span>
          </h1>
        </div>
        <h2>we coulnot find what you are looking for.</h2>
        <h2>Please try again with different url</h2>
        <Link
          to={isAuthenticated() ? "/auth/home" : "/scheme/test-scheme/home"}
          className="text-primary small"
        >
          {isAuthenticated() ? "Go To Home" : "Sample Link"}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
