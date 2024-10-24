import { z } from "zod"
import { windowModule } from "./constants"
import {
  extensionMessage,
  messageBalanceRequest,
  messageBalanceUpdate,
  messageInternalCall,
  messageModuleCall,
  messagePromptAccept,
  messagePromptChoice,
  messagePromptReject,
  windowAck,
} from "./schemas/messages"

// Window module kind
export type WindowModuleKind = (typeof windowModule)[number]

// Message types
export type MessagePromptReject = z.infer<typeof messagePromptReject> // Rejecting a prompt from the popup
export type MessagePromptAccept = z.infer<typeof messagePromptAccept> // Accepting a prompt from the popup
export type MessagePromptChoice = z.infer<typeof messagePromptChoice> // Reject or accept a prompt from the popup
export type MessageModuleCall = z.infer<typeof messageModuleCall> // Calling a window injection method
export type MessageInternalCall = z.infer<typeof messageInternalCall> // Internal call from popup to background
export type MessageBalanceUpdate = z.infer<typeof messageBalanceUpdate> // Balance update from background to popup
export type MessageBalanceRequest = z.infer<typeof messageBalanceRequest> // Request balance from popup

// Any message
export type ExtensionMessage = z.infer<typeof extensionMessage>

// Window acknowledgement message
export type WindowAck = z.infer<typeof windowAck>
