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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Info } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface PaymentPlan {
  id: string
  name: string
  payments: number
  intervalType: string
  intervalCount: number
  enabled: boolean
}

export interface ProgramData {
  title: string
  price: string
  category: string
  startTime: string
  endTime: string
  registrationStartDate: string
  registrationDeadline: string
  displayClassSessions: string
}

export interface CloneOptions {
  includeSessions: boolean
  includeWaitlistSettings: boolean
  includeCustomFields: boolean
  includeNotifications: boolean
  includeWaivers: boolean
}

interface PowerCloneModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentPlans: PaymentPlan[]
  initialData?: Partial<ProgramData>
  onFinish: (data: {
    programData: ProgramData
    options: CloneOptions
    selectedPaymentPlanIds: string[]
  }) => void
}

const categories = ["Basketball Camp", "Soccer Camp", "Swimming Camp", "Tennis Camp", "General Sports"]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

type Recurrence = "never" | "daily" | "weekly" | "monthly"

function computeEndDate(startStr: string, recurrence: Recurrence, selectedDays: Set<number>): string {
  const dateMatch = startStr.match(/^(\d{4}-\d{2}-\d{2})/)
  if (!dateMatch) return ""
  const start = new Date(dateMatch[1])
  if (isNaN(start.getTime())) return ""

  const timeMatch = startStr.match(/(\d{1,2}:\d{2} (?:AM|PM))$/)
  const time = timeMatch ? timeMatch[1] : "12:00 AM"

  let end: Date

  if (recurrence === "daily") {
    end = new Date(start)
    end.setDate(end.getDate() + 30)
  } else if (recurrence === "weekly") {
    end = new Date(start)
    end.setDate(end.getDate() + 56) // 8 weeks out
    // Walk back to find the last occurrence of a selected day
    if (selectedDays.size > 0) {
      for (let i = 0; i < 7; i++) {
        if (selectedDays.has(end.getDay())) break
        end.setDate(end.getDate() - 1)
      }
    }
  } else if (recurrence === "monthly") {
    end = new Date(start)
    end.setMonth(end.getMonth() + 3)
  } else {
    return ""
  }

  const yyyy = end.getFullYear()
  const mm = String(end.getMonth() + 1).padStart(2, "0")
  const dd = String(end.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd} ${time}`
}

export function PowerCloneModal({
  open,
  onOpenChange,
  paymentPlans,
  initialData,
  onFinish,
}: PowerCloneModalProps) {
  const [step, setStep] = React.useState(1)
  const [programData, setProgramData] = React.useState<ProgramData>({
    title: initialData?.title || "Summer Camp 2026 (Copy)",
    price: initialData?.price || "2000.00",
    category: initialData?.category || "Basketball Camp",
    startTime: initialData?.startTime || "2026-07-01 12:00 AM",
    endTime: initialData?.endTime || "",
    registrationStartDate: initialData?.registrationStartDate || "",
    registrationDeadline: initialData?.registrationDeadline || "2026-06-30 12:00 AM",
    displayClassSessions: "",
  })
  const [options, setOptions] = React.useState<CloneOptions>({
    includeSessions: true,
    includeWaitlistSettings: true,
    includeCustomFields: true,
    includeNotifications: true,
    includeWaivers: true,
  })
  const [selectedPlans, setSelectedPlans] = React.useState<Set<string>>(new Set())
  const [recurrence, setRecurrence] = React.useState<Recurrence>("never")
  const [selectedDays, setSelectedDays] = React.useState<Set<number>>(new Set())

  const toggleDay = (day: number) => {
    setSelectedDays((prev) => {
      const next = new Set(prev)
      if (next.has(day)) next.delete(day)
      else next.add(day)
      return next
    })
  }

  // Recompute end date whenever recurrence, selected days, or start time changes
  React.useEffect(() => {
    const computed = computeEndDate(programData.startTime, recurrence, selectedDays)
    setProgramData((prev) => ({ ...prev, endTime: computed }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recurrence, selectedDays, programData.startTime])

  const handleInputChange = (field: keyof ProgramData, value: string) => {
    setProgramData((prev) => ({ ...prev, [field]: value }))
  }

  const handleOptionToggle = (option: keyof CloneOptions) => {
    setOptions((prev) => ({ ...prev, [option]: !prev[option] }))
  }
  const handleClose = (nextOpen: boolean) => {
    // Always notify parent
    onOpenChange(nextOpen)

    // If closing the modal, reset state
    if (!nextOpen) {
      setStep(1)

      setProgramData({
        title: initialData?.title || "Summer Camp 2026 (Copy)",
        price: initialData?.price || "2000.00",
        category: initialData?.category || "Basketball Camp",
        startTime: initialData?.startTime || "2026-07-01 12:00 AM",
        endTime: initialData?.endTime || "",
        registrationStartDate: initialData?.registrationStartDate || "",
        registrationDeadline: initialData?.registrationDeadline || "2026-06-30 12:00 AM",
        displayClassSessions: "",
      })

      setOptions({
        includeSessions: true,
        includeWaitlistSettings: true,
        includeCustomFields: true,
        includeNotifications: true,
        includeWaivers: true,
      })

      setSelectedPlans(new Set())
      setRecurrence("never")
      setSelectedDays(new Set())
    }
  }
  const togglePlan = (planId: string) => {
    const newSelected = new Set(selectedPlans)
    if (newSelected.has(planId)) {
      newSelected.delete(planId)
    } else {
      newSelected.add(planId)
    }
    setSelectedPlans(newSelected)
  }

  const allPlansSelected = paymentPlans.length > 0 && selectedPlans.size === paymentPlans.length
  const somePlansSelected = selectedPlans.size > 0 && selectedPlans.size < paymentPlans.length

  const toggleSelectAllPlans = () => {
    if (allPlansSelected) {
      setSelectedPlans(new Set())
    } else {
      setSelectedPlans(new Set(paymentPlans.map((plan) => plan.id)))
    }
  }



  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Power Clone
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a customized copy of your program with full control over settings.
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 py-4">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "size-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    s < step
                      ? "bg-primary text-primary-foreground"
                      : s === step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {s < step ? <Check className="size-4" /> : s}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    s === step ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s === 1 ? "Basic Info" : s === 2 ? "Options" : "Payment Plans"}
                </span>
              </div>
              {s < 3 && (
                <div
                  className={cn(
                    "w-12 h-0.5 mx-2",
                    s < step ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex-1 min-h-0">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {/* Title and Price Row */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="title" className="text-foreground">
                        <span className="text-destructive">*</span> Title
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="size-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-[220px] text-center">
                          Price, capacity, location, and title will remain the same as the original program unless changed here.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="title"
                      value={programData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-foreground">
                      <span className="text-destructive">*</span> Price
                    </Label>
                    <Input
                      id="price"
                      value={programData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>

                {/* Category and Start Time Row */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-foreground">
                      Category <span className="text-primary">+</span>
                    </Label>
                    <select
                      id="category"
                      value={programData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="text-foreground">
                      <span className="text-destructive">*</span> Start time
                    </Label>
                    <Input
                      id="startTime"
                      value={programData.startTime}
                      onChange={(e) => handleInputChange("startTime", e.target.value)}
                      placeholder="YYYY-MM-DD HH:MM AM/PM"
                      className="bg-background"
                    />
                    <p className="text-xs text-muted-foreground">
                      Date and Time this camp/clinic/class first starts
                    </p>
                  </div>
                </div>

                {/* Recurs and End Time Row */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="recurrence" className="text-foreground">
                      Recurs
                    </Label>
                    <select
                      id="recurrence"
                      value={recurrence}
                      onChange={(e) => setRecurrence(e.target.value as Recurrence)}
                      className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
                    >
                      <option value="never">Never</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    {recurrence === "weekly" && (
                      <p className="text-xs text-primary">
                        Remember to select an end date for the sessions.
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="text-foreground">
                      End time
                      {recurrence !== "never" && (
                        <span className="ml-1.5 text-xs font-normal text-primary">(auto-computed)</span>
                      )}
                    </Label>
                    <Input
                      id="endTime"
                      value={programData.endTime}
                      onChange={(e) => handleInputChange("endTime", e.target.value)}
                      placeholder="YYYY-MM-DD HH:MM AM/PM"
                      className={cn("bg-background", recurrence !== "never" && "text-primary")}
                      readOnly={recurrence !== "never"}
                    />
                    <p className="text-xs text-muted-foreground">
                      Date and Time this camp/clinic/class is expected to end
                    </p>
                  </div>
                </div>

                {/* Weekly Day Picker */}
                {recurrence === "weekly" && (
                  <div className="space-y-2">
                    <Label className="text-foreground">Weekly Recurrence</Label>
                    <div className="flex gap-2">
                      {DAYS.map((day, i) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(i)}
                          className={cn(
                            "flex-1 py-2 text-sm rounded-md border transition-colors",
                            selectedDays.has(i)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-foreground border-input hover:bg-muted/50"
                          )}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Registration Start Date and Deadline Row */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="registrationStartDate" className="text-foreground">
                      Registration start date
                    </Label>
                    <Input
                      id="registrationStartDate"
                      value={programData.registrationStartDate}
                      onChange={(e) => handleInputChange("registrationStartDate", e.target.value)}
                      placeholder="YYYY-MM-DD HH:MM AM/PM"
                      className="bg-background"
                    />
                    <p className="text-xs text-muted-foreground">
                      If left blank, registration will be open immediately
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationDeadline" className="text-foreground">
                      Registration deadline
                    </Label>
                    <Input
                      id="registrationDeadline"
                      value={programData.registrationDeadline}
                      onChange={(e) => handleInputChange("registrationDeadline", e.target.value)}
                      placeholder="YYYY-MM-DD HH:MM AM/PM"
                      className="bg-background"
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          {/* Step 2: Options */}
          {step === 2 && (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Choose which elements to include in your cloned program.
                </p>

                {/* Select All */}
                <div className="flex items-center gap-3 pb-3 mb-3 border-b border-border">
                  <Checkbox
                    checked={Object.values(options).every(Boolean)}
                    onCheckedChange={() => {
                      const allChecked = Object.values(options).every(Boolean)
                      setOptions({
                        includeSessions: !allChecked,
                        includeWaitlistSettings: !allChecked,
                        includeCustomFields: !allChecked,
                        includeNotifications: !allChecked,
                        includeWaivers: !allChecked,
                      })
                    }}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="font-medium text-foreground">Select All Options</span>
                </div>

                {/* Options Accordion */}
                <Accordion type="multiple" className="w-full">
                  {/* Sessions Accordion */}
                  <AccordionItem value="sessions" className="border rounded-lg px-4 mb-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={options.includeSessions}
                        onCheckedChange={() => handleOptionToggle("includeSessions")}
                        onClick={(e) => e.stopPropagation()}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <AccordionTrigger className="flex-1 hover:no-underline">
                        <div>
                          <span className="font-medium text-foreground">Sessions</span>
                          <p className="text-xs text-muted-foreground font-normal">
                            Copy all class sessions from the original program
                          </p>
                        </div>
                      </AccordionTrigger>
                    </div>
                    <AccordionContent className="pl-9">
                      <div className="space-y-2 pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-2">44 sessions available:</p>
                        <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto">
                          {Array.from({ length: 12 }, (_, i) => (
                            <div key={i} className="text-sm text-foreground bg-muted/30 px-2 py-1 rounded">
                              Summer Camp Jul {String(i + 1).padStart(2, "0")}, 9:00 AM
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Waitlist Settings */}
                  <AccordionItem value="waitlist" className="border rounded-lg px-4 mb-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={options.includeWaitlistSettings}
                        onCheckedChange={() => handleOptionToggle("includeWaitlistSettings")}
                        onClick={(e) => e.stopPropagation()}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <AccordionTrigger className="flex-1 hover:no-underline">
                        <div>
                          <span className="font-medium text-foreground">Waitlist Settings</span>
                          <p className="text-xs text-muted-foreground font-normal">
                            Copy waitlist configuration and restrictions
                          </p>
                        </div>
                      </AccordionTrigger>
                    </div>
                    <AccordionContent className="pl-9">
                      <div className="space-y-2 pt-2 border-t border-border">
                        <div className="text-sm text-muted-foreground">
                          <p>Max waitlist size: 10</p>
                          <p>Auto-promote: Enabled</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Custom Fields */}
                  <AccordionItem value="customFields" className="border rounded-lg px-4 mb-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={options.includeCustomFields}
                        onCheckedChange={() => handleOptionToggle("includeCustomFields")}
                        onClick={(e) => e.stopPropagation()}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <AccordionTrigger className="flex-1 hover:no-underline">
                        <div>
                          <span className="font-medium text-foreground">Custom Fields</span>
                          <p className="text-xs text-muted-foreground font-normal">
                            Copy custom registration fields
                          </p>
                        </div>
                      </AccordionTrigger>
                    </div>
                    <AccordionContent className="pl-9">
                      <div className="space-y-2 pt-2 border-t border-border">
                        <div className="text-sm text-muted-foreground">
                          <p>3 custom fields configured</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Notifications */}
                  <AccordionItem value="notifications" className="border rounded-lg px-4 mb-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={options.includeNotifications}
                        onCheckedChange={() => handleOptionToggle("includeNotifications")}
                        onClick={(e) => e.stopPropagation()}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <AccordionTrigger className="flex-1 hover:no-underline">
                        <div>
                          <span className="font-medium text-foreground">Notifications</span>
                          <p className="text-xs text-muted-foreground font-normal">
                            Copy email notification settings
                          </p>
                        </div>
                      </AccordionTrigger>
                    </div>
                    <AccordionContent className="pl-9">
                      <div className="space-y-2 pt-2 border-t border-border">
                        <div className="text-sm text-muted-foreground">
                          <p>Registration confirmation: Enabled</p>
                          <p>Reminder emails: Enabled (24h before)</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Waivers */}
                  <AccordionItem value="waivers" className="border rounded-lg px-4 mb-3 border-b">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={options.includeWaivers}
                        onCheckedChange={() => handleOptionToggle("includeWaivers")}
                        onClick={(e) => e.stopPropagation()}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <AccordionTrigger className="flex-1 hover:no-underline">
                        <div>
                          <span className="font-medium text-foreground">Waivers</span>
                          <p className="text-xs text-muted-foreground font-normal">
                            Copy waiver requirements
                          </p>
                        </div>
                      </AccordionTrigger>
                    </div>
                    <AccordionContent className="pl-9">
                      <div className="space-y-2 pt-2 border-t border-border">
                        <div className="text-sm text-muted-foreground">
                          <p>2 waivers required</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </ScrollArea>
          )}

          {/* Step 3: Payment Plans */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select the payment plans you want to include in the cloned program.
              </p>

              {/* Select All Header */}
              <div className="flex items-center gap-3 pb-3 mb-3 border-b border-border">
                <Checkbox
                  checked={allPlansSelected}
                  ref={(el) => {
                    if (el) {
                      (el as HTMLButtonElement & { indeterminate: boolean }).indeterminate = somePlansSelected
                    }
                  }}
                  onCheckedChange={toggleSelectAllPlans}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="font-medium text-foreground">Select All</span>
                <span className="text-sm text-muted-foreground">
                  ({paymentPlans.length} payment plan{paymentPlans.length === 1 ? "" : "s"})
                </span>
              </div>

              <ScrollArea className="h-[320px] pr-4">
                {paymentPlans.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    No payment plans available for this program.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Table Header */}
                    <div className="grid grid-cols-[auto_1fr_100px_100px_100px] gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b border-border">
                      <div className="w-6"></div>
                      <div>Name</div>
                      <div className="text-center"># Payments</div>
                      <div className="text-center">Interval Type</div>
                      <div className="text-center">Interval Count</div>
                    </div>

                    {paymentPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className={cn(
                          "grid grid-cols-[auto_1fr_100px_100px_100px] gap-4 items-center px-4 py-3 rounded-lg border transition-colors cursor-pointer",
                          selectedPlans.has(plan.id)
                            ? "border-primary/50 bg-primary/5 border-l-4 border-l-primary"
                            : "border-border hover:bg-muted/30"
                        )}
                        onClick={() => togglePlan(plan.id)}
                      >
                        <Checkbox
                          checked={selectedPlans.has(plan.id)}
                          onCheckedChange={() => togglePlan(plan.id)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <div className="text-sm text-foreground">{plan.name}</div>
                        <div className="text-sm text-foreground text-center">{plan.payments}</div>
                        <div className="text-sm text-foreground text-center">{plan.intervalType || "-"}</div>
                        <div className="text-sm text-foreground text-center">{plan.intervalCount}</div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Info Banner */}
              <div className="bg-[hsl(var(--info))] text-[hsl(var(--info-foreground))] rounded-md p-3 text-sm">
                {selectedPlans.size === 0
                  ? "No payment plans selected. The cloned program will not have payment plan options."
                  : `${selectedPlans.size} payment plan${selectedPlans.size === 1 ? "" : "s"} will be copied to the new program.`}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border relative z-50 bg-background">
          <div>
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep(step - 1)
                }}
              >
                Back
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            {step < 3 ? (
              <Button
                type="button"
                onClick={() => {
                  setStep(step + 1)
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  onFinish({
                    programData,
                    options,
                    selectedPaymentPlanIds: Array.from(selectedPlans),
                  })
                  onOpenChange(false)
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Finish
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


