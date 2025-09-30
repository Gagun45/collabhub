import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { editProfileSchemaType } from "@/lib/types";
import { useFormContext } from "react-hook-form";

const LocationInput = () => {
  const form = useFormContext<editProfileSchemaType>();
  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
export default LocationInput;
