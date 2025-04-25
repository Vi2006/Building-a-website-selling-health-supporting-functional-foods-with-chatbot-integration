import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SliderComponent = ({ arrImages }) => {
  const sliderRef = useRef(null);

  const settings = {
    dots: true, // Hiển thị các dấu chấm dưới slider
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    afterChange: (currentSlide) => {
      const slides =
        sliderRef.current.innerSlider.list.querySelectorAll(".slick-slide");
      slides.forEach((slide, index) => {
        if (index === currentSlide) {
          slide.setAttribute("aria-hidden", "false");
        } else {
          slide.setAttribute("aria-hidden", "true");
        }
      });
    },
  };

  return (
    <Slider ref={sliderRef} {...settings}>
      {arrImages.map((image, index) => (
        <div key={index}>
          <img
            src={image}
            alt={`Slider ${index + 1}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ))}
    </Slider>
  );
};

export default SliderComponent;
