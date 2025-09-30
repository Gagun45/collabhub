import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { editProfileSchemaType } from "@/lib/types";
import { useFormContext } from "react-hook-form";

const BioInput = () => {
  const form = useFormContext<editProfileSchemaType>();
  return (
    <FormField
      control={form.control}
      name="bio"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bio</FormLabel>
          <FormControl>
            <Textarea {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
export default BioInput;
