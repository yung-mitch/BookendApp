export interface AudioStreamState {
    playing: boolean; // currently playing or not
    totalDuration: number | undefined; // total duration of content in milliseconds
    currentTime: number | undefined; // current time of content in milliseconds
    playable: boolean;
    error: boolean; // error present or not
    readableCurrentTime: string; // human readable current time
    readableTotalDuration: string; // human readable total duration of content
}