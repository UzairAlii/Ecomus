import React from 'react';
import { useState, useEffect, useContext } from 'react';
import ProductItem from '../../components/PoductItem';
import { ShopContext } from '../../context/ShopContext';
import { Images } from '../../assets/assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faMinus, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import "./Outwear.css";

const Outwear = () => {
  const { APIproducts, currency } = useContext(ShopContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [openFilter, setopenFilter] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [expanded, setExpanded] = useState({
    productCategories: true,
    Price: true,
    Size: true,
  });
  const [showPagination, setShowPagination] = useState(true);
  const [productsPerPage, setProductsPerPage] = useState(8);

  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [sortType, setSortType] = useState("Sort by");
  const [isLoading, setIsLoading] = useState(true);

  const OutwearProducts = APIproducts.filter((product) => product.category === "Outwear");

  useEffect(() => {
    if (APIproducts.length > 0) {
      setFilteredProducts(OutwearProducts); 
      setIsLoading(false);
      resetFilters('all');
    }
  }, [APIproducts]);

  useEffect(() => {
    applyFilters();
  }, [priceRange, selectedSizes, OutwearProducts]);

  useEffect(() => {
    sortProducts();
  }, [sortType, filteredProducts]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }, [currentPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const toggleFilter = () => {
    setopenFilter(!openFilter);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    if (openFilter) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [openFilter]);

  const toggleExpand = (section) => {
    setExpanded((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prevRange) => ({
      ...prevRange,
      [name]: Number(value),
    }));
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedSizes((prev) => [...prev, value]);
    } else {
      setSelectedSizes((prev) => prev.filter((size) => size !== value));
    }
  };

  const applyFilters = () => {
    let filtered = OutwearProducts.filter((product) => {
      const inPriceRange = product.price >= priceRange.min && product.price <= priceRange.max;
      const hasSelectedSize = selectedSizes.length === 0 ||
        (Array.isArray(product.sizes) && selectedSizes.some((size) => product.sizes.includes(size)));
      return inPriceRange && hasSelectedSize;
    });

    if (sortType !== "Sort by") {
      filtered = sortProducts(filtered);
    }

    setFilteredProducts(filtered);
    setFiltersApplied(
      selectedSizes.length > 0 || priceRange.min > 0 || priceRange.max < 1000 || sortType !== "Sort by"
    );
  };

  const resetFilters = (filterType) => {
    if (filterType === 'price') {
      setPriceRange({ min: 0, max: 1000 });
    } else if (filterType === 'size') {
      setSelectedSizes([]);
    } else if (filterType === 'all') {
      setPriceRange({ min: 0, max: 1000 });
      setSelectedSizes([]);
      setSortType("Sort by");
    }
    applyFilters();
  };

  const clearAllFilters = () => {
    setPriceRange({ min: 0, max: 1000 });
    setSelectedSizes([]);
    setSortType("Sort by");
    setFilteredProducts(OutwearProducts); 
    setFiltersApplied(false);
    setCurrentPage(1);
  };

  const sortProducts = (products = filteredProducts) => {
    let productList = [...products];

    switch (sortType) {
      case 'low-high':
        productList.sort((a, b) => a.discounted_price - b.discounted_price);
        break;
      case 'high-low':
        productList.sort((a, b) => b.discounted_price - a.discounted_price);
        break;
      case 'nameAZ':
        productList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameZA':
        productList.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return productList;
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  return (
    <div className="Outwear-container mb-10">
      <div className="Outwear-header">
        <h1>Outwear</h1>
        <p>Shop through our latest selection of Fashion</p>
      </div>

      {/* FILTER AND SORT CODE */}
      <div className='w-full h-fit flex flex-col gap-3 mt-10 px-3'>
        <div className='flex items-center justify-between'>
          <div onClick={toggleFilter} className="filter-button flex items-center gap-3 border-[1px] border-black p-2 rounded-lg ">
            <img src={Images.filter} alt="" />
            <button className='font-semibold'>Filter</button>
          </div>

          <select onChange={(e) => setSortType(e.target.value)} className="cursor-pointer text-sm sort-button w-[30vw] md:w-[12vw] flex items-center justify-between gap-3 border-[1px] border-black p-2 rounded-lg">
            <option value="sort">Sort By</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="nameAZ">Name: A to Z</option>
            <option value="nameZA">Name: Z to A</option>
          </select>
        </div>

        {(priceRange.min !== 0 || priceRange.max !== 1000 || selectedSizes.length > 0) && (
          <div className="showing-filter-values flex flex-col md:flex-row items-center gap-3">
            <p>{filteredProducts.length > 0 ? `${filteredProducts.length} products found` : `${OutwearProducts.length} products found`}</p>
            <span className='h-4 w-[1px] bg-black md:block hidden'></span>

            <div className="applied-filters flex flex-col md:flex-row items-center gap-3">
              {priceRange.min !== 0 || priceRange.max !== 1000 ? (
                <div onClick={() => resetFilters('price')} className='cursor-pointer flex items-center gap-2 hover:text-red-600 transition-all'>
                  <p>Price: {currency}{priceRange.min} - {currency}{priceRange.max}</p>
                  <FontAwesomeIcon icon={faTimes} />
                </div>
              ) : null}
              {selectedSizes.length > 0 && (
                <div onClick={() => resetFilters('size')} className='cursor-pointer flex items-center gap-2 hover:text-red-600 transition-all'>
                  <p>Size: {selectedSizes.join(', ')}</p>
                  <FontAwesomeIcon icon={faTimes} />
                </div>
              )}
              <button className="apply-filters-button bg-black text-white p-3 rounded-lg" onClick={clearAllFilters}>Clear All Filters</button>
            </div>
          </div>
        )}
      </div>

      {/* FILTER BUTTON PAR CLICK KARNE PAR SHOW HONE WALE ITEMS */}
      <div className='Filter-div'>
        {openFilter && (
          <div className="overlay" onClick={toggleFilter}>
            <div
              className="custom-cursor md:flex items-center justify-center hidden"
              style={{ top: cursorPosition.y, left: cursorPosition.x }}
            >
              <FontAwesomeIcon icon={faTimes} className="cross-icon" />
            </div>
          </div>
        )}

        <div className={`filter-items ${openFilter ? 'showFilter' : ''}`}>
          <div className='w-full flex items-center justify-between'>
            <div className='flex items-center gap-2 cursor-pointer' onClick={toggleFilter}>
              <FontAwesomeIcon icon={faChevronLeft} className='close' />
              <p className='text-black'>Back</p>
            </div>
          </div>

          {/*<--------------------------------- PRODUCT CATEGORIESSS -------------------------->*/}
          <div className={`Product-categories mt-5 w-full pb-5 ${expanded.productCategories ? 'expanded' : 'collapsed'}`}>
            <div onClick={() => toggleExpand('productCategories')} className='Product-categories-header cursor-pointer w-full flex items-center justify-between'>
              <h1 className='text-xl'>Product Categories</h1>
              <FontAwesomeIcon className="plus-icon" icon={expanded.productCategories ? faMinus : faPlus} />
            </div>

            <div className="filter-links">
              <NavLink to={"/Men"}>
                <p className="mt-6 hover:text-red-600">Men</p>
              </NavLink>
              <NavLink to={"/Women"}>
                <p className="mt-2 hover:text-red-600">Women</p>
              </NavLink>
              <NavLink to={"/handbag"}>
                <p className="mt-2 hover:text-red-600">Handbags</p>
              </NavLink>
              <NavLink to={"/accessories"}>
                <p className="mt-3 hover:text-red-600">Accessories</p>
              </NavLink>
              <NavLink to={"/shoes"}>
                <p className="mt-2 hover:text-red-600">Shoes</p>
              </NavLink>
              <NavLink to={"/outwear"}>
                <p className="mt-2 hover:text-red-600">Outwear</p>
              </NavLink>
            </div>
          </div>

          {/*<--------------------------------- PRICE CATEGORIESSS -------------------------->*/}
          <div className={`filter-price  mt-5 w-full pb-5 ${expanded.Price ? 'expanded' : 'collapsed'} `}>
            <div onClick={() => toggleExpand('Price')} className='Price-header cursor-pointer w-full flex items-center justify-between'>
              <h1 className='text-xl'>Price</h1>
              <FontAwesomeIcon className="plus-icon" icon={expanded.Price ? faMinus : faPlus} />
            </div>

            <div className='filter-price-items'>
              <div className="dual-slider-container">
                <input
                  type="range"
                  name="min"
                  min="0"
                  max="559"
                  value={priceRange.min}
                  onChange={handleSliderChange}
                  className="price-slider"
                  aria-label="Minimum price"
                />
                <input
                  type="range"
                  name="max"
                  min="0"
                  max="559"
                  value={priceRange.max}
                  onChange={handleSliderChange}
                  className="price-slider"
                  aria-label="Maximum price"
                />
              </div>
              <div className="price-display">
                <p>Price:
                  {currency}
                  <input
                    type="number"
                    name="min"
                    value={priceRange.min}
                    onChange={handlePriceChange}
                    min="0"
                    max="559"
                  />
                  -
                  {currency}
                  <input
                    type="number"
                    name="max"
                    value={priceRange.max}
                    onChange={handlePriceChange}
                    min="0"
                    max="559"
                  />
                </p>
              </div>
            </div>
          </div>

          {/*<--------------------------------- SIZE CATEGORIESSS -------------------------->*/}
          <div className={`product-size-filter  mt-5 w-full pb-5 ${expanded.Size ? 'expanded' : 'collapsed'} `}>
            <div onClick={() => toggleExpand('Size')} className='Price-header cursor-pointer w-full flex items-center justify-between'>
              <h1 className='text-xl'>Size</h1>
              <FontAwesomeIcon className="plus-icon" icon={expanded.Size ? faMinus : faPlus} />
            </div>

            <div className="filter-sizes mt-5 pb-5">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <div key={size} className={`${size.toLowerCase()} size-checkboxes flex items-center gap-3`}>
                  <input
                    type="checkbox"
                    value={size}
                    onChange={handleSizeChange}
                  />
                  <p>{size}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {
        isLoading ? (
          <p>Loading Products</p>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 px-3 py-10'>
        {currentProducts.map((item, index) => (
          <ProductItem
            key={item._id}
            id={item._id}
            name={item.name}
            img={item.image}
            price={item.price}
            discounted_price={item.discounted_price}
            color={item.colors}
            sizes={item.sizes}
          />
        ))}
      </div>
        )
      }

      {showPagination && (
        <div className="pagination mt-6 flex justify-center space-x-4 items-center">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`h-[45px] w-[50px] md:h-[40px] md:w-[45px] rounded shadow-md ${currentPage === 1 ? 'hidden' : 'bg-white border-black border-[1px] text-black hover:bg-black hover:text-white transition'}`}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`h-[45px] w-[50px] md:h-[40px] md:w-[45px] text-sm ${currentPage === pageNumber ? 'bg-black text-white' : 'bg-white border-black border-[1px] text-black'} rounded shadow-md`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`h-[45px] w-[50px] md:h-[40px] md:w-[45px] text-sm rounded shadow-md ${currentPage === totalPages ? 'hidden' : 'bg-white border-black border-[1px] text-black hover:bg-black hover:text-white transition'}`}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}

export default Outwear;