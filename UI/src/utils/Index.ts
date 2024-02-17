import fetchParagraph from "../data/fetchParagraph";
import { State, Ref, ParagraphData, LoginError, Achievement, QuestType, Users, User } from "../types/Index";

let Words = 0;

export function setGameOver(setGameFinished: State<boolean>, setInput: State<string>, inputRef: Ref<HTMLInputElement | null>) {
    inputRef.current!.readOnly = true;
    setGameFinished(true);
    setInput('');
}

export function restart(setLoading: State<boolean>, setBonus: State<number>, setWordIdx: State<number>, setParagraphData: State<ParagraphData | null>, setAccuracy: State<number>, setGameFinished: State<boolean>, inputRef: Ref<HTMLInputElement | null>) {
    inputRef.current!.readOnly = false;
    setLoading(true);

    setBonus(0);
    setWordIdx(100000);

    setAccuracy(0);
    setParagraphData((prevData) => ({ ...prevData!, paragraphIdx: -1 }));
    loadingEnded(setLoading, setGameFinished)
}

export function handleInput(event: React.KeyboardEvent<HTMLInputElement>, paragraphData: ParagraphData | null, input: string, setInput: State<string>, wordIdx: number, setWordIdx: State<number>, cooldown: number, setCooldown: State<number>, luckyIdx: number, setLuckyIdx: State<number>, setBonus: State<number>, setAccuracy: State<number>, setCorrectWords: State<number>) {
    if (event.key == 'Enter' || event.key == ' ') {
        if (Date.now() - cooldown > 50) {
            setCooldown(Date.now())
            checkWord(input, paragraphData!.words[wordIdx], paragraphData, wordIdx, luckyIdx, setLuckyIdx, setBonus, setAccuracy, setCorrectWords);
            setInput('');
            setWordIdx((idx) => idx + 1);
        }
    }
}

export function handleChange(event: React.ChangeEvent<HTMLInputElement>, setInput: State<string>) {
    if (!event.target.value.endsWith(" ")) {
        setInput(event.target.value)
    }
}

export async function initData(sentences: number, setParagraphData: State<ParagraphData | null>, setLuckyIdx: State<number>, setLoading: State<boolean>) {
    const data = await fetchParagraph(sentences);
    for (let paragraph of data) {   
        Words += paragraph.split(' ').length
    }
    setParagraphData({paragraphs: data,
                        words: data[0].split(' '),
                        classes: Array.from({ length: data[0].split(' ').length }, () => ''),
                        paragraphIdx: 0} as ParagraphData);

    setLuckyIdx(Math.floor(Math.random() * data[0].split(' ').length) - 1)
    setLoading(false);
}

export async function updateParagraph(paragraphData: ParagraphData | null, setParagraphData: State<ParagraphData | null>, wordIdx: number, setWordIdx: State<number>, setLuckyIdx: State<number>, setGameFinished: State<boolean>, inputRef: Ref<HTMLInputElement | null>) {
    if (paragraphData !== null && wordIdx >= paragraphData!.words.length) {
        if (paragraphData.paragraphIdx >= paragraphData.paragraphs.length - 1) {
            inputRef.current!.readOnly = true;
            setGameFinished(true);
            return;
        }
        inputRef.current!.readOnly = true;
        await new Promise(resolve => setTimeout(resolve, 500));
        inputRef.current!.readOnly = false;
        setLuckyIdx(Math.floor(Math.random() * paragraphData!.paragraphs[paragraphData!.paragraphIdx + 1].split(' ').length))
        setWordIdx(0);
        setParagraphData((prev) => ({ ...prev!,
            words: prev!.paragraphs[prev!.paragraphIdx + 1].split(' '),
            classes: Array.from({ length: prev!.paragraphs[prev!.paragraphIdx + 1].split(' ').length }, () => ''),
            paragraphIdx: prev!.paragraphIdx + 1
        } as ParagraphData))
    }
}

async function loadingEnded(setLoading: State<boolean>, setGameFinished: State<boolean>) {
    setTimeout(() => {
        setLoading(false);
        setGameFinished(false);
    }, 1000);
}

function checkWord(input: String, word: String, paragraphData: ParagraphData | null, wordIdx: number, luckyIdx: number, setLuckyIdx: State<number>, setBonus: State<number>, setAccuracy: State<number>, setCorrectWords: State<number>) {
    if (input === word) {
        if (wordIdx === luckyIdx) {
            setBonus(5);
            setLuckyIdx(-1);
        } else {
            setBonus(0);
        }
        paragraphData!.classes[wordIdx] = 'correct'
        setCorrectWords((words) => words + 1);
        setAccuracy((acc) => acc + parseFloat((100 / Words).toFixed(2))); 
    } else {
        if (wordIdx === luckyIdx) {
            setLuckyIdx(-1);
        }
        setBonus(0);
        paragraphData!.classes[wordIdx] = 'wrong'
        
    }
}

