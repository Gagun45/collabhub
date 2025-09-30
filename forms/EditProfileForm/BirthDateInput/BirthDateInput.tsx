import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { editProfileSchemaType } from "@/lib/types";
import { format } from "date-fns";
import { useFormContext } from "react-hook-form";

const BirthDateInput = () => {
  const form = useFormContext<editProfileSchemaType>();
  return (
    <FormField
      control={form.control}
      name="birthDate"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Date</FormLabel>
          <FormControl>
            <Input
              type="date"
              value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
              onChange={(e) => {
                const value = e.target.value ? new Date(e.target.value) : null;
                field.onChange(value);
              }}
            />
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
    />
  );
};
export default BirthDateInput;
