import { Chapter } from "./chapter"

export interface Book {
    id: number
    title: string
    author: string
    chapters: Chapter[]
}