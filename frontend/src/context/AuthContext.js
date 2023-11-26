import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        case 'UPDATE_USER':
            const updatedUser = { ...state.user, ...action.payload };
            localStorage.setItem('user', JSON.stringify(updatedUser))
            return { user: updatedUser };
        default:
            return state;
    }
}


export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    console.log("AuthContext state: ", state);

    useEffect(() => {

        const user = JSON.parse(localStorage.getItem('user'))
        dispatch({ type: 'LOGIN', payload: user })
    }, [])
    
    const updateUser = (updatedUserInfo) => {
        dispatch({ type: 'UPDATE_USER', payload: updatedUserInfo });
    };

    return (
        <AuthContext.Provider value={{ ...state, dispatch, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}