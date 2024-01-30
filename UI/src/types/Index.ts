export type State<T> = React.Dispatch<React.SetStateAction<T>>
export type Ref<T> = React.MutableRefObject<T>

export type QuestType = 'daily' | 'story'

export type ParagraphData = {
    paragraphs: string[],
    words: string[],
    classes: string[],
    paragraphIdx: number
}

export type User = {
    info: Info,
    stats: Stats,
    missions: Missions
}

export type Info = {
    id: number,
    username: string 
}

export type Stats = {
    level: number,
    title: string,
    streak: number,
    gems: number,
    lives: number
}

export type Missions = {
    dailyMissions: boolean[],
    storyMissions: boolean[],
    quests: boolean[],
    achievements: boolean[]
}

export type Requirements = {
    wpm: number,
    accuracy: number,
    time: number
}

export type GameProps = {
    questType: QuestType,
    mission: number,
    sentences: number,
    timer: boolean,
    reqTime: number | undefined
    reqWpm: number,
    reqAccuracy: number
}

export type LoadQuestProps = {
    questType: QuestType,
} 


export type TimerProps = {
    time: number
}

export type AccuracyProps = {
    accuracy: number
}

export type WpmProps = {
    wpm: number,
}

export type LoginError = {
    usernameError?: string,
    emailError?: string,
    passwordError?: string
}