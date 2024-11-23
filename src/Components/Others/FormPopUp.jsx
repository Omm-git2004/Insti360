import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useLoadingContext } from "../../Context_API/LoadingContext"
import { faCheck, faClose, faSpinner } from "@fortawesome/free-solid-svg-icons"

export default ({ children, onClose, onSubmit, formElems }) => {
    const { isloading } = useLoadingContext()
    return (
        <div className="popup-wrapper">
            <div className="popup-overlay" onClick={() => !isloading && onClose()}></div>
            <div className="popup-content">
                <form onSubmit={onSubmit}>
                    {
                        formElems.map(({ label, onChange, name, type, placeholder, defaultValue, disabled }, index) => (
                            <div key={`${index}${name}`}>
                                <label htmlFor={name}>{label}</label>
                                <input type={type} name={name} id={name} defaultValue={defaultValue} placeholder={placeholder} onChange={onChange} disabled={disabled || isloading} />
                            </div>
                        ))
                    }
                    {
                        children
                    }
                    <div className="btn-container">
                        <button className="save-btn form-popup-btn" disabled={isloading} >
                            <FontAwesomeIcon icon={isloading ? faSpinner : faCheck} spin={isloading} />
                            {isloading ? " Submitting..." : " Submit"}
                        </button>
                        <button type="button" className="cancel-btn form-popup-btn" onClick={onClose} disabled={isloading} >
                            <FontAwesomeIcon icon={faClose} /> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}