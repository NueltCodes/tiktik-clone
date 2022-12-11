import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { AiOutlineLogout } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import Logo from "../utils/tiktik-logo.png";
import { createOrGetUser } from "../utils";
import useAuthStore from "../store/authStore";
import { useEffect, useState } from "react";
import { IUser } from "../types.dev";

const Navbar = () => {
  const [user, setUser] = useState<IUser | null>();
  const [searchValue, setSearchValue] = useState("");
  const { userProfile, addUser, removeUser } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    setUser(userProfile);
  }, [userProfile]);

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (searchValue) {
      router.push(`/search/${searchValue}`);
    }
  };
  return (
    <div>
      <div className="w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4">
        <Link href="/">
          <div className="w-[100px] md:w-[130px] ">
            <Image
              className="cursor-pointer"
              src={Logo}
              alt="TikTik"
              layout="responsive"
            />
          </div>
        </Link>
        <div className="relative hidden md:block">
          <form
            onSubmit={handleSearch}
            className="absolute md:static top-10 left-20 bg-white"
          >
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Accounts and Videos"
              className="bg-primary p-3 md:text-md font-medium border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 w-[300px] md:w-[350px] rounded-full md:top-0"
            />
            <button
              onClick={handleSearch}
              className=" absolute md:right-5 right-6 top-4 border-left-2 border-gray-300 pl-4 text-2xl text-gray-400"
            >
              <BiSearch />
            </button>
          </form>
        </div>

        <div>
          {userProfile ? (
            <div className="flex items-center gap-5 md:gap-10">
              <Link href="/upload">
                <button className="border-2 md:px-4 px-2 text-md font-semibold flex items-center gap-2">
                  <IoMdAdd className="text-xl" />
                  <span className="hidden md:block">Upload</span>
                </button>
              </Link>
              {userProfile.image ? (
                <Link href="/">
                  <>
                    <Image
                      width={40}
                      height={40}
                      className="rounded-full cursor-pointer"
                      src={userProfile.image}
                      alt="Profile Photo"
                    />
                  </>
                </Link>
              ) : (
                <>{userProfile.userName}</>
              )}
              <button
                type="button"
                className="px-2"
                onClick={() => {
                  googleLogout();
                  removeUser();
                }}
              >
                <AiOutlineLogout color="red" fontSize={21} />
              </button>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={(response) => createOrGetUser(response, addUser)}
              onError={() => console.log(`Error`)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
