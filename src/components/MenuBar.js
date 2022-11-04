import { useNavigate } from "react-router-dom"
import { useState } from "react"
import SearchBox from "./SearchBox"

export default function MenuBar(props){
    const [toSearch, setToSearch] = useState(false)
    const navigate = useNavigate()

    return (
        <div className="menuBar">
        <ul>
            <li onClick={()=> navigate("/homepage")}>Home</li>
            <li onClick={()=> setToSearch(true)}>Search</li>
            <li>Messages</li>
            <li>Notifications</li>
            <li onClick={props.handleNewPost||alert}>Create</li>
            <li onClick={()=> navigate("/profile")}>Profile</li>
            <li>More</li>
        </ul>
        {toSearch && <SearchBox/>}
    </div>
    )
}

//following functions are in homePage to handle menu items. Delete this once resolved
{/* <li onClick={handleCreateClick}>Create</li>
<li onClick={handleNavigationToProfile}>Profile</li> */}