import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { editProfileSchemaType } from "@/lib/types"
import { useFormContext } from "react-hook-form"

const UsernameInput = () => {
    const form = useFormContext<editProfileSchemaType>()
  return (
    <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username<span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
  )
}
export default UsernameInput