export async function getStoryQuests() {
        const user_id = await getUserId()
        const data = await fetch('http://127.0.0.1:8080//story-quests/fetch', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                user_id
            })
        })

        const response = await data.json()
        console.log(response)
        return response
}

export function setCookie(name: string, value: string, daysToExpire: number) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString() + ";";
    const cookie = name + "=" + value + ";" + expires + "path=/;" + "Secure;" + "SameSite=None";
    return cookie;
}

export async function checkForAccount(event: React.MouseEvent<HTMLInputElement>, emailErrorRef: Ref<HTMLParagraphElement | null>, passwordErrorRef: Ref<HTMLParagraphElement |null>, email: string, password: string) {
        event.preventDefault()
        const validEmail = validateEmail(email);
        if (!validEmail) {
            promptError(null, emailErrorRef, passwordErrorRef, {"emailError": "Invalid email"})
            return
        }
        const data = await fetch('http://127.0.0.1:8080/auth/load-user', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                email,
                password
            })
        })
        
        const response = await data.json()
        if (response.success) {
            const cookie = setCookie("accessToken", response.accessToken, 30);
            document.cookie = cookie;
            window.location.href = "/"
        } else {
            promptError(null, emailErrorRef, passwordErrorRef, response.error)
        }
}

export function promptError(usernameErrorRef: Ref<HTMLParagraphElement | null> | null, emailErrorRef: Ref<HTMLParagraphElement | null>, passwordErrorRef: Ref<HTMLParagraphElement | null>, error: LoginError) {
        if (usernameErrorRef) usernameErrorRef.current!.textContent = ""
        emailErrorRef.current!.textContent = ""
        passwordErrorRef.current!.textContent = ""
        if (usernameErrorRef && error.usernameError) usernameErrorRef.current!.textContent = "Error: " + error.usernameError
        if (error.emailError) emailErrorRef.current!.textContent = "Error: " + error.emailError
        if (error.passwordError) passwordErrorRef.current!.textContent = "Error: " + error.passwordError
}

export function validateEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

export async function validateToken(cookieValue: string) {
    const data = await fetch("http://127.0.0.1:8080/auth/validate-token", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cookieValue}`
        }
    })
    const response = await data.json()
    return response
    
}

export async function getUser() {
    const cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith("accessToken" + '=')) {
            const cookieValue = cookie.substring("accessToken".length + 1);
            const user: User | undefined = await validateToken(cookieValue);
            console.log(user)
            return user
        }
    }
    return null;
}

export async function getUserId() {
    const user: User | null | undefined = await getUser();
    const user_id = user?.info.id
    console.log(user_id)
    return user_id
}

export async function getDailyQuests() {
    const user_id = await getUserId()
    const data = await fetch("http://127.0.0.1:8080/daily-quests/fetch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id
        })
    })
    const response = await data.json()
    console.log(response)
    return response
}

export async function createAccount(event: React.MouseEvent<HTMLInputElement>, emailErrorRef: Ref<HTMLParagraphElement | null>, passwordErrorRef: Ref<HTMLParagraphElement | null>, usernameErrorRef: Ref<HTMLParagraphElement | null>, username: string, email: string, password: string) {
    event.preventDefault()
    const validEmail = validateEmail(email);
    if (!validEmail) {
        promptError(null, emailErrorRef, passwordErrorRef, {"emailError": "Invalid email"})
        return
    }
    
    const data = await fetch('http://127.0.0.1:8080/auth/create-user', {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            username,
            email,
            password 
        })
    })
    const response = await data.json();
    console.log(response);
    if (response.success) {
        window.location.href = "/login"
    } else {
        promptError(usernameErrorRef, emailErrorRef, passwordErrorRef, response.error)
    }
}

export async function check_quest(quest_id: number, quest_type: QuestType | undefined) {
    const user_id = await getUserId();
    const data = await fetch(`http://127.0.0.1:8080/${quest_type}/check`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id,
            quest_id
        })
    })
    const response = await data.json()
    return response
}

export async function decrement_lives() {
    const user_id = await getUserId();
    const data = await fetch(`http://127.0.0.1:8080/stats/lives`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id,
            "lives": -1
        })
    })
    const response = await data.json()
    return response

}

