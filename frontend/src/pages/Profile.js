import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { useAuthContext } from "../hooks/useAuthContext";


const Profile = () => {
    const {user} = useAuthContext()
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        repeat: "",
    })

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        if(passwords.new === passwords.repeat){
            const response = await fetch(`${process.env.REACT_APP_PATH}/api/game/playoff`, {
                method: 'POST', /* popripade PATCH, pri PATCH zadavas len hodnoty ktore chces menit */
                body: JSON.stringify({ /* tu zadaj hodnoty ktore chces poslat na backend*/ }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
        
                })
        
                const json = await response.json()
                if (response.ok) {
                    //tu vynuluj vstup a (optional) pridaj novu hodnotu do array starych
                } else {
                    alert(json.error)
                }
        }        
    }   
        return (
        <div className="flex">
            <AdminNavbar/>
            <div className="flex-1 p-8">
                <div className="profile-header text-center mx-10  ">
                    <img src="30x36.png"/>
                    <h2 className="text-5xl mb-2">{user.first_name} {user.last_name}</h2>
                    <p>{user.email}</p>
                </div>
                    <hr className="border-t-2 border-gray-500 my-6"/>
                <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                        <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Car Name
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Evc
                        </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            Toyota Camry
                        </td>
                        </tr>
                        <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            Honda Civic
                        </td>
                        </tr>
                        <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            BMW 3 Series
                        </td>
                        </tr>
                    </tbody>
                </table>
                    <hr className="border-t-2 border-gray-500 my-6"/>
                <div className="password flex flex-col">
                    <h3 className="text-xl font-semibold">Change Password</h3>
                        <form className="flex flex-col space-y-5 items-start ml-6 mt-6" onSubmit={handlePasswordChange}>
                            <label block mb-4>
                            <span class="text-gray-700 font-bold mb-2 mr-3">Current Password</span>    
                                    <input
                                    type="password"
                                    className="border border-gray-300 rounded-sm py-1 px-2 text-gray-700"
                                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                    value={passwords.current}/>
                            </label>
                            <label block mb-4>
                            <span class="text-gray-700 font-bold mb-2 mr-3">New Password</span>    
                                <input
                                type="password"
                                className="border border-gray-300 rounded-sm py-1 px-2 text-gray-700"
                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                value={passwords.new}/>
                            </label>
                            <label block mb-4>
                            <span class="text-gray-700 font-bold mb-2 mr-3">Confirm Password</span>    
                                <input
                                type="password"
                                className="border border-gray-300 rounded-sm py-1 px-2 text-gray-700"
                                onChange={(e) => setPasswords({...passwords, repeat: e.target.value})}
                                value={passwords.repeat}/>
                            </label>
                            <button className="btn">Change Password</button>
                        </form>
                    
                </div>
                <hr className="border-t-2 border-gray-500 my-6"/>        
            </div>
        </div>
    );
}

export default Profile;