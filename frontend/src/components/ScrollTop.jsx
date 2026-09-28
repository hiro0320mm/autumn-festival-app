import { useEffect, useState } from "react"
import { smoothScroll } from "../utils/smoothScroll"
import { MoveUp } from "lucide-react";

function ScrollTop() {

    const[isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const threshold = window.innerHeight * 0.01;
            setIsVisible(window.scrollY > threshold);
        }
        window.addEventListener("scroll", handleScroll)

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    },[])

    return (
        <button
            type="button"
            onClick={() => smoothScroll("scrollTop")}
            className={`scroll-top ${isVisible ? "is-visible" : ""}`}
        >
            <MoveUp size={18} />
        </button>
    )
}

export default ScrollTop