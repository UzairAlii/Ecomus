import React from 'react';
import './Collection.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Images } from '../../assets/assets';

const Collection = () => {
  return (
    <div className="collection-container">

      <div className="collection-header">
        <h1>Collections</h1>
      </div>

      <div className="collection-items">

      <NavLink to={"/NewArrival"}>
            <div className="Fashion-box collection-boxes">
              <img src={Images.fashionBoxImg} alt="" />
              <div className='fashionBox-div collection-boxes-div'>
                <p>New Arrival</p>
                <FontAwesomeIcon className='arrow-icon' icon={faArrowRight} />
              </div>
            </div>
          </NavLink>


          <NavLink to={"/Accessories"}>
            <div className="Accessories-box collection-boxes">
              <img src={Images.SunglassesBoxImg} alt="" />
              <div className='AcessoriesBox-div collection-boxes-div'>
                <p>Accessories</p>
                <FontAwesomeIcon className='arrow-icon' icon={faArrowRight} />
              </div>
            </div>
          </NavLink>


          <NavLink to={"/Handbag"}>
            <div className="handbag-box collection-boxes">
              <img src={Images.HandbagBoxImg} alt="" />
              <div className='handbag-div collection-boxes-div'>
                <p>Handbags</p>
                <FontAwesomeIcon className='arrow-icon' icon={faArrowRight} />
              </div>
            </div>
          </NavLink>


          <NavLink to={"/Men"}>
            <div className="Men-box collection-boxes">
              <img src={Images.MenBoxImg} alt="" />
              <div className='Men-div collection-boxes-div'>
                <p>Men</p>
                <FontAwesomeIcon className='arrow-icon' icon={faArrowRight} />
              </div>
            </div>
          </NavLink>


          <NavLink to={"/Women"}>
            <div className="Women-box collection-boxes">
              <img src={Images.WomenBoxImg} alt="" />
              <div className='women-div collection-boxes-div'>
                <p>Women</p>
                <FontAwesomeIcon className='arrow-icon' icon={faArrowRight} />
              </div>
            </div>
          </NavLink>


          <NavLink to={"/Shoes"}>
            <div className="shoes-box collection-boxes">
              <img src={Images.ShoesBoxImg} alt="" />
              <div className='shoes-div collection-boxes-div'>
                <p>Shoes</p>
                <FontAwesomeIcon className='arrow-icon' icon={faArrowRight} />
              </div>
            </div>
          </NavLink>

          
          <NavLink to={"/Outwear"}>
            <div className="Outwear-box collection-boxes">
              <img src={Images.OutwearBoxImg} alt="" />
              <div className='Outwear-div collection-boxes-div'>
                <p>Outwear</p>
                <FontAwesomeIcon className='arrow-icon' icon={faArrowRight} />
              </div>
            </div>
          </NavLink>

      </div>

    </div>
  );
}

export default Collection;
