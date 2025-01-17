import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import axios from "axios";
import { toast } from 'react-toastify';
import { Images } from '../assets/assets';

const List = () => {
  const [list, setList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        console.log(response.data.products);
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        toast.error("Token not available, please login again.");
        return;
      }
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);


  const categories = ["BestSeller", "NewArrival", "Men", "Women", "Accessories", "Handbags", "Shoes", "Outwear"];

  const categoriesImages = [Images.MenBoxImg,Images.FashionBoxImg, Images.BSImg6Black, Images.BSImg2Green, Images.Aimg7Black, Images.HandbagBoxImg, Images.ShoesBoxImg, Images.OutwearImgBox];

  

  return (
    <div>
      <h1 className='font-semibold text-2xl mb-2 text-black'>All Categories</h1>
      {selectedCategory === null ? (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-10'>
          {categories.map((category) => (
            <div
              key={category}
              onClick={() => setSelectedCategory(category)}
              className='border p-4 cursor-pointer text-center flex items-center gap-5'
            >
              {
                categoriesImages.map((image, index) => {
                  if (index === categories.indexOf(category)) {
                    return <img src={image} alt={category} className='w-10 h-10 object-cover rounded-full' />;
                  }
                })
              }
              <h2 className='font-semibold text-md'>{category}</h2>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => setSelectedCategory(null)} className='mb-4 py-2 px-4 bg-gray-200 rounded'>Back to Categories</button>
          <h2 className='font-semibold text-md mb-2'>{selectedCategory}</h2>
          <div className='flex flex-col gap-2'>
            <div className='hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr] items-center py-1 px-2 bg-slate-200 text-sm'>
              <b>Image</b>
              <b>Name</b>
              <b>Discounted Price</b>
              <b>Category</b>
              <b className='text-center'>Action</b>
            </div>
            {list.filter(item => item.category === selectedCategory).reverse().map((item, index) => (
              <div key={index} className='grid grid-cols-[1fr_2fr_1fr_1fr_1fr] items-center py-1 px-2'>
                <img src={item.image[0]} alt={item.name} className='w-16 h-16 object-cover' />
                <p>{item.name}</p>
                <p>{currency + item.discounted_price}</p>
                <p>{item.category}</p>
                <button onClick={() => removeProduct(item._id)} className="bg-[#000000d7] text-white rounded-md w-1/2 py-2 text-sm self-center justify-self-center">Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default List;