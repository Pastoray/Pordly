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
    quests: Quests
}

export type Info = {
    id: number,
    username: string 
}

export type Stats = {
    level: Level,
    title: Title,
    streak: number,
    gems: number,
    lives: number
}

export type Quests = {
    dailyQuests: DailyQuests[],
    storyQuests: StoryQuests[],
    achievements: Achievements[]
}


export type DailyQuests = {
    date: Date,
    difficulty: number,
    requirements: QuestRequirements
}

export type QuestRequirements = {
    accuracy: number,
    wpm: number,
    time: number
}

export type StoryQuests = {

}

export type Achievements = {

}

export type Level = {
    level_id: number,
    level: number,
    xp_required: number
    color: string,
}

export type Title = {
    title_id: number
    title: string,
    level_required: number,
    color: string,
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

export type ContextProviderProps = {
  children: React.ReactNode
}


