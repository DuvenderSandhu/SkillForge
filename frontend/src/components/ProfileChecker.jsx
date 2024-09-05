import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Profile from "./Profile"
import TeacherProfile from "./Teacher/Profile"

function ProfileChecker(){
    const user= useSelector(state=>state.user)
    const navigate= useNavigate()
    return (
        user?user.role=='learner'?<Profile/>:<TeacherProfile/> :navigate('/user/login')
    )
}

export default ProfileChecker