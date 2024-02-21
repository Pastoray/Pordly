import fetch_paragraph from "../data/fetch_paragraph";
import { State, Ref, ParagraphData, LoginError, Achievement, QuestType, User, OldCredentials, NewCredentials } from "../types/Index";

let Words = 0;
let lastTimeExecuted = 0;

export function set_game_over(setGameFinished: State<boolean>, setInput: State<string>, inputRef: Ref<HTMLInputElement | null>) {
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
    end_loading(setLoading, setGameFinished)
}

export function handle_input(event: React.KeyboardEvent<HTMLInputElement>, paragraphData: ParagraphData | null, input: string, setInput: State<string>, wordIdx: number, setWordIdx: State<number>, cooldown: number, setCooldown: State<number>, luckyIdx: number, setLuckyIdx: State<number>, setBonus: State<number>, setAccuracy: State<number>, setCorrectWords: State<number>) {
    if (event.key == 'Enter' || event.key == ' ') {
        if (Date.now() - cooldown > 50) {
            setCooldown(Date.now())
            check_word(input, paragraphData!.words[wordIdx], paragraphData, wordIdx, luckyIdx, setLuckyIdx, setBonus, setAccuracy, setCorrectWords);
            setInput('');
            setWordIdx((idx) => idx + 1);
        }
    }
}

export function handle_word(event: React.ChangeEvent<HTMLInputElement>, setInput: State<string>) {
    if (!event.target.value.endsWith(" ")) {
        setInput(event.target.value)
    }
}

