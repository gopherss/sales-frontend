import { FC, JSX } from "react"
import { NavLink } from "react-router-dom"

const NotFound: FC = (): JSX.Element => {
    return (
        <div className="text-center relative z-10">
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 animate-pulse">
                404
            </h1>

            <p className="text-2xl mt-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Página no encontrada
            </p>
            <p className="text-2xl mt-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Lo sentimos, la página que estás buscando no existe.
            </p>

            <div className="mt-8 mx-auto w-64 h-64 md:w-96 md:h-96 relative">
                <img
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/404/404-computer.svg"
                    alt="Imagen de Pexels"
                    className="w-full h-full rounded-lg shadow-2xl"
                />
            </div>
            <NavLink
                to={"/"}
                className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-500 transform hover:scale-110 shadow-[0_0_10px_2px_rgba(165,180,252,0.6)] hover:shadow-[0_0_20px_5px_rgba(34,211,238,0.6)]"
            >
                Volver al inicio
            </NavLink>
        </div>
    )
}
export default NotFound
