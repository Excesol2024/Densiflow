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
import { collection, addDoc } from "firebase/firestore";
import { db } from "../constant/server";
import { useState } from "react";

function Home() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isSuccess, setIsuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Error states
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Reset errors before validation
    setFullNameError("");
    setEmailError("");

    let valid = true;

    // Validate fullName
    if (!fullName) {
      setFullNameError("Full Name is required.");
      valid = false;
      setIsLoading(false);
    }

    // Validate email
    if (!email) {
      setEmailError("Email is required.");
      valid = false;
      setIsLoading(false);
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email.");
      valid = false;
      setIsLoading(false);
    }

    // If validation passes, send the data
    if (valid) {
      try {
        const docRef = await addDoc(collection(db, "users"), {
          fullName,
          email,
          createdAt: new Date(),
        });

        if (docRef) {
          setIsuccess(true);
          setIsLoading(false);
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-white bg-gradient-to-b from-[#007AFF] to-black m-0">
      {/* Header Section */}
      <div className="w-full flex justify-between items-center px-4 lg:px-36 py-4">
        <img src="/logo.png" alt="Densiflow Logo" className="h-14" />
      </div>

      {/* Main Content */}
      <div className="flex flex-col relative px-6 lg:px-36 lg:pr- py-8 ">
        <div className="flex flex-col lg:flex-row  gap-5 ">
          {/* Left Content: Text and Form */}
          <div className="flex-1 lg:max-w-[40rem] max-w-full w-full lg:text-left 2xl:mt-10 md:mt-5 mb-9">
            <h1 className="text-3xl 2xl:text-[3rem] md:text-4xl mt-10 font-black text-white leading-tight 2xl:leading-none">
              Your Time Matters.
            </h1>
            <h1 className="text-3xl 2xl:text-[3rem] md:text-4xl  font-black text-white mt-4 leading-tight 2xl:leading-none">
              Use Densiflow!
            </h1>
            <p className="mt-8 text-md font-[300]">
              Why guess when you can know? Densiflow shows you the real-time
              crowd status of popular spots like cafes, restaurants, and
              parks—and notifies you when it{""}s the perfect time to visit,
              plus enjoy helpful trends and personalized suggestions.
            </p>
            <p className="mt-4 font-semibold text-lg">
              Don’t miss out—join the waitlist for early access to Densiflow!
            </p>

            {/* Input Form */}
            <div className="mt-4 lg:max-w-[21rem] w-full">
              <div className="flex items-center rounded-lg p-2 bg-[#FFFFFF] bg-opacity-10">
                <User className="text-gray-500 mr-3 ml-3" />
                <input
                  type="text"
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (e.target.value) setFullNameError("");
                  }}
                  className="w-full bg-transparent outline-none text-white placeholder-gray-100"
                  placeholder="Full Name"
                  required
                />
              </div>
              {fullNameError && (
                <p className="text-red-500 text-sm mt-1">{fullNameError}</p>
              )}

              <div className="flex mt-2 mb-2 items-center rounded-lg p-2 bg-[#FFFFFF] bg-opacity-10">
                <Email className="text-gray-500 mr-3 ml-3" />
                <input
                  type="text"
                  className="w-full bg-transparent outline-none text-white placeholder-gray-100"
                  placeholder="Email Address"
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value) setEmailError("");
                  }}
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-sm mt-1 mb-2">{emailError}</p>
              )}

              <button
                onClick={(e) => handleFormSubmit(e)}
                className="w-full relative flex items-center justify-center bg-primary text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="spinner border-t-transparent border-white border-2 border-solid rounded-full w-4 h-4 animate-spin"></div>
                    <span className="text-center">Loading...</span>
                  </div>
                ) : (
                  <>
                    <span className="w-full text-center">
                      Join the Waitlist
                    </span>
                    <Arrow className="absolute right-4" />
                  </>
                )}
              </button>
            </div>

            {/*SUCCESS */}

            {isSuccess ? (
              <div className="flex gap-2 items-center mt-2 lg:max-w-[25rem] border bg-[#FFFFFF] bg-opacity-10 border-primary p-2 rounded-lg">
                <Success />
                <div className="">
                  We’ve added <span className="font-bold">{email}</span> to our
                  waitlist. We’ll let you know when Densiflow is ready.
                </div>
              </div>
            ) : (
              ""
            )}

            <div className=" lg:flex flex-col 2xl:mt-[11.5rem] lg:mt-24 hidden">
              <div className="flex gap-4 md:justify-start justify-center">
                <a href="https://www.youtube.com/@peakmediaph" target="_blank">
                  <Youtube className="text-gray-400 hover:text-white transition" />
                </a>
                <a href="https://www.facebook.com/Excesol" target="_blank">
                  <Facebook className="text-gray-400 hover:text-white transition" />
                </a>
                <a href="https://x.com/excesolutions" target="_blank">
                  <Twitter className="text-gray-400 hover:text-white transition" />
                </a>
                <a
                  href="https://www.instagram.com/excesolutions"
                  target="_blank"
                >
                  <Instagram className="text-gray-400 hover:text-white transition" />
                </a>
                <a
                  href="https://www.linkedin.com/company/excesol"
                  target="_blank"
                >
                  <Linkedin className="text-gray-400 hover:text-white transition" />
                </a>
              </div>
              <p className="text-lg mt-4 md:text-start text-center">
                © 2024 Densiflow. All Rights Reserved.
              </p>
            </div>
          </div>

          {/* Right Content: Phone Image and App Links */}
          <div className="flex-1 flex flex-col items-center justify-center md:py-0 py-10">
            <img
              src="/max.png"
              alt="Densiflow App Preview"
              className="w-full lg:w-[57rem] md:flex hidden mx-auto"
            />
            <img
              src="/newone.png"
              alt="Densiflow App Preview"
              className="w-full lg:w-[30rem] md:hidden flex rounded-3xl mx-auto"
            />
               <img
              src="/newthree.png"
              alt="Densiflow App Preview"
              className="w-full lg:w-[30rem] mt-5 md:hidden flex rounded-3xl mx-auto"
            />
                         <img
              src="/newtwo.png"
              alt="Densiflow App Preview"
              className="w-full lg:w-[30rem] mt-5 md:hidden flex rounded-3xl mx-auto"
            />
            <div className="flex flex-col mt-10">
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
                    <span className="text-xs text-gray-400">
                      Download on the
                    </span>
                    <span className="font-bold text-lg">App Store</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Social Media Links */}
        <div className=" flex flex-col mt-4 justify-center items-center lg:hidden">
          <div className="flex gap-4 md:justify-start justify-center">
            <a href="https://www.youtube.com/@peakmediaph" target="_blank">
              <Youtube className="text-gray-400 hover:text-white transition" />
            </a>
            <a href="https://www.facebook.com/Excesol" target="_blank">
              <Facebook className="text-gray-400 hover:text-white transition" />
            </a>
            <a href="https://x.com/excesolutions" target="_blank">
              <Twitter className="text-gray-400 hover:text-white transition" />
            </a>
            <a href="https://www.instagram.com/excesolutions" target="_blank">
              <Instagram className="text-gray-400 hover:text-white transition" />
            </a>
            <a href="https://www.linkedin.com/company/excesol" target="_blank">
              <Linkedin className="text-gray-400 hover:text-white transition" />
            </a>
          </div>
          <p className="text-md mt-4 md:text-start text-center">
            © 2024 Densiflow. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
