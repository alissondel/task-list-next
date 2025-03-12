'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormModal } from '@/components/shared/form-modal'
import { TableList } from '@/components/shared/table-list'
import { intialState, type TaskSchemaInfer } from '@/schemas'

export default function Home() {
  const [openModalForm, setOpenModalForm] = useState<boolean>(false)
  const [selectedTask, setSelectedTask] = useState<TaskSchemaInfer>(intialState)

  function handleCreate() {
    setSelectedTask(intialState)
    setOpenModalForm(true)
  }

  if (openModalForm && selectedTask.id === '') {
    return (
      <FormModal
        openModal={openModalForm}
        setOpenModal={setOpenModalForm}
        selectedTask={selectedTask}
      />
    )
  }

  return (
    <main className="h-svh w-full">
      <div className="flex w-full flex-col items-center justify-center px-4 pt-6 md:px-9">
        <div className="mb-4 flex w-[500px] flex-col items-center justify-between gap-4 px-4 md:flex-row md:gap-0">
          <h2 className="flex-grow text-center text-2xl font-semibold">
            Lista de tarefas
          </h2>
          <Button onClick={handleCreate}>
            <Plus size={20} />
          </Button>
        </div>
        <div className="z-10 overflow-hidden shadow-sm">
          <TableList
            openModal={openModalForm}
            setOpenModal={setOpenModalForm}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
          />
        </div>
      </div>
    </main>
  )
}
