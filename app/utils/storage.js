import {TOWNS_API_KEY, TOWNS_API_URL} from '../env/env'

export const onGetStorageValue = (title, value = null) => window.localStorage.getItem(title) ?? value

export const onInitTowns = async () => {
    let towns = onGetStorageValue(TOWNS_API_KEY)
   
    if (towns === null) {   
        await fetch(TOWNS_API_URL).then(data => data.json()).then(result => {
            towns = JSON.stringify(result)
        })
    }

    localStorage.setItem(TOWNS_API_KEY, towns)

    return towns
}