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
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronRight, Pencil, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

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
  sessionBlocks,
  onClone,
}: CloneSessionBlocksModalProps) {
  const [selectedBlocks, setSelectedBlocks] = React.useState<Set<string>>(new Set())
  const [expandedBlocks, setExpandedBlocks] = React.useState<Set<string>>(new Set())

  const toggleBlock = (blockId: string) => {
    const newSelected = new Set(selectedBlocks)
    if (newSelected.has(blockId)) {
      newSelected.delete(blockId)
    } else {
      newSelected.add(blockId)
    }
    setSelectedBlocks(newSelected)
  }

  const toggleExpand = (blockId: string) => {
    const newExpanded = new Set(expandedBlocks)
    if (newExpanded.has(blockId)) {
      newExpanded.delete(blockId)
    } else {
      newExpanded.add(blockId)
    }
    setExpandedBlocks(newExpanded)
  }

  const allSelected = sessionBlocks.length > 0 && selectedBlocks.size === sessionBlocks.length
  const someSelected = selectedBlocks.size > 0 && selectedBlocks.size < sessionBlocks.length

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedBlocks(new Set())
    } else {
      setSelectedBlocks(new Set(sessionBlocks.map((block) => block.id)))
    }
  }

  const handleClone = () => {
    onClone(Array.from(selectedBlocks))
    setSelectedBlocks(new Set())
    onOpenChange(false)
  }

  const handleClose = () => {
    setSelectedBlocks(new Set())
    setExpandedBlocks(new Set())
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Clone Session Blocks
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select the session blocks you want to clone. You can select multiple blocks or none.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          {/* Select All Header */}
          <div className="flex items-center gap-3 pb-3 mb-3 border-b border-border">
            <Checkbox
              checked={allSelected}
              ref={(el) => {
                if (el) {
                  (el as HTMLButtonElement & { indeterminate: boolean }).indeterminate = someSelected
                }
              }}
              onCheckedChange={toggleSelectAll}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="font-medium text-foreground">Select All</span>
            <span className="text-sm text-muted-foreground">
              ({sessionBlocks.length} session block{sessionBlocks.length === 1 ? "" : "s"})
            </span>
          </div>

          <ScrollArea className="h-[350px] pr-4">
            <div className="space-y-3">
              {sessionBlocks.map((block) => (
                <div
                  key={block.id}
                  className={cn(
                    "border-l-4 rounded-lg border bg-background transition-colors",
                    selectedBlocks.has(block.id)
                      ? "border-l-primary border-primary/30 bg-primary/5"
                      : "border-l-primary border-border"
                  )}
                >
                  {/* Block Header */}
                  <div className="flex items-center gap-3 p-4">
                    <Checkbox
                      checked={selectedBlocks.has(block.id)}
                      onCheckedChange={() => toggleBlock(block.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <button
                      onClick={() => toggleExpand(block.id)}
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {expandedBlocks.has(block.id) ? (
                        <ChevronDown className="size-4" />
                      ) : (
                        <ChevronRight className="size-4" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{block.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {block.sessions.length} {block.sessions.length === 1 ? "Session" : "Sessions"}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            ${block.price.toFixed(2)}
                          </span>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Pencil className="size-4 cursor-pointer hover:text-foreground transition-colors" />
                            <Settings className="size-4 cursor-pointer hover:text-foreground transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Sessions */}
                  {expandedBlocks.has(block.id) && (
                    <div className="border-t border-border bg-muted/30 px-4 py-3">
                      <div className="space-y-2">
                        {block.sessions.map((session) => (
                          <div
                            key={session.id}
                            className="flex items-center gap-4 text-sm py-2 px-3 rounded bg-background"
                          >
                            <span className="w-12 text-muted-foreground">{session.day}</span>
                            <span className="w-24 text-foreground">{session.date}</span>
                            <span className="w-36 text-foreground">{session.time}</span>
                            <span className="text-foreground">{session.location}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Info Banner */}
        <div className="bg-[hsl(var(--info))] text-[hsl(var(--info-foreground))] rounded-md p-3 text-sm flex items-start gap-2">
          <Pencil className="size-4 mt-0.5 flex-shrink-0" />
          <span>
            {selectedBlocks.size === 0
              ? "No session blocks selected. Click \"Clone\" to create a program without session blocks."
              : `${selectedBlocks.size} session block${selectedBlocks.size === 1 ? "" : "s"} selected for cloning.`}
          </span>
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
