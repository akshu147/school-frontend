'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from "axios"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/app/componants/ui/card'
import { Button } from "@/app/componants/ui/button"
import { Link } from 'lucide-react'
import { Input } from '@/app/componants/ui/input'

// Book types
interface SelectedBook {
  book: { id: number; name: string }
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

export default function AllSetsPage() {
  const [bookSets, setBookSets] = useState<BookSet[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  // 🔹 Fetch data from backend
  const fetchBookSets = async () => {
    setLoading(true)
    try {
      const res = await axios.get("https://school-backend-hrtt.onrender.com/admin/all-sets")
      if (res.data.success) {
        setBookSets(res.data.data)
      } else {
        console.error("API returned error:", res.data.message)
      }
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookSets()
  }, [])

  // 🔹 Delete book set
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this set?")) return
    try {
      const res = await axios.delete(`http://localhost:5000/admin/delete-set/${id}`)
      if (res.data.success) {
        setBookSets(bookSets.filter(bs => bs.id !== id))
        alert("Set deleted successfully ✅")
      } else {
        alert("Failed to delete set ❌")
      }
    } catch (err) {
      console.error(err)
      alert("Server error ❌")
    }
  }

  // 🔹 Start edit
  const handleEdit = (bs: BookSet) => {
    setEditingId(bs.id)
    setEditName(bs.setName)
  }

  // 🔹 Save edit
  const handleSave = async (id: number) => {
    try {
      const res = await axios.put(`http://localhost:5000/admin/update-set/${id}`, {
        setName: editName
      })
      if (res.data.success) {
        setBookSets(bookSets.map(bs => bs.id === id ? { ...bs, setName: editName } : bs))
        setEditingId(null)
        setEditName('')
        alert("Set updated successfully ✅")
      } else {
        alert("Update failed ❌")
      }
    } catch (err) {
      console.error(err)
      alert("Server error ❌")
    }
  }

  return (
    <>
      <header className='glass fixed top-0 left-0 right-0 z-50 mx-4 mt-4 rounded-xl lg:mx-8'>
        <div className='flex h-14 items-center justify-between px-6'>
          <div className='flex items-center gap-4'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary'>
              <span className='text-sm font-bold text-primary-foreground'>M</span>
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

      <div className='min-h-screen bg-background py-8 px-4 border-red-500'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='mx-auto max-w-6xl'
        >
          <Card className='border-border'>
            <CardHeader>
              <CardTitle>All Book Sets</CardTitle>
              <CardDescription>View, edit or delete book sets</CardDescription>
            </CardHeader>
            <CardContent className='overflow-x-auto'>
              {loading ? (
                <div className='text-center py-10 text-muted-foreground'>Loading...</div>
              ) : bookSets.length === 0 ? (
                <div className='text-center py-10 text-muted-foreground'>No book sets found</div>
              ) : (
                <table className='min-w-full border border-gray-200 rounded'>
                  <thead className='bg-[#339bcfcc] rounded-2xl'>
                    <tr>
                      <th className='px-4 py-2 border'>Set Name</th>
                      <th className='px-4 py-2 border'>Board</th>
                      <th className='px-4 py-2 border'>Medium</th>
                      <th className='px-4 py-2 border'>Class</th>
                      <th className='px-4 py-2 border'>Year</th>
                      <th className='px-4 py-2 border'>Books Count</th>
                      <th className='px-4 py-2 border'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookSets.map(bs => (
                      <tr key={bs.id} className='hover:bg-border'>
                        <td className='px-4 py-2 border'>
                          {editingId === bs.id ? (
                            <Input
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                            />
                          ) : (
                            bs.setName
                          )}
                        </td>
                        <td className='px-4 py-2 border'>{bs.board}</td>
                        <td className='px-4 py-2 border'>{bs.medium}</td>
                        <td className='px-4 py-2 border'>{bs.className}</td>
                        <td className='px-4 py-2 border'>{bs.year}</td>
                        <td className='px-4 py-2 border'>{bs.books.length}</td>
                        <td className='px-4 py-2 border flex gap-2'>
                          {editingId === bs.id ? (
                            <>
                              <Button size='sm' variant='outline' onClick={() => handleSave(bs.id)}>Save</Button>
                              <Button size='sm' variant='destructive' onClick={() => setEditingId(null)}>Cancel</Button>
                            </>
                          ) : (
                            <>
                              <Button className='bg-[#e36217e0] cursor-pointer' size='sm' variant='destructive' onClick={() => handleDelete(bs.id)}>Delete</Button>
                              <Button className='bg-[#59d259d8] cursor-pointer' size='sm' onClick={() => handleEdit(bs)}>Edit</Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
