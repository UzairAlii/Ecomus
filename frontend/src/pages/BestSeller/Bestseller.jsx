import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import ProductItem from "../../components/PoductItem";

const Bestseller = () => {
  const { APIproducts } = useContext(ShopContext);
  const [BestSellers, setBestSellers] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(8); 

  useEffect(() => {
    const bestProducts = APIproducts.filter((item) => item.category === "BestSeller");
    setBestSellers(bestProducts);
  }, [APIproducts]);

  const loadMoreProducts = () => {
    setVisibleProducts((prevCount) => prevCount + 4);
  };

  return (
    <div className="bestSeller-container h-fit w-full px-10 py-10 flex flex-col items-center">
      <h1 className='text-[40px] text-black'>Best Seller</h1>
      <p className='text-md text-gray-700 py-4'>Shop the Latest Styles: Stay ahead of the curve with our newest arrivals</p>

      <div className='py-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
        {
          BestSellers.slice(0, visibleProducts).map((item, index) => (
            <ProductItem 
              key={index} 
              id={item._id} 
              name={item.name} 
              img={item.image} 
              price={item.price} 
              discounted_price={item.discounted_price} 
              color={item.colors}
              sizes={item.sizes}
            />
          ))
        }
      </div>

      {/* Load More Button */}
      {
        visibleProducts < BestSellers.length && (
          <button 
            onClick={loadMoreProducts} 
            className="border-[1px] border-black px-6 py-2 mt-6 font-semibold text-sm text-black bg-transparent rounded hover:border-red-500 hover:text-red-500 transition-all ease-in-out"
          >
            Load More
          </button>
        )
      }
    </div>
  );
};

export default Bestseller;