export type State<T> = React.Dispatch<React.SetStateAction<T>>
export type Ref<T> = React.MutableRefObject<T>

export type QuestType = 'daily-quest' | 'story-quest'

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


export type DailyQuests = DailyQuest[]

export type DailyQuest = {
    daily_quest_id: number,
    title: string,
    difficulty: string,
    isComplete: boolean,
    date: Date,
    requirements: QuestRequirements,
    reward: QuestRewards
}

export type QuestRequirements = {
    accuracy: number,
    wpm: number,
    time: number
}

export type QuestRewards = {
    xp: number
    gems: number
    lives: number
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
    quest_type: QuestType | undefined,
    quest_id: number,
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


