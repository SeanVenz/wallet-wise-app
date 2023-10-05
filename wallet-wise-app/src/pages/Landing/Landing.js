import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";

import TitlePotato from "images/big-potato.png";
import Logo from "images/top-logo.png";
import Lumpia from "images/lumpia.png";
import Adobo from "images/adobo.png";
import Ginabot from "images/ginabot.png";
import Siomai from "images/siomai.png";
import Chicken from "images/chicken.png";

function Landing() {
  return (
    <div className="flex flex-col bg-[#F9F2E2] oveflow-x-hidden w-screen h-screen">
      {/* TOP NAV */}
      <div className="flex w-full justify-between py-3 h-[90px]">
        <Image
          src={Logo}
          alt="Top logo"
          className=" lg:h-[90px] h-auto lg:mt-0 mt-1 w-auto ml-5"
        />
        <div className="lg:ml-0 -ml-[300px] flex space-x-4 h-full mr-5">
          <Link
            to="/login"
            className="bg-[#f9f2e2] shadow-md rounded-lg border border-rose-300 flex items-center w-auto px-5 text-[15px] lg:text-[20px] transition-all duration-300 ease-in-out hover:bg-rose-300 hover:border-black mt-6 h-[50px]"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-[#f9f2e2] shadow-md rounded-lg border border-rose-300 flex items-center w-auto px-5 text-[15px] lg:text-[20px] transition-all duration-300 ease-in-out hover:bg-rose-300 hover:border-black mt-6 h-[50px]"
          >
            Sign Up
          </Link>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center h-full ">
        {/* TITLE */}
        <div className="flex items-center lg:mt-0 justify-center lg:w-full w-full">
          <Image
            src={TitlePotato}
            alt="titlePpotato"
            className="flex w-auto h-[100px] md:h-[200px] lg:h-[320px]"
          />
          <div className="flex flex-col justify-center items-center md:gap-[50px] lg:gap-[100px]">
            <div className="font-[julius] text-3xl md:text-[70px] lg:text-[140px] tracking-[0.2em]">
              WALLET
            </div>
            <div className="font-[Monoton] text-2xl md:text-[50px] lg:text-[100px]">
              WISE
            </div>
          </div>
          <Image
            src={TitlePotato}
            alt="titlePotato"
            className="flex w-auto h-[100px] md:h-[200px] lg:h-[320px]"
          />
        </div>
        {/* Images */}
        <div className="h-auto w-full flex flex-wrap py-10 md:px-[100px] justify-center items-center gap-3 md:gap-5 lg:gap-10">
          <div className="w-[90px] h-[90px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px]">
            <Image
              src={Lumpia}
              alt="Lumpia"
              className="w-full h-full rounded-[50%] border-[2px] border-black"
            />
          </div>
          <div className="w-[90px] h-[90px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px]">
            <Image
              src={Adobo}
              alt="Adobo"
              className="w-full h-full rounded-[50%] border-[2px] border-black"
            />
          </div>
          <div className="w-[90px] h-[90px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px]">
            <Image
              src={Ginabot}
              alt="Ginabot"
              className="w-full h-full rounded-[50%] border-[2px] border-black"
            />
          </div>
          <div className="w-[90px] h-[90px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px]">
            <Image
              src={Siomai}
              alt="Siomai"
              className="w-full h-full rounded-[50%] border-[2px] border-black"
            />
          </div>
          <div className="w-[90px] h-[90px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px]">
            <Image
              src={Chicken}
              alt="Chicken"
              className="w-full h-full rounded-[50%] border-[2px] border-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
