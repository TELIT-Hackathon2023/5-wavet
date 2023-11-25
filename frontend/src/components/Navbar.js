import { Link } from "react-router-dom";
import { useState } from "react";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
    const [show, setShow] = useState(false)
    const { logout } = useLogout()
    const { user } = useAuthContext()


    return (
        <nav className="h-16 w-screen">
            <div className="bg-accent fixed top-0 h-16 text-white z-50 w-screen">
                <div className="flex h-16  w-[65vw] mx-auto  justify-around  items-center ">
                    <Link className="mx-10 cursor-pointer" to={""}>
                        <img src="./30x36.png" className="" alt="" />
                    </Link>

                    <div className="w-[50vw] block">
                        {user && <nav className="flex mx-auto w-[33vw] justify-around child:px-1">
                            <Link to={"/games"}>Zápasy</Link>
                            <Link to={"/leaderboard"}>Tabuľka</Link>
                            <Link to={"/stats"}>Štatistiky</Link>
                            <Link to={"/schedule"}>Program</Link>
                            <Link to={"/history"}>História</Link>
                            <Link to={"/gallery"}>Foto</Link>
                        </nav>}
                    </div>
                    <div>
                        <Link to={"/login"} className="btn !bg-white !text-accent font-bold">Prihlásiť</Link>
                    </div>
                </div>



            </div>


        </nav>
    );
}

export default Navbar;