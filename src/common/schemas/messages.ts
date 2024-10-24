import { windowModule } from "@common/constants"
import { z } from "zod"

// Type of messages that can be passed to the window and background script
export const messageType = z.enum([
  "prompt",
  "internalCall",
  "methodCall",
  "balance",
  "balanceRequest",
])

// Base message schema
export const messageBase = z.object({
  type: messageType,
})

// Prompt rejection message
export const messagePromptReject = messageBase.extend({
  type: z.literal("prompt"),
  accept: z.literal(false),
  method: z.string(),
})

// Prompt Accepted message
export const messagePromptAccept = messageBase.extend({
  type: z.literal("prompt"),
  accept: z.literal(true),
  method: z.string(),
  params: z.any(),
})

// Prompt Choice message
export const messagePromptChoice = z.union([
  messagePromptReject,
  messagePromptAccept,
])

// Calling a method from the window injection
export const messageModuleCall = messageBase.extend({
  id: z.string(),
  type: z.literal("methodCall"),
  module: z.enum(windowModule),
  method: z.string(),
  params: z.any(),
  windowPos: z.tuple([z.number(), z.number()]),
})

// Calling a method from the popup
export const messageInternalCall = messageBase.extend({
  type: z.literal("internalCall"),
  method: z.string(),
  params: z.any(),
})

// Balance update
export const messageBalanceUpdate = messageBase.extend({
  type: z.literal("balance"),
  balance: z.number(),
})

// Request a balance update
export const messageBalanceRequest = messageBase.extend({
  type: z.literal("balanceRequest"),
})

// Any extension message type
export const extensionMessage = z.union([
  messagePromptReject,
  messagePromptAccept,
  messageModuleCall,
  messageInternalCall,
  messageBalanceUpdate,
  messageBalanceRequest,
])

// Window ack message
export const windowAck = z.object({
  request: messageModuleCall,
  response: z.union([
    z.object({
      success: z.literal(false),
      message: z.string(),
    }),
    z.object({
      success: z.literal(true),
      data: z.any(),
    }),
  ]),
})
