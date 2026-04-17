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
import { Check } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
  includeSessionBlocks: boolean
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
    includeSessionBlocks: true,
    includeWaitlistSettings: true,
    includeCustomFields: true,
    includeNotifications: true,
    includeWaivers: true,
  })
  const [selectedPlans, setSelectedPlans] = React.useState<Set<string>>(new Set())

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
        includeSessionBlocks: true,
        includeWaitlistSettings: true,
        includeCustomFields: true,
        includeNotifications: true,
        includeWaivers: true,
      })

      setSelectedPlans(new Set())
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

  const somePlansSelected = selectedPlans.size > 0 && selectedPlans.size < paymentPlans.length



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
          {[1, 2].map((s) => (
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
                  {s === 1 ? "Basic Info" : "Options"}
                </span>
              </div>
              {s < 2 && (
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
                    <Label htmlFor="title" className="text-foreground">
                      <span className="text-destructive">*</span> Title
                    </Label>
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

                {/* End Time and Registration Start Date Row */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="text-foreground">
                      End time
                    </Label>
                    <Input
                      id="endTime"
                      value={programData.endTime}
                      onChange={(e) => handleInputChange("endTime", e.target.value)}
                      placeholder="YYYY-MM-DD HH:MM AM/PM"
                      className="bg-background"
                    />
                    <p className="text-xs text-muted-foreground">
                      Date and Time this camp/clinic/class is expected to end
                    </p>
                  </div>
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
                </div>

                {/* Registration Deadline Row */}
                <div className="grid grid-cols-2 gap-6">
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
                        includeSessionBlocks: !allChecked,
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

                  {/* Session Blocks Accordion */}
                  <AccordionItem value="sessionBlocks" className="border rounded-lg px-4 mb-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={options.includeSessionBlocks}
                        onCheckedChange={() => handleOptionToggle("includeSessionBlocks")}
                        onClick={(e) => e.stopPropagation()}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <AccordionTrigger className="flex-1 hover:no-underline">
                        <div>
                          <span className="font-medium text-foreground">Session Blocks</span>
                          <p className="text-xs text-muted-foreground font-normal">
                            Copy session block groupings and pricing
                          </p>
                        </div>
                      </AccordionTrigger>
                    </div>
                    <AccordionContent className="pl-9">
                      <div className="space-y-2 pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-2">3 session blocks available:</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-muted/30 px-3 py-2 rounded border-l-4 border-l-primary">
                            <span className="text-sm font-medium">Test Session</span>
                            <span className="text-xs text-muted-foreground">1 session - $20.00</span>
                          </div>
                          <div className="flex items-center justify-between bg-muted/30 px-3 py-2 rounded border-l-4 border-l-primary">
                            <span className="text-sm font-medium">Week 1</span>
                            <span className="text-xs text-muted-foreground">5 sessions - $80.00</span>
                          </div>
                          <div className="flex items-center justify-between bg-muted/30 px-3 py-2 rounded border-l-4 border-l-primary">
                            <span className="text-sm font-medium">Week 2</span>
                            <span className="text-xs text-muted-foreground">5 sessions - $80.00</span>
                          </div>
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
                  <AccordionItem value="waivers" className="border rounded-lg px-4 mb-3">
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

                  {/* Payment Plans */}
                  <AccordionItem value="paymentPlans" className="border rounded-lg px-4 mb-3 border-b">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedPlans.size > 0}
                        ref={(el) => {
                          if (el) {
                            (el as HTMLButtonElement & { indeterminate: boolean }).indeterminate = somePlansSelected
                          }
                        }}
                        onCheckedChange={() => {
                          if (selectedPlans.size > 0) {
                            setSelectedPlans(new Set())
                          } else {
                            setSelectedPlans(new Set(paymentPlans.map((plan) => plan.id)))
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <AccordionTrigger className="flex-1 hover:no-underline">
                        <div>
                          <span className="font-medium text-foreground">Payment Plans</span>
                          <p className="text-xs text-muted-foreground font-normal">
                            {selectedPlans.size === 0
                              ? `Select payment plans to copy (${paymentPlans.length} available)`
                              : `${selectedPlans.size} of ${paymentPlans.length} payment plan${selectedPlans.size === 1 ? "" : "s"} selected`}
                          </p>
                        </div>
                      </AccordionTrigger>
                    </div>
                    <AccordionContent className="pl-9">
                      <div className="space-y-3 pt-2 border-t border-border">
                        {paymentPlans.length === 0 ? (
                          <div className="text-sm text-muted-foreground py-2">
                            No payment plans available for this program.
                          </div>
                        ) : (
                          <>
                            {/* Table Header */}
                            <div className="grid grid-cols-[auto_1fr_80px_80px_80px] gap-3 px-2 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                              <div className="w-5"></div>
                              <div>Name</div>
                              <div className="text-center"># Payments</div>
                              <div className="text-center">Interval</div>
                              <div className="text-center">Count</div>
                            </div>

                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                              {paymentPlans.map((plan) => (
                                <div
                                  key={plan.id}
                                  className={cn(
                                    "grid grid-cols-[auto_1fr_80px_80px_80px] gap-3 items-center px-2 py-2 rounded-md border transition-colors cursor-pointer",
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
                          </>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </ScrollArea>
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
            {step < 2 ? (
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


