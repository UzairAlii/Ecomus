import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

const ScrollUpButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);
  
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
  
      setProgress(scrollPercent);
      setIsVisible(scrollTop > 100);
    };
  
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  
    useEffect(() => {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  
    return (
      <div
        className={`scroll-to-top ${isVisible ? "visible" : ""}`}
        onClick={scrollToTop}
      >
        <div
          className="progress-circle"
          style={{
            background: `conic-gradient(#000 ${progress}%, transparent ${progress}%)`,
          }}
        ></div>
        <FontAwesomeIcon icon={faChevronUp} className="icon" />
      </div>
    );
  };


export default ScrollUpButton