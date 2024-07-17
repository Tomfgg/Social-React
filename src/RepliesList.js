import SingleReply from "./SingleReply"
export default function RepliesList({ replies, setId, setSymbol, setIsReplyFormVisible, setUser,setReplies  }) {
    const repliesSetter = (theReply => {
        const newReplies = replies.filter(reply => reply._id !== theReply._id)
        setReplies(newReplies)
    })
    return (
        <div>
            {replies.map(reply => (
                <div key={reply._id}>
                    <SingleReply repliesSetter={repliesSetter} setIsReplyFormVisible={setIsReplyFormVisible} setUser={setUser} replySent={reply} 
                    setId={setId} setSymbol={setSymbol} />
                </div>
            ))}
        </div>
    )
}