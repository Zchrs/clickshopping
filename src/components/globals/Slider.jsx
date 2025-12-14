/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../assets/sass/slider.scss'


export const Slider = () => {
  const images = [
    'default-product',
    'man-avatar',
    'default-product',
    'icon-avatar',
    'default-avatar'
  ];

  const productThumbs = useSelector(state => state.product.selectedProduct?.images || []);
  // console.log(productThumbs)
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevSlide = () => {
    let index = currentIndex - 1;
    if (index < 0) index = images.length - 1;
    setCurrentIndex(index);
  };

  const goToNextSlide = () => {
    let index = currentIndex + 1;
    if (index >= images.length) index = 0;
    setCurrentIndex(index);
  };

  return (
    <div className="slider-container">
      <button className='prev' onClick={goToPrevSlide}></button>
      <div className="slider">
        <div className="slide">
        <img loading='lazy' src={productThumbs[currentIndex].img_url} alt="" />
        </div>
      </div>
      <button className='next' onClick={goToNextSlide}></button>

      <div className="thumbs">
        {productThumbs.map((thumb, index) => (
          <div
            key={index}
            className={index === currentIndex ? 'thumb activesl' : 'thumb'}
            onClick={() => goToIndex(index)}
          >
            <img 
              loading='lazy' 
              src={thumb.img_url} 
              alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};