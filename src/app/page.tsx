'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/app/componants/ui/button"
import { Input } from '@/app/componants/ui/input'
import { Label } from '@/app/componants/ui/label'
import axios from "axios"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/app/componants/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/app/componants/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/componants/ui/tabs'
import { Badge } from '@/app/componants/ui/badge'
import { Progress } from '@/app/componants/ui/progress'
import { Link } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Book {
  id: number
  name: string
  subject: string
  publisher: string
}

interface SelectedBook {
  book: Book
  quantity: number
}

interface BookSet {
  id: number
  setName: string
  board: string
  medium: string
  className: string
  year: string
  books: SelectedBook[]
}

const boards = ["CBSE", "ICSE", "State Board"]
const mediums = ["English", "Hindi", "Gujarati"]
const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
const years = ["2024-2025", "2025-2026"]

const allBooks: Book[] = [
  { id: 1, name: "Mathematics", subject: "Math", publisher: "Publisher A" },
  { id: 2, name: "English Grammar", subject: "English", publisher: "Publisher B" },
  { id: 3, name: "Science", subject: "Science", publisher: "Publisher C" },
  { id: 4, name: "Social Studies", subject: "Social", publisher: "Publisher D" }
]

export default function BookSetPage() {
  const [activeTab, setActiveTab] = useState('create')
  const [step, setStep] = useState(1)

  // Form states
  const [board, setBoard] = useState('')
  const [medium, setMedium] = useState('')
  const [className, setClassName] = useState('')
  const [year, setYear] = useState('')
  const [setName, setSetName] = useState('')
  const [selectedBooks, setSelectedBooks] = useState<SelectedBook[]>([])
  const router = useRouter()

  const [bookSets, setBookSets] = useState<BookSet[]>([])

  // Add book to selectedBooks or update if already exists
  const handleAddBook = (book: Book) => {
    const exists = selectedBooks.find(b => b.book.id === book.id)
    if (!exists) {
      setSelectedBooks([...selectedBooks, { book, quantity: 1 }])
    }
  }

  const handleQuantityChange = (bookId: number, qty: number) => {
    if (qty < 1) return
    setSelectedBooks(selectedBooks.map(b => b.book.id === bookId ? { ...b, quantity: qty } : b))
  }

  const handleRemoveBook = (bookId: number) => {
    setSelectedBooks(selectedBooks.filter(b => b.book.id !== bookId))
  }


const handleSubmit = async () => {
  if (!board || !medium || !className || !year || !setName || selectedBooks.length === 0) {
    alert("Please complete all fields and add at least one book!")
    return
  }

  const payload = {
    setName,
    board,
    medium,
    className,
    year,
    books: selectedBooks
  }

  try {
    const res = await axios.post(
      "https://school-backend-hrtt.onrender.com/admin/submit-set",
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )

    const data = res.data

    console.log("Backend response:", data)

    // OPTIONAL: frontend state me bhi add karna ho
    const newSet: BookSet = {
      id: bookSets.length + 1,
      ...payload
    }

    setBookSets([...bookSets, newSet])

    // Reset form
    setStep(1)
    setBoard('')
    setMedium('')
    setClassName('')
    setYear('')
    setSetName('')
    setSelectedBooks([])
    setActiveTab('dashboard')

    alert("Set submitted successfully ✅")
    router.push("/screen/allsets")

  } catch (error: any) {
    console.error("API Error:", error)

    // axios specific error handling
    alert(
      error?.response?.data?.message ||
      "Server not reachable ❌"
    )
  }
}



  const progressPercentage = (step / 3) * 100

  return (
    <div className='min-h-screen bg-background py-8 px-4'>
       <header className='glass fixed top-0 left-0 right-0 z-50 mx-4 mt-4 rounded-xl lg:mx-8'>
        <div className='flex h-14 items-center justify-between px-6'>
          <div className='flex items-center gap-4'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary'>
                <span className='text-sm font-bold text-primary-foreground'>
                  L
                </span>
              </div>
              <span className='text-lg font-semibold'>Happy School Happy Children</span>
          </div>
          <div className='flex items-center gap-3'>
            
            <Button size='lg'>
              <Link href='/screen/allsets'>See All sets</Link>
            </Button>
          </div>
        </div>
      </header>
      <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-8'>
        <div className='flex flex-col items-center text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className='mb-4'>📚</Badge>
            <h1 className='text-4xl font-bold'>School Book Inventory</h1>
            <p className='mt-2 text-muted-foreground'>Organize. Track. Teach Better.</p>
          </motion.div>

          <TabsList className='mt-6 bg-secondary'>
            <TabsTrigger value='create'>Create Book Set</TabsTrigger>
            <TabsTrigger value='dashboard'>All Book Sets</TabsTrigger>
          </TabsList>
        </div>

        {/* Create Book Set */}
        <TabsContent value='create'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='mx-auto max-w-3xl'
          >
            <Card className='border-border'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle>Create Book Set</CardTitle>
                    <CardDescription>Complete all steps to create a book set</CardDescription>
                  </div>
                  <Badge variant='outline'>Step {step} of 3</Badge>
                </div>
                <Progress value={progressPercentage} className='mt-4' />
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Step 1 */}
                {step === 1 && (
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label>Board</Label>
                      <Select onValueChange={setBoard} value={board}>
                        <SelectTrigger className='bg-input'>
                          <SelectValue placeholder='Select Board' />
                        </SelectTrigger>
                        <SelectContent>
                          {boards.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label>Medium</Label>
                      <Select onValueChange={setMedium} value={medium}>
                        <SelectTrigger className='bg-input'>
                          <SelectValue placeholder='Select Medium' />
                        </SelectTrigger>
                        <SelectContent>
                          {mediums.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label>Class</Label>
                      <Select onValueChange={setClassName} value={className}>
                        <SelectTrigger className='bg-input'>
                          <SelectValue placeholder='Select Class' />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label>Academic Year</Label>
                      <Select onValueChange={setYear} value={year}>
                        <SelectTrigger className='bg-input'>
                          <SelectValue placeholder='Select Year' />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2 sm:col-span-2'>
                      <Label>Set Name</Label>
                      <Input
                        placeholder='e.g., Class 3 English Set'
                        value={setName}
                        onChange={e => setSetName(e.target.value)}
                        className='bg-input'
                      />
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div className='space-y-4'>
                    {allBooks.map(book => {
                      const selected = selectedBooks.find(b => b.book.id === book.id)
                      return (
                        <div key={book.id} className='flex items-center justify-between border p-3 rounded-lg'>
                          <div>
                            <div className='font-medium'>{book.name}</div>
                            <div className='text-xs text-muted-foreground'>{book.subject} | {book.publisher}</div>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Input
                              type='number'
                              min={1}
                              placeholder='Qty'
                              className='w-20'
                              value={selected?.quantity || ''}
                              onChange={e => handleQuantityChange(book.id, parseInt(e.target.value))}
                              disabled={!selected}
                            />
                            {selected ? (
                              <Button size='sm' variant='destructive' onClick={() => handleRemoveBook(book.id)}>Remove</Button>
                            ) : (
                              <Button size='sm' onClick={() => handleAddBook(book)}>Add</Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div className='space-y-4'>
                    <Card className='border-border'>
                      <CardHeader>
                        <CardTitle>Review & Submit</CardTitle>
                        <CardDescription>Check all details before submission</CardDescription>
                      </CardHeader>
                      <CardContent className='space-y-2'>
                        <div><strong>Board:</strong> {board}</div>
                        <div><strong>Medium:</strong> {medium}</div>
                        <div><strong>Class:</strong> {className}</div>
                        <div><strong>Year:</strong> {year}</div>
                        <div><strong>Set Name:</strong> {setName}</div>
                        <div>
                          <strong>Books:</strong>
                          <ul className='list-disc list-inside'>
                            {selectedBooks.map(b => (
                              <li key={b.book.id}>{b.book.name} x {b.quantity}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className='flex gap-3'>
                  {step > 1 && (
                    <Button variant='outline' className='flex-1' onClick={() => setStep(step - 1)}>Previous</Button>
                  )}
                  {step < 3 ? (
                    <Button className='flex-1' onClick={() => setStep(step + 1)}>Continue</Button>
                  ) : (
                    <Button className='flex-1' onClick={handleSubmit}>Submit Set</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Dashboard */}
        <TabsContent value='dashboard'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='mx-auto max-w-4xl'
          >
            <Card className='border-border'>
              <CardHeader>
                <CardTitle>All Book Sets</CardTitle>
                <CardDescription>View all created book sets</CardDescription>
              </CardHeader>
              <CardContent className='overflow-x-auto'>
                <table className='min-w-full border border-gray-200 rounded'>
                  <thead className='bg-gray-100'>
                    <tr>
                      <th className='px-4 py-2 border'>Set Name</th>
                      <th className='px-4 py-2 border'>Board</th>
                      <th className='px-4 py-2 border'>Medium</th>
                      <th className='px-4 py-2 border'>Class</th>
                      <th className='px-4 py-2 border'>Year</th>
                      <th className='px-4 py-2 border'>Books Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookSets.map(bs => (
                      <tr key={bs.id} className='hover:bg-gray-50'>
                        <td className='px-4 py-2 border'>{bs.setName}</td>
                        <td className='px-4 py-2 border'>{bs.board}</td>
                        <td className='px-4 py-2 border'>{bs.medium}</td>
                        <td className='px-4 py-2 border'>{bs.className}</td>
                        <td className='px-4 py-2 border'>{bs.year}</td>
                        <td className='px-4 py-2 border'>{bs.books.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
