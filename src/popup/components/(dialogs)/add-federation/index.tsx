import Button from "@/common/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/common/ui/dialog"
import Flex from "@/common/ui/flex"
import Input from "@/common/ui/input"
import Text from "@/common/ui/text"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { useState } from "react"

export default function AddFederation() {
  const [invite, setInvite] = useState("")

  const handlePaste = () => {
    navigator.clipboard.readText().then(setInvite)
  }

  const handleJoin = () => {
    
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader title="Add Federation" />
        <Flex col gap={2} grow>
          <Text asChild>
            <label>Federation Inite Code</label>
          </Text>
          <Input
            placeholder="fed1..."
            value={invite}
            onChange={e => setInvite(e.target.value)}
          />
          <Button variant="secondary" size="small" onClick={handlePaste}>Paste</Button>
        </Flex>
        <Button onClick={handleJoin}>Join</Button>
      </DialogContent>
    </Dialog>
  )
}
