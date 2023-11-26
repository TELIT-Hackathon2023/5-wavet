import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
    const { logout } = useLogout()
    const { user } = useAuthContext()

    const [url, setUrl] = useState(useLocation().pathname);
    useEffect(() => {
        setUrl(window.location.pathname)

    }, [useLocation().pathname])

    return (
        <nav className="h-16 w-screen">
            <div className="bg-accent fixed top-0 h-16 text-white z-50 w-screen">
                <div className="flex h-16  w-[65vw] mx-auto  justify-around  items-center ">
                    <Link className="mx-10 cursor-pointer flex items-center" to={""}>
                        <img src="./30x36.png" className="" alt="" />
                        <div className="ml-6  text-2xl text-[#fdb4c5]">Park<span className="text-white text-3xl">IT</span></div>

                    </Link>

                    <div className="w-[50vw] block">

                    </div>
                    <div>
                        {!user && <Link to={"/login"} className="btn !bg-white !text-accent font-bold">Prihlásiť</Link>}
                        {(user && url === "/") && <Link to={"/home"} className="btn !bg-white !text-accent font-bold">Rezervovať</Link>}

                    </div>
                </div>



            </div>


        </nav>
    );
}

export default Navbar;