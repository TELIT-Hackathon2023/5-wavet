import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFetch } from "../hooks/useFetch";
import { json } from "react-router-dom";


const Profile = () => {
    const {user, updateUser} = useAuthContext()
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        repeat: "",
    })
    const [car, setCar] = useState({
        name: "",
        evc: ""
    })
    const [names, setNames] = useState({
        firstName: "",
        lastName: ""
    })    
        
    const [isPending, setIsPending] = useState(false)
    const { data: fetchedCars } = useFetch(`/api/car/employee_id/${user.id}`);
    const [cars, setCars] = useState([]);

    useEffect(() => {
        if (fetchedCars) {
            setCars(fetchedCars);
        }
    }, [fetchedCars]);

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        if(passwords.new === passwords.repeat && passwords.current.length > 0 && passwords.new.length > 0){
            setIsPending(true)
            const response = await fetch(`${process.env.REACT_APP_PATH}/api/user/password`, {
                method: 'PATCH',
                body: JSON.stringify({id: user.id, password: passwords.new }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
        
                })
        
            const json = await response.json()
            if (response.ok) {
                setPasswords({
                    current: "",
                    new: "",
                    repeat: "",
                })
                setIsPending(false)
            } else {
                alert(json.error)
            }
        }else{
            alert("chybne vstupne udaje")
        }     
    } 
    
    const handleAddCar = async (e) => {
        e.preventDefault()
        if(!!car.name && !!car.evc){
            setIsPending(true)
            const response = await fetch(`${process.env.REACT_APP_PATH}/api/car`, {
                method: 'POST',
                body: JSON.stringify({employee_id: user.id, evc: car.evc, name: car.name}),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
                })
        
            const json = await response.json()
            if (response.ok) {
                cars.push(json.rows[0])
                setIsPending(false)
                setCar({
                    name: "",
                    evc: ""
                })
            } else {
                alert(json.error)
            }
        }else{
            alert("chybne vstupne udaje")
        }  
    }

    const handleDeleteCar = async (carId) => {
        const response = await fetch(`${process.env.REACT_APP_PATH}/api/car/id/${carId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            }
          });
          const json = await response.json();
          if (response.ok) {
            const updatedCars = cars.filter((car) => car.id !== carId);
            setCars(updatedCars);
        } else {
            alert(json.error)
        }
    }

    const handleUsernameChange = async (e) => {
        e.preventDefault()
        if(names.firstName.length > 0 && names.lastName.length > 0 ){
            setIsPending(true)
            const response = await fetch(`${process.env.REACT_APP_PATH}/api/user/update`, {
                method: 'PATCH',
                body: JSON.stringify({ id: user.id, first_name: names.firstName, last_name: names.lastName}),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
        
                })
        
            const json = await response.json()
            if (response.ok) {
                setNames({
                    firstName: "",
                    lastName: ""
                })
                const updatedUserInfo = {
                    first_name: names.firstName,
                    last_name: names.lastName
                };
    
                updateUser(updatedUserInfo);
                setIsPending(false)
            } else {
                console.log(json.error);
                // alert(json.error)
            }
        }else{
            alert("chybne vstupne udaje")
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
                    <h3 className="text-xl font-semibold">Your Cars</h3>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                            #
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Car Name
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Evc
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                            
                        </th>
                        </tr>                        
                    </thead>
                    {!!cars&&<tbody className="bg-white divide-y divide-gray-200">
                        {cars.map((car, i) => (
                            
                            <tr key={car.id}>
                            <td className="px-6 py-4 whitespace-nowrap w-1/12">
                                {i+1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {car.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {car.evc}
                            </td>
                            <td>
                                <button className="btn" onClick={() => handleDeleteCar(car.id)}>DELETE</button>
                            </td>
                            </tr>
                        ))}
                    </tbody>}
                </table>
                <form className="flex flex-row justify-between ml-6 mt-6" onSubmit={handleAddCar}>
                    <label>
                    <span className="text-gray-700 font-bold mb-2 mr-3 inline-block  whitespace-nowrap">Car name</span>    
                            <input
                            type="text"
                            className="border border-gray-300 rounded-sm py-1 px-2 text-gray-700"
                            onChange={(e) => setCar({...car, name: e.target.value})}
                            value={car.name}/> 
                    </label>
                    <label>
                    <span className="text-gray-700 font-bold mb-2 mr-3 inline-block w-8">Evc</span>    
                            <input
                            type="text"
                            className="border border-gray-300 rounded-sm py-1 px-2 text-gray-700"
                            onChange={(e) => setCar({...car, evc: e.target.value})}
                            value={car.evc}/> 
                    </label>
                    <button className="btn" disabled={isPending}>Add car</button>
                </form>
                    <hr className="border-t-2 border-gray-500 my-6"/>
                <div className="password flex flex-col">
                    <h3 className="text-xl font-semibold">Change Password</h3>
                        <form className="flex flex-col space-y-5 items-start ml-6 mt-6" onSubmit={handlePasswordChange}>
                            <label>
                            <span className="text-gray-700 font-bold mb-2 mr-3 inline-block w-52">Current Password</span>    
                                    <input
                                    type="password"
                                    className="border border-gray-300 rounded-sm py-1 px-2 text-gray-700"
                                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                    value={passwords.current}/> 
                            </label>
                            <label>
                            <span className="text-gray-700 font-bold mb-2 mr-3 inline-block w-52">New Password</span>    
                                <input
                                type="password"
                                className="border border-gray-300 rounded-sm py-1 px-2 text-gray-700"
                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                value={passwords.new}/>
                            </label>
                            <label>
                            <span className="text-gray-700 font-bold mb-2 mr-3 inline-block w-52">Confirm Password</span>    
                                <input
                                type="password"
                                className="border border-gray-300 rounded-sm py-1 px-2 text-gray-700"
                                onChange={(e) => setPasswords({...passwords, repeat: e.target.value})}
                                value={passwords.repeat}/>
                            </label>
                            <button className="btn"  disabled={isPending}>Change Password</button>
                        </form>
                    
                </div>
                <hr className="border-t-2 border-gray-500 my-6"/> 
                <div className="username flex flex-col">
                    <h3 className="text-xl font-semibold">Change Username</h3>
                        <form className="flex flex-col space-y-5 items-start ml-6 mt-6" onSubmit={handleUsernameChange}>
                            <label>
                            <span className="text-gray-700 font-bold mb-2 mr-3 inline-block w-52">New First Name</span>    
                                    <input
                                    type="text"
                                    className="border border-gray-300 rounded-sm py-1 px-2 text-gray-700"
                                    onChange={(e) => setNames({...names, firstName: e.target.value})}
                                    value={names.firstName}/> 
                            </label>
                            <label>
                            <span className="text-gray-700 font-bold mb-2 mr-3 inline-block w-52">New Last Name</span>    
                                    <input
                                    type="text"
                                    className="border border-gray-300 rounded-sm py-1 px-2 text-gray-700"
                                    onChange={(e) => setNames({...names, lastName: e.target.value})}
                                    value={names.lastName}/> 
                            </label>                           
                            <button className="btn" disabled={isPending}>Change Name</button>
                        </form>
                    
                </div>       
            </div>
        </div>
    );
}

export default Profile;