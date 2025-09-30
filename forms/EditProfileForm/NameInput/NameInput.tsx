import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { editProfileSchemaType } from "@/lib/types";
import { useFormContext } from "react-hook-form";

const NameInput = () => {
  const form = useFormContext<editProfileSchemaType>();
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
export default NameInput;
