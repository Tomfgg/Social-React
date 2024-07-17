import { Link } from "react-router-dom"
export default function Error(){
    return (
        <div>
            <p>page not found</p>
            <Link to='/'>go home</Link>
        </div>
    )
}