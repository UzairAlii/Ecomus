import React, { useState, useEffect } from 'react'
import { Images } from '../assets/assets'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [image3, setImage3] = useState(null)
  const [image4, setImage4] = useState(null)

  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [color, setColor] = useState([]);
  const [price, setPrice] = useState("")
  const [Disprice, setDisPrice] = useState("")
  const [category, setCategory] = useState("Men")


  const toggleSize = (size) => {
    setSelectedSizes((prev) => {
      if (prev.includes(size)) {
        return prev.filter((item) => item !== size);
      } else {
        return [...prev, size];
      }
    });

  };


  const handleDeleteImage1 = (e) => {
    e.preventDefault(); 
    setImage1(null); 
  };
  const handleDeleteImage2 = (e) => {
    e.preventDefault(); 
    setImage2(null); 
  };
  const handleDeleteImage3 = (e) => {
    e.preventDefault(); 
    setImage3(null);
  };
  const handleDeleteImage4 = (e) => {
    e.preventDefault(); 
    setImage4(null); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", desc); 
        formData.append("discounted_price", Disprice);
        formData.append("price", price); 
        formData.append("sizes", JSON.stringify(selectedSizes));
        formData.append("colors", JSON.stringify(color));
        formData.append("category", category);

        if (image1) formData.append("image1", image1);
        if (image2) formData.append("image2", image2);
        if (image3) formData.append("image3", image3);
        if (image4) formData.append("image4", image4);

        const response = await fetch(`${backendUrl}/api/product/add`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: formData,
        });

        const data = await response.json();
        if (data.success) {
          toast.success("product added successfully")
            console.log("Product added successfully:", data.message);

            window.scrollTo({
              top: 0,
              behavior: "smooth", 
            });

            setName("");
            setDesc("");
            setSelectedSizes([]);
            setColor([]);
            setPrice("");
            setDisPrice("");
            setImage1(null);
            setImage2(null);
            setImage3(null);
            setImage4(null);
        } else {
            console.error("Error:", data.message);
            toast.error("Something went wrong, please try again")
        }
    } catch (error) {
        console.error("Error occurred:", error.message);
    }
};



  return (
    <form onSubmit={handleSubmit} className='w-[90%]'>
      <div className='flex flex-col gap-10'>


        {/* UPLOAD IMAGE SECTION */}
        <div className='upload-image'>
          <p className='md:text-2xl text-xl font-semibold'>Upload Image</p>

          <div className='flex items-center gap-4 mt-10'>
            <label className='relative' htmlFor="image1">
              <img className='md:w-24 w-40' src={!image1 ? Images.uploadArea : URL.createObjectURL(image1)} alt="" />
              <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />

              {image1 && (
                <div
                  onClick={handleDeleteImage1}
                  className='h-full w-full absolute top-0 left-0 bg-[#00000022] flex items-center justify-center cursor-pointer'
                >
                  <FontAwesomeIcon className='text-[30px] text-white' icon={faXmark} />
                </div>
              )}
            </label>


            <label className='relative' htmlFor="image2">
              <img className='md:w-24 w-40' src={!image2 ? Images.uploadArea : URL.createObjectURL(image2)} alt="" />
              <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
              {image2 && (
                <div
                  onClick={handleDeleteImage2}
                  className='h-full w-full absolute top-0 left-0 bg-[#00000022] flex items-center justify-center cursor-pointer'
                >
                  <FontAwesomeIcon className='text-[30px] text-white' icon={faXmark} />
                </div>
              )}
            </label>
            <label className='relative' htmlFor="image3">
              <img className='md:w-24 w-40' src={!image3 ? Images.uploadArea : URL.createObjectURL(image3)} alt="" />
              <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
              {image3 && (
                <div
                  onClick={handleDeleteImage3} 
                  className='h-full w-full absolute top-0 left-0 bg-[#00000022] flex items-center justify-center cursor-pointer'
                >
                  <FontAwesomeIcon className='text-[30px] text-white' icon={faXmark} />
                </div>
              )}
            </label>
            <label className='relative' htmlFor="image4">
              <img className='md:w-24 w-40' src={!image4 ? Images.uploadArea : URL.createObjectURL(image4)} alt="" />
              <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
              {image4 && (
                <div
                  onClick={handleDeleteImage4}
                  className='h-full w-full absolute top-0 left-0 bg-[#00000022] flex items-center justify-center cursor-pointer'
                >
                  <FontAwesomeIcon className='text-[30px] text-white' icon={faXmark} />
                </div>
              )}
            </label>
          </div>
        </div>


        {/* PRODUCT NAME SECTION */}
        <div className='flex flex-col gap-5 w-full md:w-1/2'>
          <h1 className='md:text-2xl text-xl font-semibold'>Product details</h1>
          <div className='flex flex-col gap-3'>
            <p className='md:text-lg text-[15px] font-medium'>Product name</p>
            <input onChange={(e) => setName(e.target.value)} value={name} className='py-3 px-4' type="text" placeholder='product name' />
          </div>
          <div className='flex flex-col gap-3'>
            <p className='md:text-lg text-[15px] font-medium'>Product Description</p>
            <textarea onChange={(e) => setDesc(e.target.value)} value={desc} className='py-3 px-4' type="text" placeholder='product Description' />
          </div>
        </div>

        {/* PRODUCT CATEGORY SECTION */}

        <div className='flex flex-col gap-5 w-full md:w-1/2'>
          <h1 className='md:text-2xl text-xl font-semibold'>Select category</h1>
          <div className='w-full border-[1px] rounded-md border-black'>
            <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-[98%] border-none outline-none py-3 px-4'>
              <option value="BestSeller">BestSeller</option>
              <option value="NewArrival">New Arrival</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Accessories">Accessories</option>
              <option value="Handbags">Handbags</option>
              <option value="Shoes">Shoes</option>
              <option value="Outwear">Outwear</option>
            </select>
          </div>
        </div>


        {/* PRODUCT PRICE SECTION */}

        <div className='flex flex-col gap-5 w-full md:w-1/2'>
          <h1 className='md:text-2xl text-xl font-semibold'>Product Price</h1>
          <div className='w-full flex flex-col md:flex-row gap-2 items-start md:items-center'>

            <div className='flex w-1/2 items-center gap-2'>
              <p>$</p>
              <input onChange={(e) => setPrice(e.target.value)} value={price} className=' px-4 py-3' type="number" placeholder='Product Price' />
            </div>
            <p className='hidden md:block'>-</p>
            <div className='flex w-1/2 items-center gap-2'>
              <p>$</p>
              <input onChange={(e) => setDisPrice(e.target.value)} value={Disprice} className=' px-4 py-3' type="number" placeholder='Discounted Price' />
            </div>
          </div>
        </div>

        {/* PRODUCT SIZE SECTION */}

        <div className='flex flex-col gap-5 w-full md:w-1/2'>
          <h1 className='md:text-2xl text-xl font-semibold'>Product Sizes</h1>
          <div className="flex items-center gap-3">
            {/* Size Options */}
            {["S", "M", "L", "XL"].map((size) => (
              <div
              key={size}
              onClick={() => toggleSize(size)}
              className={`h-10 w-10 flex items-center justify-center rounded-md bg-slate-100 cursor-pointer ${
                selectedSizes.includes(size) ? "border-[1px] border-black" : ""
              }`}
            >
                <p>{size}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCT COLOR SECTION */}

        <div className='flex flex-col gap-5 w-full md:w-1/2'>
          <h1 className='md:text-2xl text-xl font-semibold'>Product color</h1>
          <p className='text-[12px] text-slate-400'>Please write product colors in camel case ex:(darkBlack, darkBlue)</p>
          <input
            onChange={(e) => {
              const colors = e.target.value.split(',').map(color => color.trim()); 
              setColor(colors); 
            }}
            value={color.join(', ')}
            className=' px-4 py-3'
            type="text"
            placeholder='Product color'
          />
        </div>


        <div>
          <button className='py-2 px-4 text-white bg-black rounded-md text-sm' type='submit'>Add product</button>
        </div>

      </div>
    </form>
  )
}

export default Add