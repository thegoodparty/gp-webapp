'use client'
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  MenuIcon,
} from '@styleguide'
import H2 from '@shared/typography/H2'
import Subtitle1 from '@shared/typography/Subtitle1'
import { useEffect, useState } from 'react'
import useChat from 'app/dashboard/campaign-assistant/components/useChat'
import { ChatHistoryGroup } from 'app/dashboard/campaign-assistant/components/ChatHistoryGroup'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { Chat } from './ajaxActions'

interface ChatGroup {
  title: string
  chats: Chat[]
}

const ChatHistory = (): React.JSX.Element => {
  const { chats } = useChat()
  const [open, setOpen] = useState(false)
  const [chatsByDate, setChatsByDate] = useState<ChatGroup[]>([])

  useEffect(() => {
    const thisWeek: Chat[] = []
    const thisMonth: Chat[] = []
    const older: Chat[] = []
    chats.forEach((chat) => {
      const updatedAt = new Date(chat.updatedAt)
      const now = new Date()
      const diff = now.getTime() - updatedAt.getTime()
      const diffDays = diff / (1000 * 60 * 60 * 24)
      if (diffDays < 7) {
        thisWeek.push(chat)
      } else if (diffDays < 30) {
        thisMonth.push(chat)
      } else {
        older.push(chat)
      }
    })
    setChatsByDate([
      { title: 'This Week', chats: thisWeek },
      { title: 'This Month', chats: thisMonth },
      { title: 'Older', chats: older },
    ])
  }, [chats])

  const closeDrawer = () => {
    setOpen(false)
  }

  return (
    <>
      <Button
        size="large"
        onClick={() => {
          trackEvent(EVENTS.AIAssistant.ClickViewChatHistory)
          setOpen(true)
        }}
        className="!px-3 md:!px-6"
      >
        <div className="flex items-center">
          <MenuIcon className="size-6" />
          <div className="ml-2 hidden md:block">View Chat History</div>
        </div>
      </Button>

      <Drawer
        open={open}
        onOpenChange={(next) => !next && closeDrawer()}
        direction="right"
      >
        <DrawerContent className="min-w-[300px] h-full">
          <DrawerHeader className="border-b border-border">
            <DrawerTitle asChild>
              <H2>History</H2>
            </DrawerTitle>
            <DrawerDescription asChild>
              <Subtitle1 className="mt-2">
                Explore all your past chats with GoodParty.org
              </Subtitle1>
            </DrawerDescription>
          </DrawerHeader>
          {chatsByDate.map(({ title, chats }) => (
            <ChatHistoryGroup
              key={title}
              title={title}
              chats={chats}
              closeDrawer={closeDrawer}
            />
          ))}
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default ChatHistory
