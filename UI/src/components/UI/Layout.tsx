import { useEffect, useRef } from "react";
import { loadMissions } from "../../utils/Index";
import '../../styles/components/Layout.scss'

function Layout() {
    const missionsContainer = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        loadMissions(missionsContainer)
    }, [])
        
    return(
        <div className="layout-container">
            <div className="layout-bar">
                <div className="layout-bar-data">
                
                </div>
                <div className="layout-bar-quests">
                </div>
            </div>
            <div className="layout-quests">
                <div ref={missionsContainer} id='level-section' className="level-section">
                </div>
            </div>
        </div>
    );
}

export default Layout;