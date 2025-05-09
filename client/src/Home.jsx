import React from "react";
import "./App.css";
import TopImage from "./assets/home_page_img.png";
import Bag from "./assets/bag.png";
import Shuttle from "./assets/shuttle.png";
import Safe_logo from "./assets/safe.png";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles


export default function Home() {

  useEffect(() => {
    AOS.init({duration: 1300});
  })
  return (
    <div>
      <div class=" w-[95%] h-[645px] flex-shrink-0 rounded-[68px] bg-[#F0F0F0] absolute top-[120px] ml-[30px] data-aos='fade-up'" data-aos="fade-up">
        <h1 class="w-[448px] h-[403px] flex-shrink-0 text-[#FF8B2A] font-[Aclonica] text-[96px] font-normal leading-none absolute top-[85px] ml-[85px]" data-aos="fade-up">
          Bring Me
          <br />
          Home
        </h1>
        <div>
          <img
            class="w-[300px] h-[300px]
            sm:w-[550px] sm:h-[550px] sm:top-[-120px] sm:left-[300px]
            md:w-[600px] md:h-[600px] md:top-[-90px] md:left-[300px]
            2md:w-[650px] 2md:h-[650px] 2md:top-[-125px] 2md:left-[300px]
            3md:w-[700px] 3md:h-[700px] 3md:top-[-140px] 3md:left-[350px]
            4md:w-[700px] 4md:h-[700px] 4md:top-[-145px] 4md:left-[360px]
            lg:w-[800px] lg:h-[800px] lg:top-[-145px] lg:left-[370px]
            xl:w-[800px] xl:h-[800px] xl:top-[-150px] xl:left-[440px]
            
            flex-shrink-0 aspect-[1/1] absolute top-[-100px] left-[50px]"
            src={TopImage}
            alt="plane"
            data-aos="fade-left"
          />
        </div>
        <p class="animate-pulse w-[508px] h-[124px] flex-shrink-0 text-black font-[Bellota] text-[20px] font-normal leading-none absolute top-[390px] ml-[85px]">
          Bring Me Home connects people across borders by matching package
          senders with trusted travelers. Easily send gifts or essentials to
          your loved ones abroad—with a personal touch and a small tip for the
          helping traveler.
        </p>
        <button class="w-[180px] h-[60px] sm:w-[220px] sm:h-[65px] md:w-[242px] md:h-[71px] flex-shrink-0 rounded-[13px] bg-[#6A6A6A] absolute top-[420px] left-[40px] sm:top-[480px] sm:left-[70px] md:top-[505px] md:left-[85px]">
          <p class="w-[90px] h-[24px] text-white font-[Inter] text-[18px] sm:w-[115px] sm:h-[29px] sm:text-[20px] md:text-[24px] font-bold leading-none absolute top-[10px] left-[20px] sm:top-[20px] sm:left-[58px]">
            Get Start
          </p>
        </button>
      </div>
      <div className="wd">
        <h1 class=" w-[472px] h-[104px] text-[#6A6A6A] font-inter text-[64px] font-extrabold leading-none absolute top-[900px] ml-[50%]" data-aos="fade-up">
          Who we are...?
        </h1>
        <p class=" w-[627px] h-[375px] flex-shrink-0 text-[#6A6A6A] font-bold text-[32px] font-[Bellota] leading-normal absolute top-[1000px] ml-[50%] text-justify"  data-aos="fade-up">
          Bring Me Home is a trusted global platform that connects people across
          borders by matching package senders with reliable travelers. We make
          it easy to send personal items, gifts, or essentials internationally,
          ensuring a safe and human touch in every delivery—powered by community
          trust and a shared purpose.
        </p>
        <img
          class="w-[356px] h-[463px] aspect-[356/463] absolute top-[950px] ml-[10%]"
          src={Bag}
          alt="bag"
          data-aos="fade-left"
        />
      </div>
      <div>
        <h1 class="w-[472px] h-[104px] shrink-0 text-[#6A6A6A] font-inter text-[64px] not-italic font-extrabold leading-none absolute top-[1600px] ml-[100px]" data-aos="fade-up">
          Is It Fast...?
        </h1>
        <p class="w-[627px] h-[375px] flex-shrink-0 text-[#6A6A6A] font-[Bellota] text-[32px] not-italic font-bold leading-normal absolute top-[1700px] ml-[100px] text-justify" data-aos="fade-up">
          Yes! Bring Me Home offers a faster alternative to traditional
          shipping. By connecting with travelers already heading to your
          package’s destination, your items can be delivered in less time—often
          days instead of weeks. No long customs delays, just quick and reliable
          delivery.
        </p>
        <img
          class="w-[440px] h-[452px] shrink-0 aspect-[145/149] absolute top-[1600px] ml-[60%]"
          src={Shuttle}
          alt="shuttle"
          data-aos="fade-right"
        />
      </div>
      <div>
        <h1 class="w-[472px] h-[104px] text-[#6A6A6A] font-inter text-[64px] font-extrabold leading-none absolute top-[2200px] ml-[50%]" data-aos="fade-up">
          Why we are Secure...?
        </h1>
        <p class="w-[627px] h-[375px] flex-shrink-0 text-[#6A6A6A] font-bold text-[32px] font-[Bellota] leading-normal absolute top-[2350px] ml-[50%] text-justify" data-aos="fade-up">
          At Bring Me Home, your package’s safety is our top priority. Every
          delivery is arranged directly between you and a verified traveler,
          with the package securely wrapped and checked in person—ensuring full
          transparency. The traveler knows exactly what they are carrying,
          eliminating confusion and enhancing trust. Our built-in tracking
          system allows you to monitor your item throughout the journey,
          providing peace of mind from start to finish.
        </p>
        <img
          class="w-[434px] h-[434px] aspect-[1/1] absolute top-[2380px] ml-[10%]"
          src={Safe_logo}
          alt="bag"
          data-aos="fade-down"
        />
      </div>
      
    </div>
  );
}
