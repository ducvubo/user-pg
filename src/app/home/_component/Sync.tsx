import React, { useEffect, useState } from 'react'
import { createTokenSync } from '../home.api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Copy } from 'lucide-react'
import { toast } from '@/hooks/use-toast'


interface SyncProps {
  type: 'dropdown' | 'li'
}

export default function Sync({ type }: SyncProps) {
  const [open, setOpen] = useState(false)
  const [token, setToken] = useState('')
  const handleCreateToken = async (e: React.MouseEvent) => {
    try {
      e.stopPropagation()
      e.preventDefault()
      const response = await createTokenSync()
      if (response.statusCode === 201 && response.data) {
        setToken(response.data)
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Không thể tạo token đồng bộ.',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Đã xảy ra lỗi khi gọi API.',
      })
    }
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigator.clipboard.writeText(process.env.NEXT_PUBLIC_URL_CLIENT + '/xac-nhan-dong-bo-du-lieu?token=' + token)
    toast({
      title: 'Đã sao chép',
      description: 'Link đã được sao chép vào clipboard.',
    })
  }

  useEffect(() => {
    setToken('')
  }, [open])

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (type === 'dropdown') {
      e.stopPropagation()
      e.preventDefault()
      setOpen(true)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) {
          setToken('')
        }
      }}
    >
      <DialogTrigger asChild>
        {
          type === 'li' ? (
            <li className='cursor-pointer hover:text-primary text-center my-2'>Đồng bộ dữ liệu</li>
          ) : (
            <span onClick={handleTriggerClick} className='text-sm  hover:text-primary cursor-pointer'>
              Đồng bộ dữ liệu
            </span>
          )
        }
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{token ? 'Link đồng bộ' : 'Xác nhận tạo link'}</DialogTitle>
          <DialogDescription>
            {token
              ? 'Link đồng bộ đã được tạo. Sao chép link dưới đây để sử dụng.'
              : 'Bạn có muốn tạo một link để đồng bộ dữ liệu không?'}
          </DialogDescription>
        </DialogHeader>
        {token && (
          <div className='py-4'>
            <div className='flex items-center space-x-2'>
              <Input disabled value={process.env.NEXT_PUBLIC_URL_CLIENT + '/xac-nhan-dong-bo-du-lieu?token=' + token} readOnly className='font-mono' />
              <Button size='icon' onClick={handleCopy}>
                <Copy className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}
        <DialogFooter>
          {token ? (
            <Button onClick={() => setOpen(false)}>Đóng</Button>
          ) : (
            <>
              <Button variant='outline' onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreateToken}>Xác nhận</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}