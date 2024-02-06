import { useEffect, useRef } from "react";
import { loadQuests } from "../../utils/Index";
import '../../styles/components/Layout.scss'

function Layout() {
    const QuestsContainer = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        loadQuests(QuestsContainer)
    }, [])
        
    return(
        <>
            <div className="layout-body-cotainer">
                <div className="layout-container">
                    <div className="layout-bar">
                        <div className="layout-bar-data">
                            <p>Difficulty: All</p>
                            <p>Finished Quests</p>
                            <p>Unfinished Quests</p>
                        </div>
                    </div>
                    <div className="layout-quests">
                        <div ref={QuestsContainer} id='level-section' className="level-section">
                        </div>
                    </div>
                    <div className="layout-bar">
                        <div className="layout-bar-data">
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Layout;