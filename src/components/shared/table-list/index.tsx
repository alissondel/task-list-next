'use client'

import { cn } from '@/lib/utils'
import { Modal } from './modal'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { FormModal } from '../form-modal'
import { type TaskSchemaInfer } from '@/schemas'
import { ArrowDownUp, Pencil, Search, Trash } from 'lucide-react'

import {
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TableListProps {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
  selectedTask: TaskSchemaInfer
  setSelectedTask: Dispatch<SetStateAction<TaskSchemaInfer>>
}

export const TableList = ({
  openModal,
  setOpenModal,
  selectedTask,
  setSelectedTask,
}: TableListProps) => {
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false)
  const [sortedTasks, setSortedTasks] = useState<TaskSchemaInfer[]>([])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // Defina quantas tarefas exibir por página

  const { isPending, error, data } = useQuery<TaskSchemaInfer[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/tasks')
      return await response.json()
    },
    refetchInterval: 60000, // Refetch every 60 seconds
  })

  useEffect(() => {
    if (data) setSortedTasks(data)
  }, [data])

  if (isPending) return <Skeleton className="h-[350px] w-[800px] rounded-xl" />

  if (error) return 'Um erro ocorreu: ' + error.message

  // Abre Modal de criar ou editar a tarefa
  function handleUpdate(task: TaskSchemaInfer) {
    setSelectedTask(task)
    setOpenModal(true)
  }

  if (openModal && selectedTask.id !== '') {
    return (
      <FormModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedTask={selectedTask}
      />
    )
  }

  // Abre Modal de deletar a tarefa
  function handleDelete(task: TaskSchemaInfer) {
    setSelectedTask(task)
    setOpenModalDelete(true)
  }

  if (openModalDelete) {
    return (
      <Modal
        openModal={openModalDelete}
        setOpenModal={setOpenModalDelete}
        tasks={selectedTask}
      />
    )
  }

  // Ordernação da tabela crescente e descrecente
  function handleOrderBy(key: keyof TaskSchemaInfer) {
    const sorted = [...sortedTasks].sort((a, b) => {
      const aValue = a[key] ?? ''
      const bValue = b[key] ?? ''

      switch (key) {
        case 'title':
        case 'description':
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue)
          }
          break
        case 'priority':
          return sortOrder === 'asc'
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue)
        case 'status':
          return sortOrder === 'asc'
            ? Number(aValue) - Number(bValue) // false (0) vem antes de true (1)
            : Number(bValue) - Number(aValue) // true (1) vem antes de false (0)
        default:
          return 0
      }
      return 0
    })

    setSortedTasks(sorted)
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  // Função para filtrar campos Text e Number
  function handleFilter(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    const target = value.toLowerCase().trim()

    // Se o input estiver vazio, resetar a lista para os dados originais
    if (!target) {
      setSortedTasks(data as TaskSchemaInfer[]) // data deve ser a lista original de tarefas
      return
    }

    const filterableFields: Record<string, keyof TaskSchemaInfer> = {
      title: 'title',
      description: 'description',
      type: 'type',
      priority: 'priority',
    }

    if (name in filterableFields) {
      if (data) {
        const filteredTasks = data.filter((task) =>
          String(task[filterableFields[name]]).toLowerCase().includes(target),
        )

        setSortedTasks(filteredTasks)
      }
    }
  }

  // Função para filtrar o status
  const handleFilterStatus = (value: string) => {
    setStatusFilter(value)

    if (data) {
      const filteredTasks = data.filter((task) => {
        if (value === 'all') return true // Exibe todas as tarefas
        return String(task.status) === value
      })

      setSortedTasks(filteredTasks)
    }
  }

  // Calcula os índices dos itens da página atual
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentTasks = sortedTasks.slice(indexOfFirstItem, indexOfLastItem)

  // Calcula o número total de páginas
  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage)

  // Muda de página
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="mt-4 flex flex-col justify-center">
      <div className="mb-4 flex w-full flex-row gap-4 p-1">
        <div className="relative w-full">
          <Input
            placeholder="Filtrar Titulo..."
            className="pr-10"
            onChange={handleFilter}
            type="text"
            name="title"
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
        </div>
        <div className="relative w-full">
          <Input
            placeholder="Filtrar Descrição..."
            className="pr-10"
            onChange={handleFilter}
            type="text"
            name="description"
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
        </div>
        <div className="relative w-full">
          <Input
            name="type"
            placeholder="Filtrar Tipo da Tarefa..."
            className="pr-10"
            onChange={handleFilter}
            type="text"
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
        </div>
        <div className="relative w-full">
          <Input
            name="priority"
            placeholder="Filtrar Nivel de Prioridade..."
            className="pr-10"
            onChange={handleFilter}
            minLength={1}
            maxLength={2}
            type="number"
            onInput={(e) => {
              const value = e.currentTarget.value

              // Permite valor vazio
              if (value === '') return

              // Converte para número e limita o valor entre 1 e 10
              const numValue = Number(value)
              if (numValue < 1) e.currentTarget.value = '1'
              if (numValue > 10) e.currentTarget.value = '10'
            }}
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
        </div>
        <div className="relative w-full">
          <Select
            name="status"
            value={statusFilter}
            onValueChange={handleFilterStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Situação:</SelectLabel>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Ativo</SelectItem>
                <SelectItem value="false">Inativo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">
              <div className="flex items-center justify-center gap-1">
                <span>Titulo</span>
                <ArrowDownUp
                  size={16}
                  className={cn(
                    'cursor-pointer transition-colors hover:text-sky-900',
                    sortOrder === 'desc' ? 'text-amber-600' : '',
                  )}
                  onClick={() => handleOrderBy('title')}
                />
              </div>
            </TableHead>
            <TableHead className="w-[300px]">
              <div className="flex items-center justify-center gap-1">
                <span>Descrição</span>
                <ArrowDownUp
                  size={16}
                  className={cn(
                    'cursor-pointer transition-colors hover:text-sky-900',
                    sortOrder === 'desc' ? 'text-amber-600' : '',
                  )}
                  onClick={() => handleOrderBy('description')}
                />
              </div>
            </TableHead>
            <TableHead className="w-[150px]">
              <div className="flex items-center justify-center gap-1">
                <span>Tipo da Tarefa</span>
                <ArrowDownUp
                  size={16}
                  className={cn(
                    'cursor-pointer transition-colors hover:text-sky-900',
                    sortOrder === 'desc' ? 'text-amber-600' : '',
                  )}
                  onClick={() => handleOrderBy('title')}
                />
              </div>
            </TableHead>
            <TableHead className="w-[200px]">
              <div className="flex items-center justify-center gap-1">
                <span>Nível de Prioridade</span>
                <ArrowDownUp
                  size={16}
                  className={cn(
                    'cursor-pointer transition-colors hover:text-sky-900',
                    sortOrder === 'desc' ? 'text-amber-600' : '',
                  )}
                  onClick={() => handleOrderBy('priority')}
                />
              </div>
            </TableHead>
            <TableHead className="w-[100px]">
              <div className="flex items-center justify-center gap-1">
                <span>Situação</span>
                <ArrowDownUp
                  size={16}
                  className={cn(
                    'cursor-pointer transition-colors hover:text-sky-900',
                    sortOrder === 'desc' ? 'text-amber-600' : '',
                  )}
                  onClick={() => handleOrderBy('status')}
                />
              </div>
            </TableHead>
            <TableHead className="pr-5 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTasks.map((task: TaskSchemaInfer) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>
                {task.description.length > 20
                  ? task.description.substring(0, 40) + '...'
                  : task.description}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline">{task.type}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <TooltipProvider>
                  <Tooltip>
                    <Badge
                      variant="outline"
                      className={`font-bold ${
                        Number(task.priority) >= 8
                          ? 'text-red-500'
                          : Number(task.priority) <= 4
                            ? 'text-yellow-500'
                            : 'text-blue-500'
                      }`}
                    >
                      <TooltipTrigger>{task.priority}</TooltipTrigger>
                    </Badge>
                    <TooltipContent>
                      <p>
                        {Number(task.priority) >= 8
                          ? 'Prioridade Alta'
                          : Number(task.priority) <= 4
                            ? 'Prioridade Baixa'
                            : 'Prioridade Média'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                {task.status ? (
                  <Badge variant="secondary">Ativo</Badge>
                ) : (
                  <Badge variant="destructive">Inativo</Badge>
                )}
              </TableCell>
              <TableCell className="flex items-center justify-end gap-6">
                <Pencil
                  size={16}
                  className="cursor-pointer text-yellow-500 hover:text-yellow-900"
                  onClick={() => handleUpdate(task)}
                />
                <Trash
                  size={16}
                  className="cursor-pointer text-red-500 hover:text-red-900"
                  onClick={() => handleDelete(task)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      aria-label="Anterior"
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? 'cursor-not-allowed opacity-50'
                          : 'cursor-pointer hover:font-semibold hover:text-slate-600'
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      aria-label="Próximo"
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? 'cursor-not-allowed opacity-50'
                          : 'cursor-pointer hover:font-semibold hover:text-slate-600'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
