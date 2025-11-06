import { Link } from "react-router-dom";

const PageNotFound = () => {
    return (
        <div>
            <h1>404 Página no encontrada</h1>
            <Link to="/">
                <button>Volver al inicio</button>
            </Link>
        </div>
    );
};

export default PageNotFound;