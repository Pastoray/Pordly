import fetchParagraph from "../data/fetchParagraph";
import { State, Ref, ParagraphData, LoginError } from "../types/Index";


let Words = 0;

export function GameOver(setGameOver: State<boolean>, setInput: State<string>, inputRef: Ref<HTMLInputElement | null>) {
    inputRef.current!.readOnly = true;
    setGameOver(true);
    setInput('');
}

export function restart(setLoading: State<boolean>, setBonus: State<number>, setWordIdx: State<number>, setParagraphData: State<ParagraphData | null>, setGameOver: State<boolean>, setAccuracy: State<number>, setGameFinished: State<boolean>, inputRef: Ref<HTMLInputElement | null>) {
    inputRef.current!.readOnly = false;
    setGameFinished(false);
    setLoading(true);

    setBonus(0);
    setWordIdx(100000);

    setAccuracy(0);
    setParagraphData((prevData) => ({ ...prevData!, paragraphIdx: -1 }));
    loadingEnded(setLoading, setGameOver)
}

export function handleInput(event: React.ChangeEvent<HTMLInputElement>, paragraphData: ParagraphData | null, input: string, setInput: State<string>, wordIdx: number, setWordIdx: State<number>, cooldown: number, setCooldown: State<number>, luckyIdx: number, setLuckyIdx: State<number>, setBonus: State<number>, setAccuracy: State<number>, setCorrectWords: State<number>) {
    if (event.target.value.endsWith(' ')) {
        if (Date.now() - cooldown > 50) {
            setCooldown(Date.now())
            checkWord(input, paragraphData!.words[wordIdx], paragraphData, wordIdx, luckyIdx, setLuckyIdx, setBonus, setAccuracy, setCorrectWords);
            setInput('');
            setWordIdx((idx) => idx + 1);
        }
    } else {
        setInput(event.target.value);
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
                        paragraphIdx: 1} as ParagraphData);

    setLuckyIdx(Math.floor(Math.random() * data[0].split(' ').length) - 1)
    setLoading(false);
}

export async function updateParagraph(paragraphData: ParagraphData | null, setParagraphData: State<ParagraphData | null>, wordIdx: number, setWordIdx: State<number>, setLuckyIdx: State<number>, setGameFinished: State<boolean>, inputRef: Ref<HTMLInputElement | null>) {
    if (paragraphData !== null && wordIdx >= paragraphData!.words.length) {
        if (paragraphData.paragraphIdx === paragraphData.paragraphs.length - 1) {
            inputRef.current!.readOnly = true;
            setGameFinished(true);
            return;
        }
        inputRef.current!.readOnly = true;
        await new Promise(resolve => setTimeout(resolve, 1000));
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

async function loadingEnded(setLoading: State<boolean>, setGameOver: State<boolean>) {
    setTimeout(() => {
        setLoading(false);
        setGameOver(false);
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

export function loadMissions(Container: Ref<HTMLDivElement | null>) {
    for (let i = 1; i <= 50; i++) {
        const MissionContainer = document.createElement('div');

        const MissionNumber = document.createElement('p');
        const MissionReward = document.createElement('p');

        MissionNumber.className = 'quest-number';
        MissionNumber.textContent = `Quest ${i}`;
        
        MissionReward.className = 'quest-reward';
        MissionReward.textContent = `${i * 5}💎`;
        
        MissionContainer.className = 'quest'
        
        MissionContainer.appendChild(MissionNumber)
        MissionContainer.appendChild(MissionReward)


        MissionContainer.addEventListener('click', () => {
            window.location.href = `/quests/${i}`;
        })
        Container.current!.appendChild(MissionContainer);
    }
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
        const data = await fetch('http://127.0.0.1:8080/auth/load_user', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ email, password })
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
    const data = await fetch("http://127.0.0.1:8080/auth/validate_token", {
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
            const user = await validateToken(cookieValue);
            console.log(user)
            return user
        }
    }
    return null;
}

export async function getUserId() {
    const user = await getUser();
    const user_id = user.info.id
    console.log(user_id)
    return user_id
}

export async function getDailyQuests() {
    const user_id = await getUserId()
    const data = await fetch("http://127.0.0.1:8080/daily_quests/fetch", {
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
    
    const data = await fetch('http://127.0.0.1:8080/auth/create_user', {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
    })
    const response = await data.json();
    console.log(response);
    if (response.success) {
        window.location.href = "/login"
    } else {
        promptError(usernameErrorRef, emailErrorRef, passwordErrorRef, response.error)
    }
}
