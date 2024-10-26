import {useState, useEffect, useLayoutEffect} from "react"
import {MetaFunction, json} from "@remix-run/node"
import {onGetStorageValue, onInitTowns} from '../utils/storage'
import Towns from "~/components/Towns"
import {TOWNS_API_KEY} from "~/env/env"
import {TownType} from "~/env/types"

export const meta: MetaFunction = () => {
  return [
    { title: "Travel Helper" }
  ]
}

export const loader = async () => {
  return json({name: 'Slavus54'})
}

export default function Index() {
  const [towns, setTowns] = useState<TownType[]>([])

  useLayoutEffect(() => {
    let data = onGetStorageValue(TOWNS_API_KEY)

    if (data === null) {
      onInitTowns().then((res: any) => setTowns(JSON.parse(res)))
    }
  }, [])

  useEffect(() => {
    let data = onGetStorageValue(TOWNS_API_KEY)
  
    if (data !== null) {
      setTowns(JSON.parse(data))
    }
  }, [])

  return (
    <div className='text-center flex items-center relative flex-col'>

      <h1 className='leading text-3xl font-bold text-gray-800 dark:text-gray-100'>
        Welcome to Travel Helper
      </h1>
    
      {towns.length !== 0 && <Towns towns={towns} />}
    </div>
  );
}