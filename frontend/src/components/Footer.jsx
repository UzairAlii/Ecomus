import React, {useState} from 'react'
import { Images } from '../assets/assets'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faXTwitter, faInstagram, faTiktok, faPinterest } from "@fortawesome/free-brands-svg-icons"
import { NavLink } from 'react-router-dom'

const Footer = () => {
  const [expanded, setExpanded] = useState({
    help: false,
    usefulLinks: false,
    lastDiv: false,
  });

  const toggleExpand = (section) => {
    setExpanded((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className='footer-container'>
      <div className='footer-items'>

        <div className="first-two-divs">
          <div className="first-div">

            <NavLink to={"/"}>
              <div className="logo">
                <img src={Images.logo} alt="" />
              </div>
            </NavLink>

            <div className="address">
              <p>Address: 1234 Fashion Street, Suite 567,</p>
              <p>New York, NY</p>
            </div>

            <div className="contact-info">
              <p>Email: <span>info@fashionshop.com</span></p>
              <p>Phone: <span>(212)555-1234</span></p>
            </div>

            <NavLink to={"/contact"}>
              <div className="location">
                <p>Get direction</p>
                <FontAwesomeIcon className='location-icon' icon={faArrowRight} />
              </div>
            </NavLink>

            <div className="social-media">
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

          <div className={`help ${expanded.help ? 'expanded' : 'collapsed'}`}>
            <h1 onClick={() => toggleExpand('help')}>Help</h1>
            <FontAwesomeIcon className="plus-icon" icon={expanded.help ? faMinus : faPlus} />
            <ul>
              <li>Privacy Policy</li>
              <li>Returns + Exchange</li>
              <li>Shipping</li>
              <li>Terms & Conditions</li>
              <li>FAQ’s</li>
              <li>My Wishlist</li>
            </ul>
          </div>

        </div>


        <div className="last-two-divs">
          <div className={`useful-links ${expanded.usefulLinks ? 'expanded' : 'collapsed'}`}>
            <h1 onClick={() => toggleExpand('usefulLinks')}>Useful Links</h1>
            <FontAwesomeIcon className="plus-icon" icon={expanded.usefulLinks ? faMinus : faPlus} />
            <ul>
              <NavLink to={"/about"}>
              <li>Our Story</li>
              </NavLink>
              <NavLink to={"/collection"}>
              <li>Visit Our Store</li>
              </NavLink>
              <NavLink to={"/contact"}>
              <li>Contact Us</li>
              </NavLink>
              <NavLink to={"/about"}>
              <li>About Us</li>
              </NavLink>
              <li>Account</li>
            </ul>
          </div>

          <div className={`last-div ${expanded.lastDiv ? 'expanded' : 'collapsed'}`} >
            <h1 onClick={() => toggleExpand('lastDiv')}>Sign Up for Email</h1>
            <FontAwesomeIcon className="plus-icon" icon={expanded.lastDiv ? faMinus : faPlus} />
            <p>Sign up to get first dibs on new arrivals, sales, exclusive content, events and more!</p>
            <div className="email-adress">
              <input type="email" placeholder="Enter email address" spellCheck="false" />
              <button>
                Subscribe <FontAwesomeIcon className="subscribe-icon" icon={faArrowRight} />
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="footer-last">
        <p>© 2024 Ecomus <span>(Syed Uzair Ali)</span> . All rights reserved.</p>
        <div className="payment-images">
          <img src="https://demo-ecomus-global.myshopify.com/cdn/shopifycloud/shopify/assets/payment_icons/visa-319d545c6fd255c9aad5eeaad21fd6f7f7b4fdbdb1a35ce83b89cca12a187f00.svg" alt="" />
          <img src="https://demo-ecomus-global.myshopify.com/cdn/shopifycloud/shopify/assets/payment_icons/paypal-49e4c1e03244b6d2de0d270ca0d22dd15da6e92cc7266e93eb43762df5aa355d.svg" alt="" />
          <img src="https://demo-ecomus-global.myshopify.com/cdn/shopifycloud/shopify/assets/payment_icons/master-173035bc8124581983d4efa50cf8626e8553c2b311353fbf67485f9c1a2b88d1.svg" alt="" />
          <img src="https://demo-ecomus-global.myshopify.com/cdn/shopifycloud/shopify/assets/payment_icons/american_express-12858714bc10cdf384b62b8f41d20f56d8c32c1b8fed98b662f2bfc158dcbcf0.svg" alt="" />
          <img src="https://demo-ecomus-global.myshopify.com/cdn/shopifycloud/shopify/assets/payment_icons/diners_club-16436b9fb6dd9060edb51f1c7c44e23941e544ad798282d6aef1604319562fba.svg" alt="" />
        </div>
      </div>



    </div>
  )
}

export default Footer