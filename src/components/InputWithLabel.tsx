import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InputWithLabelProps {
  label: string
  id: string
  type?: string
  placeholder?: string
  value?: string
}

export function InputWithLabel({
  label,
  placeholder,
  id,
  type,
  value,
}: InputWithLabelProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">{label}</Label>
      <Input
        type={type}
        required
        id={id}
        value={value}
        placeholder={placeholder}
      />
    </div>
  )
}
