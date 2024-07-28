import { useEffect, useState } from "react"
import ReactedUsers from "./ReactedUsers"
import './InnerReactsModal.css'

export default function InnerReactsModal({ id, symbol,setId,setSymbol }) {
    const [reacts, setReacts] = useState(null)

    useEffect(()=>{
        const fetchReacts = async () => {
            if(!id && !symbol) return null
            let reacts = await fetch(`https://social-app-f6f0.onrender.com/users/${symbol}/${id}`)
            reacts = await reacts.json()
            setReacts(reacts)
        }
        fetchReacts()
    }, [id,symbol])

    // const fetchReacts = async () => {
    //     let reacts = await fetch(`https://social-app-f6f0.onrender.com/users/${symbol}/${id}`)
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
            <div className="modal-overlay1" onClick={onClose}>
                <div className="modal-content1" onClick={e => e.stopPropagation()}>  
                    <button className="close-button1" onClick={onClose}>X</button>
                    <ReactedUsers reacts={reacts} />
                </div>
            </div>
        );
    }
}