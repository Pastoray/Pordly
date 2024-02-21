export type State<T> = React.Dispatch<React.SetStateAction<T>>
export type Ref<T> = React.MutableRefObject<T>

export type QuestType = 'daily-quests' | 'story-quests'

export type ParagraphData = {
    paragraphs: string[],
    words: string[],
    classes: string[],
    paragraphIdx: number
}

export type User = {
    info: Info,
    stats: Stats,
}

export type Info = {
    user_id: number,
    username: string,
    bio: string
}

export type Stats = {
    level: Level,
    title: Title,
    streak: number,
    gems: number,
    lives: number,
    xp: number
}

export type DailyQuest = {
    daily_quest_id: number,
    title: string,
    difficulty: string,
    isComplete: boolean,
    paras: number,
    date: Date,
    requirements: QuestRequirements,
    reward: Rewards
}

export type StoryQuest = {
    story_quest_id: number,
    title: string,
    difficulty: string,
    isComplete: boolean,
    completion_date: Date,
    paras: number,
    requirements: QuestRequirements,
    reward: Rewards
}

export type Achievement = {
    achievement_id: number,
    title: string,
    description: string,
    difficulty: string,
    rewards: Rewards,
    isComplete: boolean,
    completion_date: Date
}

export type QuestRequirements = {
    accuracy: number,
    wpm: number,
    time: number
}

export type GameOverProps = {
    accuracy: number,
    wpm: number,
    time: number,
    reset: Function
}

export type Rewards = {
    xp: number
    gems: number
    lives: number
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

export type Booster = {
    id: number,
    title: string,
    description: string,
    color: string,
    category: string,
    multiplier: number,
    price: number,
}

export type UserBooster = {
    user_booster_id: number,
    title: string,
    description: string,
    color: string,
    category: string,
    multiplier: number,
    price: number,
    isActive: boolean,
    expiration_date: Date
}

export type GameStats = {
  accuracy: number,
  wpm: number
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
    text: string,
    accuracy: number
}

export type WpmProps = {
    text: string,
    wpm: number
}

export type LoginError = {
    usernameError?: string,
    emailError?: string,
    passwordError?: string
}

export type ContextProviderProps = {
  children: React.ReactNode
}

export type OldCredentials = {
    email: string,
    password: string
}

export type NewCredentials = {
    username: string
} & OldCredentials


