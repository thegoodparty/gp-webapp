'use client'

import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { createContext, useCallback, useContext, useState } from 'react'

const fetchTasks = async () => {
  return await clientFetch(apiRoutes.campaign.tasks.list)
}

export const TasksContext = createContext({
  tasks: [],
  setTasks: () => {},
})

export const useTasks = () => useContext(TasksContext)

export const TasksProvider = ({ children, tasks: initTasks }) => {
  const [tasks, setTasks] = useState(initTasks)

  const refreshTasks = useCallback(async () => {
    const resp = await fetchTasks()
    setTasks(!resp.ok ? [] : resp.data)
  }, [])

  return (
    <TasksContext.Provider value={[tasks, setTasks, refreshTasks]}>
      {children}
    </TasksContext.Provider>
  )
}
