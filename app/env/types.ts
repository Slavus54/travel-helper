export interface Cords {
    lat: number
    long: number
}

export interface TownType {
    title: string
    translation: string
    domain: string
    cords: Cords
}