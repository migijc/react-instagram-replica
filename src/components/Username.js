import { useNavigate } from "react-router-dom"

export default function Username(props){
    const navigate=useNavigate()

    function handleClick(){
        navigate(`/${props.username}`)
    }
    return <p className={props.classString} onClick={handleClick} style={props.styleObj}> <b>{props.username}</b> {props.forComment} </p>
}