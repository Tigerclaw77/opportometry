import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "./Carousel.css"; // Optional for styling

const Carousel = () => {
  return (
    <div className="carousel-container">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20} // Space between images
        slidesPerView={3} // Show 3 images at a time
        loop={true} // Infinite loop
        autoplay={{
          delay: 0, // No delay, continuous movement
          disableOnInteraction: false,
        }}
        speed={4000} // Slow scroll speed
      >
        <SwiperSlide>
          <img src="/images/eyedoctor.jpg" alt="Eyecare Doctor" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/optician.jpg" alt="Optician" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/tech.jpg" alt="Technician" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/staff.jpg" alt="Staff" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/eyedoctor2.jpg" alt="Eyecare Doctor" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/receptionist.jpg" alt="Receptionist" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/admin.jpg" alt="Admin Staff" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Carousel;
