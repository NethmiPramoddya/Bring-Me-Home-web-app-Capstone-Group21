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
            class="w-[959px] h-[959px] flex-shrink-0 aspect-[1/1] absolute top-[-180px] left-[440px]"
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
        <button class="w-[242px] h-[71px] flex-shrink-0 rounded-[13px] bg-[#6A6A6A] absolute top-[505px] left-[85px]">
          <p class="w-[115px] h-[29px] flex-shrink-0 text-white font-[Inter] text-[24px] font-bold leading-none absolute top-[23px] left-[58px]">
            Get Start
          </p>
        </button>
      </div>
    </div>
  );
}
