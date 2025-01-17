import React, { useContext, useState } from 'react'
import "../Handbag/Handbag.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faXTwitter, faInstagram, faTiktok, faPinterest } from "@fortawesome/free-brands-svg-icons"
import "./contact.css"
import { ShopContext } from '../../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Contact = () => {

  const { backendUrl, token } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/send/contactEmail`,
        formData,
        { headers: { token } }
      );
      

      toast.success(response.data.message || "Email has been sent to admin!");
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Error sending email:", error); 
      toast.error(error.response?.data?.error || "Failed to send email");
    }
  };


  return (
    <div className='flex flex-col'>
      <div className="handbags-header">
        <h1>Contact</h1>
      </div>
      <div className="large-map h-screen w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d230530.99244323597!2d-0.075949!3d51.508112!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48760349331f38dd%3A0xa8bf49dde1d56467!2sTower%20of%20London!5e1!3m2!1sen!2sus!4v1732471864386!5m2!1sen!2sus"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className='h-full w-full'
        />
      </div>
      <div className='contact-details mt-10 lg:px-40 lg:py-20 p-2 flex flex-col lg:flex-row w-full gap-10'>
        <div className="left-side w-full lg:w-1/2">
          <h1 className='text-3xl font-medium '>Visit Our Store</h1>
          <div className='flex flex-col mt-6 gap-5'>
            <h1 className='font-semibold'>Address</h1>
            <p className='text-sm text-[#000000d6]'>66 Mott St, New York, New York, Zip Code: 10006, AS</p>
          </div>
          <div className='flex flex-col mt-6 gap-5'>
            <h1 className='font-semibold'>Phone</h1>
            <p className='text-sm text-[#000000d6]'>+923220664042</p>
          </div>
          <div className='flex flex-col mt-6 gap-5'>
            <h1 className='font-semibold'>Email</h1>
            <p className='text-sm text-[#000000d6]'>uzairali89347@gmail.com</p>
          </div>
          <div className='flex flex-col mt-6 gap-5'>
            <h1 className='font-semibold'>Open Time</h1>
            <p className='text-sm text-[#000000d6]'>Our store has re-opened for shopping,</p>
            <p className='text-sm text-[#000000d6]'>exchange Every day 11am to 7pm</p>
          </div>

          <div className="social-media flex w-full gap-5 mt-10">
            <a href="https://www.facebook.com" target='_blank'>
              <div className="facebook footer-icons">
                <FontAwesomeIcon icon={faFacebookF} />
              </div>
            </a>

            <a href="https://www.twitter.com" target='_blank'>
              <div className="X footer-icons">
                <FontAwesomeIcon icon={faXTwitter} />
              </div>
            </a>

            <a href="https://www.instagram.com" target='_blank'>
              <div className="insta footer-icons">
                <FontAwesomeIcon icon={faInstagram} />
              </div>
            </a>

            <a href="https://www.tiktok.com" target='_blank'>
              <div className="tiktok footer-icons">
                <FontAwesomeIcon icon={faTiktok} />
              </div>
            </a>

            <a href="https://www.pinterest.com" target='_blank'>
              <div className="pinterest footer-icons">
                <FontAwesomeIcon icon={faPinterest} />
              </div>
            </a>

          </div>
        </div>
        <div className="right-side w-full lg:w-1/2">
          <h1 className='text-3xl font-medium '>Get in Touch</h1>
          <p className='text-sm text-[#000000d5] mt-6'>If you’ve got great products your making or looking to work with us then drop us a line.</p>

          <form onSubmit={handleSubmit} className='mt-6'>
            <div className='flex items-center w-full gap-2'>
              <input type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className='contact-inputs border outline-none w-full' />
              <input type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className='contact-inputs border outline-none w-full' />
            </div>
            <textarea name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className='contact-inputs border h-52 mt-6 w-full resize-none outline-none'
              placeholder='Message'></textarea>
          <button type='submit' className='bg-black text-white text-sm rounded-lg py-3 w-full mt-10 hover:bg-[#000000d8] transition-all'>Send</button>
          </form>


        </div>
      </div>
    </div>
  )
}

export default Contact