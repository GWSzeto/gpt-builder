import { Dispatch, SetStateAction } from 'react'

type Obj = { [key: string]: any; }
function useArrayMethods<T>(set: Dispatch<SetStateAction<T[]>>, key?: string) {
  const add = (value: T) => set(prevState => [...prevState, value])
  const remove = (value: T) => set(prevState => (prevState.filter(v => v !== value)))
  const removeWithKey = (value: T) => set(prevState => (prevState.filter(v => (v as Obj)[key!] !== (value as Obj)[key!])))

  return { add, remove: key ? removeWithKey : remove }
}

export default useArrayMethods

