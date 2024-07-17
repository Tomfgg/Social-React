import { useEffect, useState } from "react"
import ReactedUsers from "./ReactedUsers"

export default function InnerReactsModal({ id, symbol,setId,setSymbol }) {
    const [reacts, setReacts] = useState(null)

    useEffect(()=>{
        const fetchReacts = async () => {
            if(!id && !symbol) return null
            let reacts = await fetch(`http://127.0.0.1:5000/users/${symbol}/${id}`)
            reacts = await reacts.json()
            setReacts(reacts)
        }
        fetchReacts()
    }, [id,symbol])

    // const fetchReacts = async () => {
    //     let reacts = await fetch(`http://127.0.0.1:5000/users/${symbol}/${id}`)
    //     reacts = await reacts.json()
    //     setReacts(reacts)
    // }
    const onClose = ()=>{
        setId(null)
        setSymbol(null)
    }

    if (!id) return null

    else {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <button className="close-button" onClick={onClose}>X</button>
                    <ReactedUsers reacts={reacts} />
                </div>
            </div>
        );
    }
}