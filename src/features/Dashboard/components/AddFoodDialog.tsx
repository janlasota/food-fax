import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Category, type Food } from "../../../types";

interface AddFoodDialogProps {
  open: boolean;
  handleClose: () => void;
  handleAdd: (food: Food) => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  category: z.nativeEnum(Category),
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  servingSize: z.number().min(0),
  image: z.string().optional(),
});

const AddFoodDialog = ({
  open,
  handleClose,
  handleAdd,
}: AddFoodDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: Category.Protein,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      servingSize: 0,
      image: "",
    },
  });

  const onClose = () => {
    form.reset();
    handleClose();
  };

  const onSubmit = () => {
    if (form.formState.isValid) {
      handleAdd({
        ...form.getValues(),
        id: crypto.randomUUID(),
      });
      onClose();
    } else {
      form.trigger();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Add a custom food</DialogTitle>
              <DialogDescription>
                Fill out the form below to create your own food to view in Food
                Details.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          // Clear error state when user types
                          if (form.formState.errors.name) {
                            form.clearErrors("name");
                          }
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Category).map((category) => (
                            <SelectItem
                              value={category}
                              className="cursor-pointer"
                            >
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="calories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calories</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={0} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="protein"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Protein</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={0} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="carbs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carbs</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={0} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fat</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={0} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="servingSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serving size</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={0} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="cursor-pointer"
                onClick={onSubmit}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export default AddFoodDialog;
