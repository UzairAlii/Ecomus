import React, { useRef, useState, useEffect, useContext } from "react";
import { Images } from "../../assets/assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ShopContext } from "../../context/ShopContext";
import { Link } from "react-router-dom";

const HappyClients = () => {
  const { currency, APIproducts } = useContext(ShopContext);
  const containerRef = useRef(null);

  const [disableLeft, setDisableLeft] = useState(true);
  const [disableRight, setDisableRight] = useState(false);

  const updateButtonStates = () => {
    const scrollLeft = containerRef.current.scrollLeft;
    const scrollWidth = containerRef.current.scrollWidth;
    const containerWidth = containerRef.current.offsetWidth;

    setDisableLeft(scrollLeft <= 0);
    setDisableRight(scrollLeft + containerWidth >= scrollWidth);
  };

  const scrollLeft = () => {
    containerRef.current.scrollBy({
      left: -containerRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({
      left: containerRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = () => {
      updateButtonStates();
    };

    container.addEventListener("scroll", handleScroll);

    updateButtonStates();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const womenProducts = APIproducts.filter(product => product.category === "Women");

  const clientReviews = [
    {
      starImage: Images.stars,
      title: "Best Online Fashion Site",
      description: "I always find something stylish and affordable on this web fashion site.",
      author: "Robert Smith",
      location: "Customer from USA",
    },
    {
      starImage: Images.stars,
      title: "Great Selection and Quality",
      description: "I love the variety of styles and the high-quality clothing on this web fashion site.",
      author: "Allen Lyn",
      location: "Customer from France",
    },
    {
      starImage: Images.stars,
      title: "Best Customer Service",
      description: "I finally found a web fashion site with stylish and flattering options in my size.",
      author: "Peter Rope",
      location: "Customer from USA",
    },
    {
      starImage: Images.stars,
      title: "Great Selection and Quality",
      description: "I love the variety of styles and the high-quality clothing on this web fashion site.",
      author: "Hellen Ase",
      location: "Customer from Japan",
    },
  ];

  return (
    <div className="flex flex-col mt-20 ">
      <div className="flex flex-col items-center text-center w-full">
        <h1 className="text-[45px] font-normal">Happy Clients</h1>
        <p>Hear what they say about us</p>
      </div>
      <div className="flex items-center justify-center w-full mt-20 relative">
        <div
          ref={containerRef}
          className="flex w-[95%] gap-6 overflow-x-scroll snap-x snap-mandatory scrollbar-hide scroll-smooth"
        >
          {clientReviews.map((review, index) => (
            <div
              key={index}
              className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 bg-white shadow-lg rounded-lg p-6  border border-gray-200 snap-center"
            >
              <div className="flex space-x-1">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="13"
                    viewBox="0 0 14 13"
                    fill="none"
                    className="text-[#ffbb00]"
                  >
                    <path
                      d="M6.84211 10.4479L11.0705 13L9.94842 8.19L13.6842 4.95368L8.76474 4.53632L6.84211 0L4.91947 4.53632L0 4.95368L3.73579 8.19L2.61368 13L6.84211 10.4479Z"
                      fill="currentColor"
                    />
                  </svg>
                ))}
              </div>
              <h2 className="text-lg font-semibold text-gray-800 py-5">
                {review.title}
              </h2>
              <p className="text-gray-600 text-[18px] mb-4 w-[80%]">"{review.description}"</p>
              <div className="text-left py-5">
                <p className="text-gray-800 font-medium">{review.author}</p>
                <p className="text-gray-500 text-sm">{review.location}</p>
              </div>
              <div className="reviewed-product">
                {womenProducts.slice(index * 1, index * 1 + 1).map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="reviewed-product pt-3 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3 border-t pt-4">
                      <img
                        className="w-[60px]"
                        src={product.image[0]}
                        alt={product.name}
                      />
                      <div className="flex flex-col gap-3">
                        <p className="text-[15px] hover:text-red-600">{product.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[15px] line-through">{currency}{product.price}</p>
                          <p className="text-[15px] text-red-600">{currency}{product.discounted_price}</p>
                        </div>
                      </div>
                    </div>
                    <div className="rarrow hidden hover:bg-black hover:text-white transition-all h-10 w-10 items-center justify-center border-[1px] border-black rounded-full">
                      <FontAwesomeIcon className="rotate-[-45deg]" icon={faArrowRight} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div>
          <button
            className={`absolute left-4 top-[50%] -translate-y-[50%] bg-white border-[1px] border-[#0000009f] text-black h-12 w-12 rounded-full shadow-md ${disableLeft ? "opacity-30 cursor-not-allowed" : ""
              }`}
            onClick={scrollLeft}
            disabled={disableLeft}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            className={`absolute right-4 top-[50%] -translate-y-[50%] bg-white border-[1px] border-[#0d03039f] text-black h-12 w-12 rounded-full shadow-md ${disableRight ? "opacity-30 cursor-not-allowed" : ""
              }`}
            onClick={scrollRight}
            disabled={disableRight}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HappyClients;