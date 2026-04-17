"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CloneSessionBlocksModal,
  type SessionBlock,
} from "@/components/clone-session-blocks-modal"
import {
  PowerCloneModal,
  type PaymentPlan,
} from "@/components/power-clone-modal"
import {
  ChevronDown,
  Filter,
  Pencil,
  ExternalLink,
  Trash2,
  MessageCircle,
} from "lucide-react"

// Sample session blocks data matching the screenshot design
const sampleSessionBlocks: SessionBlock[] = [
  {
    id: "1",
    name: "test session",
    price: 20.0,
    sessions: [
      {
        id: "s1",
        title: "Summer Camp Session",
        day: "Mon",
        date: "07/06/2026",
        time: "09:00AM - 03:00PM",
        location: "Local Park",
      },
    ],
  },
  {
    id: "2",
    name: "Week 1",
    price: 80.0,
    sessions: [
      {
        id: "s2",
        title: "Summer Camp Mon",
        day: "Mon",
        date: "07/06/2026",
        time: "09:00AM - 03:00PM",
        location: "Local Park",
      },
      {
        id: "s3",
        title: "Summer Camp Tue",
        day: "Tue",
        date: "07/07/2026",
        time: "09:00AM - 03:00PM",
        location: "Local Park",
      },
      {
        id: "s4",
        title: "Summer Camp Wed",
        day: "Wed",
        date: "07/08/2026",
        time: "09:00AM - 03:00PM",
        location: "Local Park",
      },
      {
        id: "s5",
        title: "Summer Camp Thu",
        day: "Thu",
        date: "07/09/2026",
        time: "09:00AM - 03:00PM",
        location: "Local Park",
      },
      {
        id: "s6",
        title: "Summer Camp Fri",
        day: "Fri",
        date: "07/10/2026",
        time: "09:00AM - 03:00PM",
        location: "Local Park",
      },
    ],
  },
  {
    id: "3",
    name: "Week 2",
    price: 80.0,
    sessions: [
      {
        id: "s7",
        title: "Summer Camp Mon",
        day: "Mon",
        date: "07/13/2026",
        time: "09:00AM - 03:00PM",
        location: "Local Park",
      },
      {
        id: "s8",
        title: "Summer Camp Tue",
        day: "Tue",
        date: "07/14/2026",
        time: "09:00AM - 03:00PM",
        location: "Local Park",
      },
      {
        id: "s9",
        title: "Summer Camp Wed",
        day: "Wed",
        date: "07/15/2026",
        time: "09:00AM - 03:00PM",
        location: "Local Park",
      },
      {
        id: "s10",
        title: "Summer Camp Thu",
        day: "Thu",
        date: "07/16/2026",
        time: "09:00AM - 03:00PM",
        location: "Local Park",
      },
      {
        id: "s11",
        title: "Summer Camp Fri",
        day: "Fri",
        date: "07/17/2026",
        time: "09:00AM - 03:00PM",
        location: "Local Park",
      },
    ],
  },
]

// Sample payment plans data matching the screenshot
const samplePaymentPlans: PaymentPlan[] = [
  {
    id: "pp1",
    name: "$1000.00 upfront & 4 payment(s) starting on 03/01/2026. (Custom Dates)",
    payments: 5,
    intervalType: "",
    intervalCount: 1,
    enabled: true,
  },
  {
    id: "pp2",
    name: "$500.00 upfront & 3 monthly payments",
    payments: 4,
    intervalType: "Monthly",
    intervalCount: 1,
    enabled: true,
  },
  {
    id: "pp3",
    name: "Full payment at registration",
    payments: 1,
    intervalType: "",
    intervalCount: 0,
    enabled: true,
  },
]

// Sample programs data matching the screenshot
const samplePrograms = [
  {
    id: "1",
    title: "Test 123 (Copy 2)",
    sessions: 0,
    fullPackage: false,
    startDate: "2026-01-29 1:00 AM",
    regStart: "2026-01-29 12:00 AM",
    regDeadline: "2026-05-29 12:00 AM",
    price: 10,
  },
  {
    id: "2",
    title: "aaa",
    sessions: 0,
    fullPackage: true,
    startDate: "2026-02-16 12:00 AM",
    regStart: "2026-02-16 12:00 AM",
    regDeadline: "2026-02-28 12:00 AM",
    price: 10,
  },
  {
    id: "3",
    title: "Summer Camp 2026",
    sessions: 44,
    fullPackage: true,
    startDate: "2026-07-01 12:00 AM",
    regStart: "YYYY-MM-DD HH:MM A",
    regDeadline: "2026-06-30 12:00 AM",
    price: 200,
  },
  {
    id: "4",
    title: "Test 123",
    sessions: 14,
    fullPackage: false,
    startDate: "2026-01-29 1:00 AM",
    regStart: "2026-01-29 12:00 AM",
    regDeadline: "2026-05-29 12:00 AM",
    price: 10,
  },
]

