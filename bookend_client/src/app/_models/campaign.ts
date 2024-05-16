import { Advertisement } from "./advertisement"

export interface Campaign {
    id: number
    title: string
    active: boolean
    budget: number
    insufficientFunds: boolean
    numPlays: number
    numClicks: number
    targetMinAge: number
    targetMaxAge: number
    targetEthnicities: string[]
    targetGenreInterests: string[]
    advertisement: Advertisement
}