import React from "react";
import "./App.css";
import TopImage from "./assets/home_page_img.png";
import Bag from "./assets/bag.png";
import Shuttle from "./assets/shuttle.png";
import Safe_logo from "./assets/safe.png";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1300 });
  });
  return (
    <div>
      <div
        class="absolute flex-shrink-0 rounded-[68px] bg-[#F0F0F0] top-[120px] 
          h-[645px]
         4sm:w-[95%] 4sm:h-[700px] 4sm:left-[2%]
         3sm:w-[95%] 3sm:h-[630px] 3sm:left-[2%]
         2sm:w-[95%] 2sm:h-[640px] 2sm:left-[2%]
         sm:w-[95%] sm:h-[640px]  sm:left-[2%]
         md:w-[95%] md:h-[620px] md:left-[2%]
         2md:w-[95%] 2md:h-[650px]
         3md:w-[95%] 3md:h-[680px]
         4md:w-[95%] 4md:h-[690px]
         lg:w-[95%] lg:h-[800px] lg:left-[3%] 
         xl:w-[95%] xl:h-[820px] xl:left-[40px]  "
        data-aos="fade-up"
      >
        <h1
          class="w-[448px] h-[403px] flex-shrink-0 text-[#FF8B2A] font-[Aclonica] text-[96px] font-normal leading-none absolute top-[85px] ml-[85px]"
          data-aos="fade-up"
        >
          Bring Me
          <br />
          Home
        </h1>
        <div>
          <img
            class="w-[300px] h-[300px]
            4sm:w-[300px] 4sm:h-[300px] 4sm:top-[160px] 4sm:left-[300px]
            3sm:w-[400px] 3sm:h-[400px] 3sm:top-[-80px] 3sm:left-[250px]
            2sm:w-[500px] 2sm:h-[500px] 2sm:top-[-110px] 2sm:left-[260px]
            sm:w-[550px] sm:h-[550px] sm:top-[-100px] sm:left-[290px]
            md:w-[500px] md:h-[500px] md:top-[-90px] md:left-[390px]
            2md:w-[650px] 2md:h-[650px] 2md:top-[-125px] 2md:left-[300px]
            3md:w-[700px] 3md:h-[700px] 3md:top-[-130px] 3md:left-[390px]
            4md:w-[700px] 4md:h-[700px] 4md:top-[-135px] 4md:left-[460px]
            lg:w-[800px] lg:h-[800px] lg:top-[-135px] lg:left-[450px]
            xl:w-[900px] xl:h-[900px] xl:top-[-130px] xl:left-[440px]
            
            flex-shrink-0 aspect-[1/1] absolute "
            src={TopImage}
            alt="plane"
            data-aos="fade-left"
          />
        </div>
        <p class="animate-pulse flex-shrink-0 text-black font-[Bellota] text-[20px] font-normal leading-none absolute text-justify
        
          
          3sm:w-[500px] 3sm:h-[324px] 3sm:top-[400px] 3sm:left-[85px] 3sm:ml-[5px]
          4sm:w-[400px] 4sm:h-[324px] 4sm:top-[400px] 4sm:left-[85px] 4sm:ml-[5px]        
          2sm:w-[500px] 2sm:h-[324px] 2sm:top-[400px] 2sm:left-[85px] 2sm:ml-[5px]
          sm:w-[500px] sm:h-[324px] sm:top-[400px] sm:left-[85px] sm:ml-[5px]
          md:w-[500px] md:h-[324px] md:top-[400px] md:left-[85px] md:ml-[5px]
          2md:w-[500px] 2md:h-[324px] 2md:top-[400px] 2md:left-[85px] 2md:ml-[5px]
          3md:w-[500px] 3md:h-[324px] 3md:top-[400px] 3md:left-[85px] 3md:ml-[5px]
          4md:w-[500px] 4md:h-[324px] 4md:top-[400px] 4md:left-[85px] 4md:ml-[5px]
          lg:w-[500px] lg:h-[324px] lg:top-[400px] lg:left-[85px] lg:ml-[5px]
          xl:w-[500px] xl:h-[324px] xl:top-[400px] xl:left-[85px] xl:ml-[5px]">
          Bring Me Home connects people across borders by matching package
          senders with trusted travelers. Easily send gifts or essentials to
          your loved ones abroad—with a personal touch and a small tip for the
          helping traveler.
        </p>
        <button class="flex-shrink-0 rounded-[13px] bg-[#6A6A6A] absolute top-[420px] left-[40px]
        

        3sm:w-[200px] 3sm:h-[60px] 3sm:top-[530px] 3sm:left-[85px]
        4sm:w-[200px] 4sm:h-[60px] 4sm:top-[560px] 4sm:left-[85px]
        2sm:w-[200px] 2sm:h-[60px] 2sm:top-[530px] 2sm:left-[85px]
        sm:w-[242px] sm:h-[71px] sm:top-[520px] sm:left-[85px]
        md:w-[242px] md:h-[71px] md:top-[505px] md:left-[85px]
        2md:w-[242px] 2md:h-[71px] 2md:top-[505px] 2md:left-[85px]
        3md:w-[242px] 3md:h-[71px] 3md:top-[505px] 3md:left-[85px]
        4md:w-[242px] 4md:h-[71px] 4md:top-[565px] 4md:left-[85px]
        lg:w-[242px] lg:h-[71px] lg:top-[565px] lg:left-[85px]
        xl:w-[242px] xl:h-[71px] xl:top-[565px] xl:left-[85px]
        ">
          <p class="w-[90px] h-[24px] text-white font-[Inter] text-[18px] sm:w-[115px] sm:h-[29px]  md:text-[24px] font-bold leading-none absolute top-[10px] left-[20px] sm:top-[20px] sm:left-[58px]
          
          3sm:w-[115px] 3sm:h-[29px] 3sm:top-[20px] 3sm:left-[43px]
          4sm:w-[115px] 4sm:h-[29px] 4sm:top-[20px] 4sm:left-[43px]
          2sm:top-[20px] 2sm:left-[58px] 2sm:text-[20px]">
            Get Start
          </p>
        </button>
      </div>
      <div className="wd">
        <h1
          class=" w-[472px] h-[104px] text-[#6A6A6A] font-inter font-extrabold leading-none absolute  ml-[50%]
          xl:left-[0px] xl:top-[1050px] xl:ml-[50%]
          lg:left-[50px] lg:top-[1050px] lg:ml-[50%]
          4md:left-[3px] 4md:top-[980px] 4md:ml-[50%]
          3md:left-[3px] 3md:top-[960px] 3md:ml-[50%]
          2md:left-[3px] 2md:top-[920px] 2md:ml-[50%]
          md:left-[3px] md:top-[880px] md:ml-[50%]
        sm:left-[3px] sm:top-[1400px] sm:ml-[30%] text-[45px]
        2sm:left-[3px] 2sm:top-[1400px] 2sm:ml-[30%] text-[35px]
        3sm:left-[3px] 3sm:top-[1400px] 3sm:ml-[30%] text-[35px]
        4sm:left-[3px] 4sm:top-[1400px] 4sm:ml-[20%] text-[60px]"  
          data-aos="fade-up"
        >
          Who we are...?
        </h1>
        <p
          class="  h-[375px] flex-shrink-0 text-[#6A6A6A] font-bold text-[32px] font-[Bellota] leading-normal absolute top-[1000px] ml-[50%] text-justify
          
          xl:left-[0px] xl:top-[1120px] xl:ml-[50%] xl:w-[40%]
          lg:left-[50px] lg:top-[1120px] lg:ml-[50%]  lg:w-[40%]
          4md:left-[3px] 4md:top-[1050px] 4md:ml-[50%] 4md:w-[40%]
          3md:left-[3px] 3md:top-[1020px] 3md:ml-[50%] 3md:w-[40%]
          2md:left-[3px] 2md:top-[980px] 2md:ml-[50%] 2md:w-[40%]
          md:left-[3px] md:top-[940px]  md:ml-[50%] md:w-[40%]
          
          sm:left-[3px] sm:top-[1480px] sm:ml-[30%] text-[25px] sm:w-[40%]
          2sm:left-[3px] 2sm:top-[1480px] 2sm:ml-[30%] text-[25px] 2sm:w-[40%]
          3sm:left-[3px] 3sm:top-[1480px] 3sm:ml-[30%] text-[25px] 3sm:w-[40%]
          4sm:left-[3px] 4sm:top-[1480px] 4sm:ml-[20%] text-[25px] 4sm:w-[60%]
          "
          data-aos="fade-up"

          
        >
          Bring Me Home is a trusted global platform that connects people across
          borders by matching package senders with reliable travelers. We make
          it easy to send personal items, gifts, or essentials internationally,
          ensuring a safe and human touch in every delivery—powered by community
          trust and a shared purpose.
        </p>
        <img
          class="w-[356px] h-[463px] aspect-[356/463] absolute top-[950px] ml-[10%]
          
          xl:w-[356px] xl:h-[463px] xl:top-[950px] xl:ml-[10%]
          lg:w-[356px] lg:h-[463px] lg:top-[950px] lg:ml-[10%]
          4md:w-[356px] 4md:h-[463px] 4md:top-[950px] 4md:ml-[10%]
          3md:w-[356px] 3md:h-[463px] 3md:top-[950px] 3md:ml-[10%]
          md:w-[356px] md:h-[463px] md:top-[950px] md:ml-[10%]
          2md:w-[356px] 2md:h-[463px] 2md:top-[950px] 2md:ml-[10%]
          sm:w-[356px] sm:h-[463px] sm:top-[900px] sm:ml-[30%]
          2sm:w-[356px] 2sm:h-[463px] 2sm:top-[900px] 2sm:ml-[30%]
          3sm:w-[356px] 3sm:h-[463px] 3sm:top-[900px] 3sm:ml-[30%]
          4sm:w-[356px] 4sm:h-[463px] 4sm:top-[900px] 4sm:ml-[25%]"
          src={Bag}
          alt="bag"
          data-aos="fade-left"
        />
      </div>
      {/* <div>
        <h1
          class="w-[472px] h-[104px] shrink-0 text-[#6A6A6A] font-inter text-[64px] not-italic font-extrabold leading-none absolute top-[1600px] ml-[100px]"
          data-aos="fade-up"
        >
          Is It Fast...?
        </h1>
        <p
          class="w-[40%] h-[375px] flex-shrink-0 text-[#6A6A6A] font-[Bellota] text-[32px] not-italic font-bold leading-normal absolute top-[1700px] ml-[100px] text-justify"
          data-aos="fade-up"
        >
          Yes! Bring Me Home offers a faster alternative to traditional
          shipping. By connecting with travelers already heading to your
          package’s destination, your items can be delivered in less time—often
          days instead of weeks. No long customs delays, just quick and reliable
          delivery.
        </p>
        <img
          class="w-[440px] h-[452px] shrink-0 aspect-[145/149] absolute top-[1600px] ml-[40%]"
          src={Shuttle}
          alt="shuttle"
          data-aos="fade-right"
        />
      </div> */}
      {/* <div>
        <h1
          class="w-[472px] h-[104px] text-[#6A6A6A] font-inter text-[64px] font-extrabold leading-none absolute top-[2200px] ml-[40%]"
          data-aos="fade-up"
        >
          Why we are Secure...?
        </h1>
        <p
          class="w-[40%] h-[375px] flex-shrink-0 text-[#6A6A6A] font-bold text-[32px] font-[Bellota] leading-normal absolute top-[2350px] ml-[40%] text-justify"
          data-aos="fade-up"
        >
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
      </div> */}
      {/* <div>
        <div
          className="card bg-[#000000] text-primary-content w-120 h-75 absolute top-[3080px] ml-[15%] "
          data-aos="fade-right"
        >
          <div className="card-body">
            <h2
              className="card-title text-[40px] text-[#8d8d8d] font-extrabold text-justify"
              data-aos="fade-left"
            >
              Become a Traveler
            </h2>

            <p className="text-justify" data-aos="fade-right">
              Traveling abroad soon? Earn extra income by delivering packages
              for trusted users through Bring Me Home. Once verified, you can
              browse available delivery requests and choose the ones that match
              your travel plans. You’ll meet the sender, inspect and seal the
              item with them, and hand it over at the destination—making travel
              more rewarding and purposeful.
            </p>
            <span data-aos="fade-right">
              <div className="justify-end card-actions">
                <button className="btn text-[#000000] font-bold bg-[#FF8B2A] p-5">
                  {" "}
                  Buy Now
                </button>
              </div>
            </span>
          </div>
        </div>

        <div
          className="card bg-[#8d8d8d] text-primary-content w-120 h-75 absolute top-[3080px] ml-[50%]"
          data-aos="fade-left"
        >
          <div className="card-body" data-aos="fade-left">
            <h2
              className="card-title text-[40px] text-[#000000] font-extrabold text-justify"
              data-aos="fade-left"
            >
              Become a Traveler
            </h2>

            <p className="text-justify">
              Traveling abroad soon? Earn extra income by delivering packages
              for trusted users through Bring Me Home. Once verified, you can
              browse available delivery requests and choose the ones that match
              your travel plans. You’ll meet the sender, inspect and seal the
              item with them, and hand it over at the destination—making travel
              more rewarding and purposeful.
            </p>
            <span data-aos="fade-left">
              <div className="justify-end card-actions">
                <button className="btn text-[#ffffff] font-bold bg-[#FF8B2A] p-5">
                  {" "}
                  Buy Now
                </button>
              </div>
            </span>
          </div>
        </div>
      </div> */}

      {/* <footer class="footer footer-horizontal footer-center w-[10%] bg-[#000000] text-primary-content p-15 absolute top-[3480px] mb-10" data-aos="fade">
        <aside>
          
          <p className="font-bold text-[#FF8B2A]"  >
            Bring Me Home
            <br />
            Providing reliable Modern and Secure Delivery
          </p>
          <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
        </aside>
        <nav>
          <div class="grid grid-flow-col gap-4">
            
           
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                class="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </nav>
      </footer> */}
    </div>
  );
}
