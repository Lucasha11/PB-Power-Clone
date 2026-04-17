"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export interface Session {
  id: string
  title: string
  day: string
  date: string
  time: string
  location: string
}

export interface SessionBlock {
  id: string
  name: string
  sessions: Session[]
  price: number
}

interface CloneSessionBlocksModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionBlocks: SessionBlock[]
  onClone: (selectedBlockIds: string[]) => void
}

export function CloneSessionBlocksModal({
  open,
  onOpenChange,
  onClone,
}: CloneSessionBlocksModalProps) {
  const handleClone = () => {
    onClone([])
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Standard Clone
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create an exact copy of this program including all settings and sessions.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 text-sm text-muted-foreground">
          This will clone the program with all its current configuration. The cloned program will be created as a draft.
        </div>

        <DialogFooter className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleClone} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Clone
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
