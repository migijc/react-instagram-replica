import {useEffect, useState} from "react"
import { firestore } from "./FirebaseConfig"
import {getDocs, collection} from "firebase/firestore"
import { useNavigate } from "react-router-dom"



export default function SearchBox(){
    const [searchValue, setSearchValue] = useState(null)
    const [possibleResults, setPossibleResults] = useState(null)
    let usersCollection= collection(firestore, "users")


    function handleSearchState(e){
        setSearchValue(e.target.value)
    }

    //caution: Search results may get out of hand since its returning all matching requests not only some
    //maybe need to find way to query only 10-15 rather than all matching results.


    useEffect(()=>{
        if(searchValue===""){
            setSearchValue(null)
        }
    })

    useEffect(()=>{
        if(searchValue===null){
            setPossibleResults(null)
        }
    })

    useEffect(()=>{
        if(searchValue){
            (async function getResults(){
                if(searchValue){
                    let possibleItems=[]
                    let docsData= await getDocs(usersCollection)
                    docsData.forEach(doc=>{
                        possibleItems.push(doc.data())
                        possibleItems[possibleItems.length-1].uid=doc.id
                    })
                    possibleItems=possibleItems.filter(item=>{
                        if(item.username.includes(searchValue)){
                            return item
                        }
                    })
                    setPossibleResults(possibleItems)
                }
            }())
        }

    }, [searchValue])


    return (
        <div id="searchBox">
            <div className="searchDiv">
                <h3>Search</h3>
                <input onChange={handleSearchState} type="text" placeholder="Search"></input>
            </div>

            <div className="searchValuesDiv">
                {searchValue=== null && <h4>Recent</h4>}
                {possibleResults !==null && possibleResults.map(result=>{
                     return <UserFromSearch username={result.username} fullName={result.fullName} key={result.uid}/>
                })}
            </div>

        </div>
    )
}

function UserFromSearch(props){
const navigate= useNavigate()

    return (
    <div className="aSearchReturn" onClick={()=>navigate(`/${props.username}`)}>
            <div className="profilePicInSearch"/>
            <div>
                <p style={{fontWeight:"900"}}>{props.username}</p>
                <p>{props.fullName}</p>
            </div>
        </div>
    )
}