import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop(props) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.defaultView.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Optional if you want to skip the scrolling animation
    });
  }, [pathname]);

  return <> {props.children} </>;
}