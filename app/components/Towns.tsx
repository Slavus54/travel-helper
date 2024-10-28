import {useState, useMemo, useLayoutEffect} from "react"
import {Link} from "@remix-run/react"
//@ts-ignore
import {Codus} from 'codus.js'
import {PITCH_LIMIT, RANGE_LIMIT, DEFAULT_RANGE_VALUE, DEFAULT_RANGE_STEP, SEARCH_PERCENT} from '~/env/env'
import {TownType} from "~/env/types"

const Towns = ({towns = []}) => {
    const [list, setList] = useState<any[]>([])
    const [distance, setDistance] = useState<number>(0)
    const [pitch, setPitch] = useState<number>(DEFAULT_RANGE_VALUE)
    const [range, setRange] = useState<number>(DEFAULT_RANGE_VALUE)
    const [filtered, setFiltered] = useState<TownType[]>(towns)
    const [voices, setVoices] = useState<any>([])
    const [voice, setVoice] = useState<any>(null)
    const [text, setText] = useState<string>('')
    const [title, setTitle] = useState<string>('')

    const codus = new Codus()
    
    let synth = window.speechSynthesis

    useLayoutEffect(() => {
        if ('onvoiceschanged' in synth) {
            synth.onvoiceschanged = loadVoices
        } else {
            loadVoices()
        }

        synth.onvoiceschanged = loadVoices

        if (voices.length !== 0) {
            setVoice(voices[0])
        }
    }, [])

    useMemo(() => {
        let result: TownType[] = towns
        
        if (title.length !== 0) {
            result = result.filter((el: TownType) => codus.search(el.title, title, SEARCH_PERCENT))            
        } 

        setFiltered(result)
    }, [title])

    function loadVoices() {
        setVoices(synth.getVoices())  
    }   

    const onListen = () => {
        let instance = new SpeechSynthesisUtterance(text)
    
        instance.pitch = codus.percent(pitch, PITCH_LIMIT, 0) 
        instance.rate = codus.percent(range, RANGE_LIMIT, 0) 
        instance.voice = voice

        synth.speak(instance)
    }

    const onAddTown = (town: TownType) => {
        let latest = Boolean(list.length) ? list[list.length - 1] : town
        let distanceFromPrevious = 0

        if (town.title !== latest.title) {
            let result: number = codus.haversine(latest.cords.lat, latest.cords.long, town.cords.lat, town.cords.long)
        
            result = Math.floor(result) 

            if (Boolean(list.length)) {
                distanceFromPrevious = result
            }

            setDistance(distance + result)
        }

        setList([...list, {...town, distanceFromPrevious}])
    }   

    return (
        <>
            <h2 className="text-lg my-5 font-medium">Pronounce the text</h2>

            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Text..." className="w-1/4 h-30 block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

            <span className="text-base font-thin">Pitch: <b className="font-bold">{pitch}</b></span>

            <input value={pitch} onChange={e => setPitch(parseInt(e.target.value))} type="range" step={DEFAULT_RANGE_STEP} />

            <span className="text-base font-thin">Range: <b className="font-bold">{range}</b></span>

            <input value={range} onChange={e => setRange(parseInt(e.target.value))} type="range" step={DEFAULT_RANGE_STEP} />

            <select onChange={e => setVoice(voices[e.target.value])} className="m-5">
                {voices.map((el: any, idx: number) => <option value={idx}>{el.name} ({el.lang})</option>)}
            </select>

            <button onClick={onListen} className="py-2 px-5 font-medium rounded-md bg-black text-white">Listen</button>

            <h2 className="text-lg my-5 font-medium">Build own route</h2>

            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title of region" className="w-1/5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

            <p>Distance: <b>{distance}</b> km</p>

            <div className="flex justify-around flex-row flex-wrap">
                {filtered.map((el: TownType) => 
                    <div className="flex justify-around flex-column m-1 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <Link to={`/town/${el.title}`}>{el.title}</Link>
                        <button onClick={() => onAddTown(el)}>+</button>
                    </div>
                )}
            </div>
        </>
        
    )
}

export default Towns