export async function fetchLeaderboardParticipants(type: string, setParticipants: React.Dispatch<React.SetStateAction<Users>>) {
    const data = await fetch(`http://127.0.0.1:8080/leaderboards/${type}`, {
        headers: {
            "Content-Type": "application/json",
        },
    })
    const response: Users = await data.json()
    setParticipants(response)
}

export async function get_achievements() {
    const user_id = await getUserId()
    const data = await fetch(`http://127.0.0.1:8080/achievements/fetch`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id
        })
    })
    const response: Achievement[] = await data.json()
    console.log(response)
    return response
}

export async function check_achievement(achievement_id: number) {
    const user_id = await getUserId();
    const data = await fetch(`http://127.0.0.1:8080/achievements/check`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id,
            achievement_id
        })
    })
    const response: Achievement[] = await data.json()
    console.log(response)
    return response
}

export async function fetchCalendar() {
    const user_id = await getUserId();
    const data = await fetch(`http://127.0.0.1:8080/daily-quests/this-month`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id
        })
    })
    const response = await data.json()
    console.log(response)

    return { daily_quests: response.user_daily_quests, days_this_month: response.days_this_month }
}
    
export function format_date(date: Date) {
    const completion_date = new Date(date);
    const formatted_date = `${completion_date.getFullYear()}-${(completion_date.getMonth() + 1).toString().padStart(2, '0')}-${completion_date.getDate().toString().padStart(2, '0')}`;
    return formatted_date
}

export async function buy_booster(booster_id: number) {
    const user_id = await getUserId()
    const data = await fetch("http://127.0.0.1:8080/boosters/buy", {
        method: "POST",
        headers: {
                "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id,
            booster_id
        })
    })

    const response = await data.json()
    return response
}

export async function fetch_boosters() {
    const user_id = await getUserId()
    const data = await fetch("http://127.0.0.1:8080/boosters/fetch", {
        method: "POST",
        headers: {
                "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id,
        })
    })

    const response = await data.json()
    return response
}

export async function activate_booster(booster_id: number) {
    const user_id = await getUserId()
    const data = await fetch("http://127.0.0.1:8080/boosters/activate", {
        method: "POST",
        headers: {
                "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id,
            booster_id
        })
    })

    const response = await data.json()
    return response
}

type OldCredentials = {
    email: string,
    password: string
}

type NewCredentials = {
    username: string
} & OldCredentials

export async function change_credentials(oldCredentials: OldCredentials, newCredentials: NewCredentials) {
    const user_id = await getUserId()
    const data = await fetch("http://127.0.0.1:8080/auth/change-credentials", {
        method: "POST",
        headers: {
                "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id,
            "email": oldCredentials.email,
            "password": oldCredentials.password,
            "new_username": newCredentials.username,
            "new_email": newCredentials.email,
            "new_password": newCredentials.password,
        })
    })

    const response = await data.json()
    console.log(response)
    return response
}

export async function delete_account(oldCredentials: OldCredentials) {
    const user_id = await getUserId()
    const data = await fetch("http://127.0.0.1:8080/auth/delete-account", {
        method: "DELETE",
        headers: {
                "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id,
            "email": oldCredentials.email,
            "password": oldCredentials.password,
        })
    })

    const response = await data.json()
    console.log(response)
    return response
}

export function validate_form(oldCredentials: OldCredentials, newCredentials: NewCredentials) {
    let error_message_1 = ""
    let error_message_2 = ""

    if (!oldCredentials.email || !newCredentials.email){
        error_message_1 = !oldCredentials.email ? "Invalid Email" : ""
        error_message_2 = !newCredentials.email ? "Invalid Email" : ""
    } else if (!oldCredentials.password || !newCredentials.password) {
        error_message_1 = !oldCredentials.password ? "Invalid Password" : ""
        error_message_2 = !newCredentials.password ? "Invalid Password" : ""
    } else if (!validateEmail(oldCredentials.email)) {
        error_message_1 = "Invalid Email"
        error_message_2 = ""
    } else if (!validateEmail(newCredentials.email)) {
        error_message_1 = ""
        error_message_2 = "invalid email"
    }
    return [error_message_1, error_message_2]
}

export function delete_access_token() {
    document.cookie = `accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export async function change_bio(bio: string) {
    const user_id = await getUserId()
    const data = await fetch("http://127.0.0.1:8080/auth/change-bio", {
        method: "POST",
        headers: {
                "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id,
            bio
        })
    })

    const response = await data.json()
    console.log(response)
    return response.success
}