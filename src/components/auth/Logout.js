import {useEffect} from "react"
import { useAuth } from "../../shared/context/AuthContext"
import { USER_CURRENT } from "../../shared/constants/StorageKey"
import { useNavigate } from "react-router-dom"

export default function Logout() {
    const navigate = useNavigate()
    const {state, setState} = useAuth()
    useEffect(() => {
        localStorage.removeItem(USER_CURRENT)
        setState({...state, user: null, isAuthenticated: false})
        navigate("/login")
    }, [])
}