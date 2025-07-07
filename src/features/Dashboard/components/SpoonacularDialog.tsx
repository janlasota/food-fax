import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

interface SpoonacularDialogProps {
  open: boolean;
  handleCancel: () => void;
  handleYes: () => void;
}

const SpoonacularDialog = ({
  open,
  handleCancel,
  handleYes,
}: SpoonacularDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to disable Spoonacular API?
          </DialogTitle>
          <DialogDescription>
            This will remove all data fetched from Spoonacular. You'll need to
            fetch data from the API again. Keep in mind the Spoonacular free
            tier has a limit of 150 requests per day.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={handleYes}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SpoonacularDialog;
