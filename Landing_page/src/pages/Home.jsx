import User from "../components/svg/User";
import Email from "../components/svg/Email";
import Arrow from "../components/svg/Arrow";
import Youtube from "../components/svg/Youtube";
import Facebook from "../components/svg/Facebook";
import Twitter from "../components/svg/Tweeter";
import Instagram from "../components/svg/Instagram";
import Linkedin from "../components/svg/Linkedin";
import Googleplay from "../components/svg/Googleplay";
import Apple from "../components/svg/Apple";
import Success from "../components/svg//Success";

function Home() {
  return (
    <div className="flex flex-col min-h-screen text-white bg-gradient-to-b from-[#007AFF] to-black m-0">
      {/* Header Section */}
      <div className="w-full flex justify-between items-center px-6 lg:px-36 py-4">
        <img src="/logo.png" alt="Densiflow Logo" className="h-14" />
      </div>

      {/* Main Content */}
      <div className="flex flex-col relative px-6 lg:px-36 lg:pr-16 py-8 ">
        <div className="flex flex-col lg:flex-row items-center gap-2">
          {/* Left Content: Text and Form */}
          <div className="flex-1 max-w-[40rem] w-full lg:text-left">
            <h1 className="text-3xl lg:text-[3rem] mt-10 font-black text-white leading-tight 2xl:leading-none">
              Your Time Matters.
            </h1>
            <h1 className="text-3xl lg:text-[3rem]  font-black text-white mt-4 leading-tight 2xl:leading-none">
              Use Densiflow!
            </h1>
            <p className="mt-8 text-md font-[300]">
              Stop guessing and start planning smarter. Densiflow shows you the
              real-time crowd status of popular spots like cafes, restaurants, and
              parks—and notifies you when it's the perfect time to visit.
            </p>
            <p className="mt-4 font-semibold text-lg">
              Don’t miss out—join the waitlist for early access to Densiflow!
            </p>

            {/* Input Form */}
            <div className="mt-4 space-y-4 lg:max-w-[21rem] w-full">
              <div className="flex items-center rounded-lg p-2 bg-[#FFFFFF] bg-opacity-10">
                <User className="text-gray-500 mr-3 ml-3" />
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-100"
                  placeholder="Full Name"
                />
              </div>
              <div className="flex items-center rounded-lg p-2 bg-[#FFFFFF] bg-opacity-10">
                <Email className="text-gray-500 mr-3 ml-3" />
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-100"
                  placeholder="Email Address"
                />
              </div>
              <button className="w-full relative flex items-center justify-center bg-primary text-white py-3 rounded-lg hover:bg-blue-700 transition">
                <span className="w-full text-center">Join the Waitlist</span>
                <Arrow className="absolute right-4" />
              </button>

          
            </div>

                {/*SUCCESS */}

                <div className="flex gap-2 items-center mt-2 lg:max-w-[25rem] border bg-[#FFFFFF] bg-opacity-10 border-primary p-2 rounded-lg">
                <Success/>
                <div className="">
                We’ve added <span className="font-bold">shennacanas@gmail.com</span> to our waitlist. We’ll let you know when Densiflow is ready.
                </div>
              </div>

            {/* Social Media Links */}
            <div className="lg:mt-20 mt-10 flex flex-col">
              <div className="flex gap-4 md:justify-start justify-center">
                <Youtube className="text-gray-400 hover:text-white transition" />
                <Facebook className="text-gray-400 hover:text-white transition" />
                <Twitter className="text-gray-400 hover:text-white transition" />
                <Instagram className="text-gray-400 hover:text-white transition" />
                <Linkedin className="text-gray-400 hover:text-white transition" />
              </div>
              <p className="text-lg mt-4 md:text-start text-center">
                © 2024 Densiflow. All Rights Reserved.
              </p>
            </div>
          </div>

          {/* Right Content: Phone Image and App Links */}
          <div className="flex-1 flex flex-col items-center md:py-0 py-10">
            <img
              src="/newphone.png"
              alt="Densiflow App Preview"
              className="w-full lg:w-[19rem] mx-auto"
            />
            <div className="flex flex-col mt-8">
              <p className="text-center">Available soon on</p>
              <div className="flex flex-wrap justify-center md:flex-nowrap gap-4 mt-4">
                {/* Google Play Button */}
                <button className="flex items-center border border-gray-600 bg-black rounded-lg px-4 py-2 gap-2 hover:border-white transition">
                  <Googleplay />
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-400">GET IT ON</span>
                    <span className="font-bold text-lg">Google Play</span>
                  </div>
                </button>

                {/* App Store Button */}
                <button className="flex items-center border border-gray-600 bg-black rounded-lg px-4 py-2 gap-2 hover:border-white transition">
                  <Apple />
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-400">Download on the</span>
                    <span className="font-bold text-lg">App Store</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
