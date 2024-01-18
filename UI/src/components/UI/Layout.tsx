import { useEffect } from "react";
import loadLevels from "../../utils/loadLevels";
import '../../styles/components/Layout.scss'

function Layout() {
    useEffect(() => {
        loadLevels()
    }, [])

    return(
        <div className="layout-container">
            <div className="layout-bar">
                <div className="layout-bar-data">
                    <p>Difficulty</p>
                    <p>Paragraphs</p>
                    <p>Sentences</p>
                </div>
                <div className="layout-bar-levels">
                    <p>Title levels</p>
                    <p>Select random</p>
                </div>
            </div>
            <div className="layout-levels">
                <div id='level-section'className="level-section">
                </div>
            </div>
        </div>
    );
}

export default Layout;