export default function ProgramPackagesPage() {
  const [cloneModalOpen, setCloneModalOpen] = React.useState(false)
  const [powerCloneModalOpen, setPowerCloneModalOpen] = React.useState(false)
  const [selectedPrograms, setSelectedPrograms] = React.useState<Set<string>>(
    new Set(["1"])
  )

  const handleClone = (selectedBlockIds: string[]) => {
    console.log("Cloning with session blocks:", selectedBlockIds)
    // Handle the clone operation here
    alert(
      `Cloning program with ${selectedBlockIds.length} session block(s) selected:\n${selectedBlockIds.join(", ") || "None"}`
    )
  }

  const handlePowerClone = (data: {
    programData: { title: string; price: string; category: string }
    options: Record<string, boolean>
    selectedPaymentPlanIds: string[]
  }) => {
    console.log("Power Clone data:", data)
    alert(
      `Power Clone Complete!\n\nTitle: ${data.programData.title}\nPrice: $${data.programData.price}\nCategory: ${data.programData.category}\n\nOptions enabled: ${Object.entries(data.options).filter(([_, v]) => v).map(([k]) => k).join(", ")}\n\nPayment Plans: ${data.selectedPaymentPlanIds.length} selected`
    )
  }

  const toggleProgram = (programId: string) => {
    const newSelected = new Set(selectedPrograms)
    if (newSelected.has(programId)) {
      newSelected.delete(programId)
    } else {
      newSelected.add(programId)
    }
    setSelectedPrograms(newSelected)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="bg-[#2d3e50] px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold text-primary">PLAYBOOK</span>
            <nav className="hidden lg:flex items-center gap-4 text-sm">
              <span className="text-white/80 hover:text-white cursor-pointer">Calendar</span>
              <span className="text-white/80 hover:text-white cursor-pointer">Programs</span>
              <span className="text-white/80 hover:text-white cursor-pointer">Staff</span>
              <span className="text-white/80 hover:text-white cursor-pointer">Marketing</span>
              <span className="text-white/80 hover:text-white cursor-pointer">Reporting</span>
              <span className="text-white/80 hover:text-white cursor-pointer">Admin Tools</span>
            </nav>
          </div>
          <Button variant="outline" size="sm" className="bg-white text-[#2d3e50] border-white hover:bg-white/90">
            Live Site
          </Button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="border-b border-border bg-card px-6">
        <div className="flex items-center gap-1 overflow-x-auto py-2">
          <TabButton label="Categories" count={44} />
          <TabButton label="Program Packages" count={129} active />
          <TabButton label="Seasons" count={38} />
          <TabButton label="Clubs" count={29} />
          <TabButton label="Memberships" count={42} />
          <TabButton label="Passes" count={31} />
          <TabButton label="Add Ons" count={23} />
          <TabButton label="Reservations" count={4456} />
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-4 flex flex-wrap items-center gap-4">
        <select className="border border-input rounded-md px-3 py-2 text-sm bg-background">
          <option>All Categories</option>
        </select>

        <input
          type="text"
          placeholder="Search Program Packages"
          className="border border-input rounded-md px-3 py-2 text-sm bg-background flex-1 max-w-md"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Actions
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              Clone
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setCloneModalOpen(true)}>
              Standard Clone
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPowerCloneModalOpen(true)}>
              Power Clone
            </DropdownMenuItem>
            <DropdownMenuItem>AI Clone</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="gap-2">
          <Filter className="size-4" />
          Filter
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Results per page:</span>
          <select className="border border-input rounded-md px-2 py-1 text-sm bg-background">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>

        <Button
          variant="outline"
          className="ml-auto border-primary text-primary hover:bg-primary/5"
        >
          Create Program
        </Button>
      </div>

      {/* Table */}
      <div className="px-6 pb-6">
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="w-12 p-3">
                  <Checkbox />
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  All
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  Title
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  # Sessions
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  Full Package
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  Time
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  Registration Start Date
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  Registration Deadline
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {samplePrograms.map((program) => (
                <tr
                  key={program.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="p-3">
                    <Checkbox
                      checked={selectedPrograms.has(program.id)}
                      onCheckedChange={() => toggleProgram(program.id)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Pencil className="size-4 text-primary cursor-pointer" />
                      <ExternalLink className="size-4 text-muted-foreground cursor-pointer" />
                      <Trash2 className="size-4 text-destructive cursor-pointer" />
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">
                        {program.title}
                      </span>
                      <ExternalLink className="size-3 text-muted-foreground" />
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-foreground">
                        {program.sessions}
                      </span>
                      <Pencil className="size-3 text-primary cursor-pointer" />
                    </div>
                  </td>
                  <td className="p-3">
                    <div
                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
                        program.fullPackage ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <div
                        className={`absolute top-1 size-4 rounded-full bg-white transition-transform ${
                          program.fullPackage ? "right-1" : "left-1"
                        }`}
                      />
                    </div>
                  </td>
                  <td className="p-3 text-sm text-foreground">
                    {program.startDate}
                  </td>
                  <td className="p-3 text-sm text-foreground">
                    {program.regStart}
                  </td>
                  <td className="p-3 text-sm text-foreground">
                    {program.regDeadline}
                  </td>
                  <td className="p-3 text-sm text-foreground">{program.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 left-6">
        <button className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
          <MessageCircle className="size-6" />
        </button>
      </div>

      {/* Clone Modal */}
      <CloneSessionBlocksModal
        open={cloneModalOpen}
        onOpenChange={setCloneModalOpen}
        sessionBlocks={sampleSessionBlocks}
        onClone={handleClone}
      />

      {/* Power Clone Modal */}
      <PowerCloneModal
        open={powerCloneModalOpen}
        onOpenChange={setPowerCloneModalOpen}
        paymentPlans={samplePaymentPlans}
        initialData={{
          title: "Summer Camp 2026 (Copy)",
          price: "2000.00",
          category: "Basketball Camp",
        }}
        onFinish={handlePowerClone}
      />
    </div>
  )
}

function TabButton({
  label,
  count,
  active,
}: {
  label: string
  count: number
  active?: boolean
}) {
  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        active
          ? "text-primary border-b-2 border-primary"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <span>{label}</span>
      <span
        className={`text-xs px-1.5 py-0.5 rounded ${
          active
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {count}
      </span>
    </button>
  )
}