export async function initialize_paragraph_data(sentences: number, setParagraphData: State<ParagraphData | null>, setLuckyIdx: State<number>, setLoading: State<boolean>) {
    const data = await fetch_paragraph(sentences);
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

export async function update_paragraph(paragraphData: ParagraphData | null, setParagraphData: State<ParagraphData | null>, wordIdx: number, setWordIdx: State<number>, setLuckyIdx: State<number>, setGameFinished: State<boolean>, inputRef: Ref<HTMLInputElement | null>) {
    if (Date.now() - lastTimeExecuted < 500) {
        return;
    }
    lastTimeExecuted = Date.now()

    inputRef.current!.readOnly = true;
    if (paragraphData !== null && wordIdx >= paragraphData!.words.length) {
        if (paragraphData.paragraphIdx >= paragraphData.paragraphs.length - 1) {
            setGameFinished(true);
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        setLuckyIdx(Math.floor(Math.random() * paragraphData!.paragraphs[paragraphData!.paragraphIdx + 1].split(' ').length))
        setWordIdx(0);
        setParagraphData((prev) => ({ ...prev!,
            words: prev!.paragraphs[prev!.paragraphIdx + 1].split(' '),
            classes: Array.from({ length: prev!.paragraphs[prev!.paragraphIdx + 1].split(' ').length }, () => ''),
            paragraphIdx: prev!.paragraphIdx + 1
        } as ParagraphData))
    }
    inputRef.current!.readOnly = false;
}

async function end_loading(setLoading: State<boolean>, setGameFinished: State<boolean>) {
    setTimeout(() => {
        setLoading(false);
        setGameFinished(false);
    }, 1000);
}

function check_word(input: String, word: String, paragraphData: ParagraphData | null, wordIdx: number, luckyIdx: number, setLuckyIdx: State<number>, setBonus: State<number>, setAccuracy: State<number>, setCorrectWords: State<number>) {
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

export async function get_story_quests() {
        const user_id = await get_user_id()
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
        return response
}

export function set_cookie(name: string, value: string, daysToExpire: number) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString() + ";";
    const cookie = name + "=" + value + ";" + expires + "path=/;" + "Secure;" + "SameSite=None";
    return cookie;
}

export async function fetch_account(event: React.MouseEvent<HTMLInputElement>, emailErrorRef: Ref<HTMLParagraphElement | null>, passwordErrorRef: Ref<HTMLParagraphElement |null>, email: string, password: string) {
        event.preventDefault()
        const validEmail = validate_email(email);
        if (!validEmail) {
            prompt_error(null, emailErrorRef, passwordErrorRef, {"emailError": "Invalid email"})
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
            const cookie = set_cookie("accessToken", response.accessToken, 30);
            document.cookie = cookie;
            window.location.href = "/"
        } else {
            prompt_error(null, emailErrorRef, passwordErrorRef, response.error)
        }
}

export function prompt_error(usernameErrorRef: Ref<HTMLParagraphElement | null> | null, emailErrorRef: Ref<HTMLParagraphElement | null>, passwordErrorRef: Ref<HTMLParagraphElement | null>, error: LoginError) {
        if (usernameErrorRef) usernameErrorRef.current!.textContent = ""
        emailErrorRef.current!.textContent = ""
        passwordErrorRef.current!.textContent = ""
        if (usernameErrorRef && error.usernameError) usernameErrorRef.current!.textContent = "Error: " + error.usernameError
        if (error.emailError) emailErrorRef.current!.textContent = "Error: " + error.emailError
        if (error.passwordError) passwordErrorRef.current!.textContent = "Error: " + error.passwordError
}

export function validate_email(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

export async function validate_token(cookieValue: string) {
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

export async function get_user() {
    const cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith("accessToken" + '=')) {
            const cookieValue = cookie.substring("accessToken".length + 1);
            const user: User | undefined = await validate_token(cookieValue);
            return user
        }
    }
    return undefined;
}

export async function get_user_by_id(id: number) {
    const data = await fetch(`http://127.0.0.1:8080/auth/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "user_id": id
        })
    })
    const response = await data.json()
    return {
        user: response.user,
        story_quests_complete: response.story_quests_complete,
        daily_quests_complete: response.daily_quests_complete,
        achievements_complete: response.achievements_complete
    }
}


export async function get_user_id() {
    const user: User | null | undefined = await get_user();
    const user_id = user?.info.user_id
    return user_id
}

export async function get_daily_quests() {
    const user_id = await get_user_id()
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
    return response
}

export async function create_account(event: React.MouseEvent<HTMLInputElement>, emailErrorRef: Ref<HTMLParagraphElement | null>, passwordErrorRef: Ref<HTMLParagraphElement | null>, usernameErrorRef: Ref<HTMLParagraphElement | null>, username: string, email: string, password: string) {
    event.preventDefault()
    const validEmail = validate_email(email);
    if (!validEmail) {
        prompt_error(null, emailErrorRef, passwordErrorRef, {"emailError": "Invalid email"})
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
        prompt_error(usernameErrorRef, emailErrorRef, passwordErrorRef, response.error)
    }
}

export async function check_quest(quest_id: number, quest_type: QuestType | undefined) {
    const user_id = await get_user_id();
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
    const user_id = await get_user_id();
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

export async function fetch_leaderboard_participants(type: string) {
    const data = await fetch(`http://127.0.0.1:8080/leaderboards/${type}`, {
        headers: {
            "Content-Type": "application/json",
        },
    })
    const response: User[] = await data.json()
    return response
}

export async function get_achievements() {
    const user_id = await get_user_id()
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
    return response
}

export async function check_achievement(achievement_id: number) {
    const user_id = await get_user_id();
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
    return response
}

export async function fetch_calendar() {
    const user_id = await get_user_id();
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

    return { daily_quests: response.user_daily_quests, days_this_month: response.days_this_month }
}
    
export function format_date(date: Date) {
    const completion_date = new Date(date);
    const formatted_date = `${completion_date.getFullYear()}-${(completion_date.getMonth() + 1).toString().padStart(2, '0')}-${completion_date.getDate().toString().padStart(2, '0')}`;
    return formatted_date
}

export async function buy_booster(booster_id: number) {
    const user_id = await get_user_id()
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

export async function fetch_user_boosters() {
    const user_id = await get_user_id()
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

export async function fetch_boosters() {
    const data = await fetch("http://127.0.0.1:8080/all/boosters", {
        method: "POST",
        headers: {
                "Content-Type": "application/json",
        }
    })

    const response = await data.json()
    return response.entries
}

export async function activate_booster(booster_id: number) {
    const user_id = await get_user_id()
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

export async function change_credentials(oldCredentials: OldCredentials, newCredentials: NewCredentials) {
    const user_id = await get_user_id()
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
    return response
}

export async function delete_account(oldCredentials: OldCredentials) {
    const user_id = await get_user_id()
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
    } else if (!validate_email(oldCredentials.email)) {
        error_message_1 = "Invalid Email"
        error_message_2 = ""
    } else if (!validate_email(newCredentials.email)) {
        error_message_1 = ""
        error_message_2 = "invalid email"
    }
    return [error_message_1, error_message_2]
}

export function delete_access_token() {
    document.cookie = `accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export async function change_bio(bio: string) {
    const user_id = await get_user_id()
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
    return response.success
}
