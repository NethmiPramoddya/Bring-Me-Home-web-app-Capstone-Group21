import React from "react";
import "./App.css";
import TopImage from "./assets/home_page_img.png";

export default function Home() {
  return (
    <div>
      <div class="w-[95%] h-[645px] flex-shrink-0 rounded-[68px] bg-[#F0F0F0] absolute top-[120px] ml-[30px]">
        <h1 class="w-[448px] h-[403px] flex-shrink-0 text-[#FF8B2A] font-[Aclonica] text-[96px] font-normal leading-none absolute top-[85px] ml-[85px]">
          Bring Me
          <br />
          Home
        </h1>
        <div>
        <img
            class="w-[300px] h-[300px]
            sm:w-[700px] sm:h-[700px] sm:top-[-120px] sm:left-[300px]
            md:w-[750px] md:h-[750px] md:top-[-90px] md:left-[300px]
            2md:w-[800px] 2md:h-[800px] 2md:top-[-125px] 2md:left-[300px]
            3md:w-[900px] 3md:h-[900px] 3md:top-[-140px] 3md:left-[350px]
            4md:w-[900px] 4md:h-[900px] 4md:top-[-145px] 4md:left-[360px]
            lg:w-[1000px] lg:h-[1000px] lg:top-[-145px] lg:left-[370px]
            xl:w-[1100px] xl:h-[1100px] xl:top-[-150px] xl:left-[440px]
            
            flex-shrink-0 aspect-[1/1] absolute top-[-100px] left-[50px]"
            src={TopImage}
            alt="plane"
          />
        </div>
        <p class="w-[508px] h-[124px] flex-shrink-0 text-black font-[Bellota] text-[20px] font-normal leading-none absolute top-[390px] ml-[85px]">
          Bring Me Home connects people across borders by matching package
          senders with trusted travelers. Easily send gifts or essentials to
          your loved ones abroad—with a personal touch and a small tip for the
          helping traveler.
        </p>
        <button class="w-[180px] h-[60px] sm:w-[220px] sm:h-[65px] md:w-[242px] md:h-[71px] flex-shrink-0 rounded-[13px] bg-[#6A6A6A] absolute top-[420px] left-[40px] sm:top-[480px] sm:left-[70px] md:top-[505px] md:left-[85px]">
          <p  class="w-[90px] h-[24px] text-white font-[Inter] text-[18px] sm:w-[115px] sm:h-[29px] sm:text-[20px] md:text-[24px] font-bold leading-none absolute top-[10px] left-[20px] sm:top-[20px] sm:left-[58px]">
            Get Start
          </p>
        </button>
      </div>
    </div>
  );
}

