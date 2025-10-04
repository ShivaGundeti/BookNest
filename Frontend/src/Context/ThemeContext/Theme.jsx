import { useEffect, useState } from "react"
import { Theme } from "./ThemeContext"

export const ThemeProvider = ({children}) => {
    const getTheme = localStorage.getItem('Theme')
        const [SwitchTheme, setSwitchTheme] = useState( getTheme || "light")

        useEffect(()=>{
            localStorage.setItem("Theme",SwitchTheme)
            document.body.className = SwitchTheme
        },[SwitchTheme])

        const handleTheme = ()=>{
            setSwitchTheme((prev) => (prev === "light" ? "dark" : "light"))
        }
return(
        <Theme.Provider value={{SwitchTheme,handleTheme}}>
            {children}
        </Theme.Provider>
)
}