import { useEffect, useState } from "react"

export default function UpdateProfilePic(props){
    const [selectedProfilePic, setSelectedProfilePic] = useState(null)

    useEffect(()=>{
        if(selectedProfilePic){
            props.setNewProfilePic(selectedProfilePic)
            props.handleProfilePicClick(false)
        }
    }, [selectedProfilePic])

    return (
        <div id="updatePicContainer">
            <p className="boxTitle">Change Profile Photo</p>
                <hr className="updatePicHR"/>
            <label className="labelForProfilePicUpload" htmlFor="profilePic">Upload Photo</label>
            <input type="file" id="profilePic" className="updateProfilePicAction updateProfileUpload" onChange={(e)=>setSelectedProfilePic(e.target.files[0])}/>
                <hr className="updatePicHR"/>
            <p className="updateProfilePicAction updateProfileRemove">Remove Current Photo</p>
                <hr className="updatePicHR"/>
            <p className="updateProfilePicAction" onClick={()=>props.handleProfilePicClick(false)}>Cancel</p>
        </div>
    )
}