import AddComment from "./AddComment"
import PostInteractions from "./PostInteractions"

export default function OpenedPost(props){
    let postToOpen=props.postToOpen
    let docRef=postToOpen.docRef
    let postSnapshot=postToOpen.postSnapshot
    let postCollection= postToOpen.postCollection
    let currentUsername=postToOpen.currentUser
    let postID= postToOpen.postID


    return (
        <div id="openedPost">
            <div id="imageContainer">
                <img src={postSnapshot.postDetails[1]} alt="Opened Post Pic"/>
            </div>

            <div id="openedPostInteractions">
                <div id="openedPostHeader">
                    <div className="mockPic"/>
                    <p className="opUsernameInOpenedPost">{postSnapshot.postDetails[3]}</p>
                    <p>...</p>
                </div>
                <hr className="postHeaderHR"/>
                <div id="opPostInfo">
                    <div className="profilePicInOpenedPost">
                        <div className="mockPic"/>
                    </div>
                    <div id="captionInOpenedPost">
                        <p className="opUsernameInOpenedPost">{postSnapshot.postDetails[3]}</p>
                        <p id="theCaption">{postSnapshot.postDetails[2]}</p>
                        <p className="timePostedAgoInOpenedPost">3h</p>
                    </div>
                </div>
                <div className="commentsContainerInOpenedPost">
                    {props.comments.map(comment=>{
                        return (
                            <Comment 
                                commentOpUsername={comment.details[0]} 
                                comment={comment.details[1]}
                            />
                        )
                    })}
                </div>
                <div className="interactWithOpenedPost">
                    <hr className="hrForInteractContainer"/>
                    <PostInteractions class="commentAndLike inOpenedPost" docRef={docRef} postSnapshot={postSnapshot}/>
                    <p className="openedPostLikes">{postSnapshot.likedBy.length} likes</p>
                    <p className="timePostedAgoInOpenedPost">3h</p>
                    <hr className="hrForComment"/>
                    <AddComment collectionRef={postCollection} postID={postID} currentUsername={currentUsername}/>
                </div>

            </div>
        </div>
    )
}

function Comment(props){

    return (
        <div className="aCommentInOpenedPost">
            <div className="commentContent">
                <div className="mockPic commentMockPic"/>
                <p className="commentInOpenedPostOP usernameInOpenedPost" >{props.commentOpUsername}</p>
                <p className="aCommentInOpenedPost">{props.comment}</p>
            </div>

          <p className="timePostedAgoInOpenedPost inComment">3h</p>

        </div>
    )
}