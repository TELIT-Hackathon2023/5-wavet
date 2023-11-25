import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const AdminNavbar = () => {
    const { logout } = useLogout()
    const { user } = useAuthContext();
    return (
        <div className=" w-[15vw] min-w-[180px] z-40">
            <div className="bg-web-gray  w-[15vw] fixed min-w-[180px] h-screen  top-0 left-0   py-16 px-4 text-white flex flex-col justify-between z-50">
                <div>
                    <p className="text-center  pt-3 text-accent"><Link className="text-3xl" to={'/home'} >AdminPanel</Link></p>
                    {user && <p className="text-center relative -top-2">{user.name}</p>}
                    <div className="mt-3 flex flex-col justify-around child-hover:text-accent child:">
                        <div className="border-b border-dark-text"></div>
                        <Link to={'/home'} className="cursor-pointer text-xl  border-b border-dark-text py-2">Home</Link>
                    </div>
                </div>

                <div className="text-center">

                    <button className="btn mx-auto rounded " onClick={logout}>Odhlásiť</button>
                </div>
            </div>

        </div>
    );
}

export default AdminNavbar;