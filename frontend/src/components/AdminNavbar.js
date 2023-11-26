import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const AdminNavbar = () => {
    const { logout } = useLogout()
    const { user } = useAuthContext();
    return (
        <div className=" w-[15vw] min-w-[180px] z-20">
            <div className="bg-accent  w-[15vw] fixed min-w-[180px] h-screen  top-0 left-0   py-16 px-4 text-white flex flex-col justify-between z-20">

                <div className="h-2/3 text-center mt-24">
                    <div className="mt-3 flex flex-col justify-around ">
                        <Link to={'/home'} className="cursor-pointer text-xl border-y border-gray-300  py-3 px-8">Home</Link>
                        <Link to={'/profile/${user.id}'} className="cursor-pointer text-xl border-b border-gray-300  py-3 px-8">Profile</Link>
                        <Link to={'/reservations/${user.id}'} className="cursor-pointer text-xl  border-b border-dark-text py-2">Reservations</Link>
                    </div>
                </div>

                <div className="text-center mb-18">

                    <button className="btn mx-auto rounded !text-accent !bg-white " onClick={logout}>Logout</button>
                </div>
            </div>

        </div>
    );
}

export default AdminNavbar;