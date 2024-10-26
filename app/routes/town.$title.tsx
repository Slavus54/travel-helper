import {useState, useEffect} from 'react'
import {useParams} from '@remix-run/react'
import {onGetStorageValue} from '../utils/storage'
import {TOWNS_API_KEY, WEATHER_API_KEY} from '~/env/env'
import {TownType} from '~/env/types'

const TownPage = () => {
    const {title} = useParams()

    const [town, setTown] = useState<TownType | null>(null)
    const [weather, setWeather] = useState<any>(null)

    useEffect(() => {
        let towns = onGetStorageValue(TOWNS_API_KEY)

        if (towns !== null) {
            let result = JSON.parse(towns).find((el: TownType) => el.title === title)

            if (result !== undefined) {
                setTown(result)
            }
        }
    }, [])

    useEffect(() => {
        if (town !== null) {
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${town.cords.lat}&lon=${town.cords.long}&appid=${WEATHER_API_KEY}`).then(data => data.json()).then(res => setWeather(res))
        }
    }, [town])

    return (
        <div className='flex justify-center flex-col text-center'>
            <h2 className='text-3xl'>{title}</h2>

            {town !== null && weather &&
                <div>
                    <h3 className='italic'>Weather Forecast</h3>

                    <div>
                        {weather.list.map((el: any) => 
                            <div className='flex justify-around flex-column m-1 max-w-sm p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'>
                                <b>{el.dt_txt}</b>
                                <p>Clouds: {el.clouds.all}%</p>
                                <small>Weather: {el.weather[0].main} ({parseInt(el.main.temp)}℉ | {el.wind.speed} m/s)</small>
                            </div>
                        )}
                    </div>
                </div>
            }
        </div>  
    ) 
}

export default TownPage