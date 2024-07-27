import { Link } from "react-router-dom"
import './Error.css';   
export default function Error(){
    return (
        <div className="error-page">
            <div className="error-content">
                <h1 className="error-title">404</h1>
                <p className="error-message">Page not found</p>
                <Link to="/" className="error-link">Go Home</Link>
            </div>
        </div>
    )
}