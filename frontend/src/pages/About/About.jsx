import React from 'react'
import { Images } from '../../assets/assets'
import ShopGram from '../HomePage/ShopGram'

const About = () => {
  return (
    <div className='h-fit'>


      <div className={`about-header h-[50vh] sm:h-[80vh] md:h-[100vh] lg:h-[120vh] w-full relative flex items-center justify-center text-center`}>
        <img className='absolute top-0 left-0 w-[120%] md:w-full h-full' src={Images.AboutImg} alt="" />
        <h1 className='text-white relative z-10 text-[6vw] md:text-[5vw] font-medium'>Empowering Women to acheive their fitness goals with style</h1>
      </div>



      <div className='text-center w-full flex items-center justify-center h-fit p-5 md:p-20'>
        <div className='w-full md:w-1/2 pb-20 border-b border-[#0000003a] flex flex-col items-center justify-center'>
          <h1 className='text-[8vw] md:text-[3vw] font-normal'>We are Ecomus</h1>
          <p className='text-sm mt-5 text-gray-700'>Welcome to our classic women's clothing store, where we believe
            that timeless style never goes out of fashion. Our collection features classic
            pieces that are both stylish and versatile, perfect for building a
            wardrobe that will last for years.</p>
        </div>
      </div>

      <div className='w-full'>
        <div className='flex md:flex-row flex-col items-center w-full px-5 md:px-20 gap-10 py-10'>
          <img className='rounded-md w-full md:w-1/2' src={Images.AboutImg2} alt="" jfbdjfkbd />
          <div className='flex flex-col gap-5 w-full md:w-1/2'>
            <h1 className='text-3xl font-medium'>Established - 1995</h1>
            <p className='text-sm text-gray-700'>Ecomus was founded in 1995 by Jane Smith, a fashion lover with a
              passion for timeless style. Jane had always been drawn to classic
              pieces that could be worn season after season, and she believed that
              there was a gap in the market for a store that focused solely on classic
              women's clothing. She opened the first store in a small town in New
              England, where it quickly became a local favorite.</p>
          </div>
        </div>
      </div>

      <div className='w-full hidden lg:flex'>
        <div className='flex lg:flex-row flex-col items-center w-full px-5 text-center md:text-start lg:px-20 gap-10 py-20'>
          <div className='flex flex-col gap-5 w-full md:w-1/2'>
            <h1 className='text-3xl font-medium'>Our mission</h1>
            <p className='text-sm text-gray-700 w-full md:w-[80%]'>Our mission is to empower people through sustainable fashion.
              We want everyone to look and feel good, while also doing our part to
              help the environment.We believe that fashion should be stylish,
              affordable and accessible to everyone. Body positivity and inclusivity
              are values that are at the heart of our brand.</p>
          </div>
          <div className='flex relative'>
            <img className=' rounded-md' src={Images.AboutImg3} alt="" />
            <img className='w-[20vw] h-[25vw] absolute bottom-[-30%] right-[-45%] rounded-md' src={Images.AboutImg4} alt="" />
          </div>
        </div>
      </div>

      <div className='flex items-center justify-center w-full mt-40'>
        <div className='w-[90%] bg-[#ffffd9b1] flex flex-col items-center justify-center text-center px-5 py-5 md:py-10 lg:py-40'>
          <div>
            <h1 className='text-[8vw] sm:text-[4vw] md:text-[2vw] font-normal'>Quality is our priority</h1>
            <p className='mt-5'>Our talented stylists have put together outfits that are perfect for the season.</p>
            <p>They've variety of ways to inspire your next fashion-forward look.</p>
          </div>

          <div className='w-full flex md:flex-row flex-col items-center justify-center gap-10 md:justify-between mt-20'>

            <div className='flex flex-col gap-5 items-center justify-center'>
              <div className='md:h-[8vw] md:w-[8vw] w-24 h-24 rounded-full border-2 border-black flex items-center justify-center'>
              <img className='w-12' src={Images.highQuality} alt="" />
              </div>
              <h1 className='text-[6vw] sm:text-[4vw] md:text-[2vw]'>High-Quality Materials</h1>
              <p className='text-sm w-[80%]'>Crafted with precision and excellence, our activewear is meticulously engineered using premium materials to ensure unmatched comfort and durability.</p>
            </div>

            <div className='flex flex-col gap-5 items-center justify-center'>
              <div className='md:h-[8vw] md:w-[8vw] w-24 h-24 rounded-full border-2 border-black flex items-center justify-center'>
              <img className='w-12' src={Images.Laconic} alt="" />
              </div>
              <h1 className='text-[6vw] sm:text-[4vw] md:text-[2vw]'>Laconic Design</h1>
              <p className='text-sm w-[80%]'>Simplicity refined. Our activewear embodies the essence of minimalistic design, delivering effortless style that speaks volumes</p>
            </div>

            <div className='flex flex-col gap-5 items-center justify-center'>
              <div className='md:h-[8vw] md:w-[8vw] w-24 h-24 rounded-full border-2 border-black flex items-center justify-center'>
              <img className='w-12' src={Images.VariousSizes} alt="" />
              </div>
              <h1 className='text-[6vw] sm:text-[4vw] md:text-[2vw]'>Various Sizes</h1>
              <p className='text-sm w-[80%]'>Designed for every body and anyone, our activewear embraces diversity with a wide range of sizes and shapes, celebrating the beauty of individuality</p>
            </div>

          </div>
        </div>
      </div>

      <div className='mt-20'>
      <ShopGram />
      </div>

    </div>
  )
}

export default About