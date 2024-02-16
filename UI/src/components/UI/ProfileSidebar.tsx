import '../../styles/components/ProfileSidebar.scss'
import { State } from '../../types/Index'

function ProfileSidebar({ setCategory }: { setCategory: State<number> }) {
    return (
        <>
            <div className="profile-sidebar-container">
                <button onClick={() => setCategory(1)}>Profile</button>
                <button onClick={() => setCategory(2)}>Boosters</button>
                <button onClick={() => setCategory(3)}>Account</button>
            </div>
        </>
    )
}

export default ProfileSidebar