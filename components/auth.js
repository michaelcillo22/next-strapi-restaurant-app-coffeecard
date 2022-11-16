/* /lib/auth.js */
// this is where registerUser and login components are defined

/* 
Authentication with Next requires some additional consideration 
outside of a normal client-side authentication system because we 
have to be mindful of whether the code is being rendered on the 
client or the server. Because of the different constructs between 
a server and client, client-only code should be prevented 
from running on the server.

One thing to keep in mind is that cookies are sent to the server 
in the request headers, so using something like next-cookies to 
universally retrieve the cookie value would work well. 
I'm not taking this approach in the tutorial, I will use the 
componentDidMount lifecycle inside the _app.js file to grab my cookie. 
componentDidMount only fires client-side ensuring that 
we will have access to the cookie.
*/

// Our token management will happen client-side only, 
// however, your application could be developed differently in the real world.

import { useEffect } from "react";
import Router from "next/router";
import Cookie from "js-cookie"; // client-side cookie
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

//register a new user
export const registerUser = (username, email, password) => { // exported to register.js
  //prevent function from being ran on the server
  if (typeof window === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/auth/local/register`, { username, email, password })
      .then((res) => {
        //set JWT token response from Strapi for server validation
        Cookie.set("token", res.data.jwt);

        //resolve the promise to set loading to false in SignUp form
        resolve(res);
        //redirect back to home page for restaurants selection
        Router.push("/");
      })
      .catch((error) => {
        //reject the promise and pass the error object back to the form
        reject(error);
      });
  });
};

export const login = (identifier, password) => {
  //prevent function from being ran on the server
  if (typeof window === "undefined") {
    return;
  }

  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/auth/local/`, { identifier, password })
      .then((res) => {
        //set token response from Strapi for SERVER validation
        Cookie.set("token", res.data.jwt);

        //resolve the promise to set loading to false in SignUp form
        resolve(res);
        //redirect back to home page for restaurants selection
        Router.push("/");
      })
      .catch((error) => {
        //reject the promise and pass the error object back to the form
        reject(error);
      });
  });
};

export const logout = () => {
  //remove token and user cookie
  Cookie.remove("token");
  delete window.__user;
  // sync logout between multiple windows
  window.localStorage.setItem("logout", Date.now());
  //redirect to the home page
  Router.push("/");
};

// withAuthSync() is Higher Order Component to wrap our pages and logout simultaneously logged in tabs
// Simply put: This is used to sync logouts across multiple logged in tabs.
// THIS IS NOT USED in the tutorial, only provided if you wanted to implement
export const withAuthSync = (Component) => {
  const Wrapper = (props) => {
    const syncLogout = (event) => {
      if (event.key === "logout") {
        Router.push("/login");
      }
    };

    useEffect(() => {
      window.addEventListener("storage", syncLogout);

      return () => {
        window.removeEventListener("storage", syncLogout);
        window.localStorage.removeItem("logout");
      };
    }, []);

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Wrapper.getInitialProps = Component.getInitialProps;
  }

  return Wrapper;
};
