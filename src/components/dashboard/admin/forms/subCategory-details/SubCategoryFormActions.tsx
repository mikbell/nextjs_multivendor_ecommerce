import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

interface SubCategoryFormActionsProps {
  isLoading?: boolean;
  onCancel?: () => void;
}

const SubCategoryFormActions: FC<SubCategoryFormActionsProps> = ({ 
  isLoading = false,
  onCancel 
}) => {
  const router = useRouter();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <>
      <Separator className="my-6" />
      
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
        >
          Annulla
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          size="default"
        >
          {isLoading ? "Salvataggio..." : "Salva sottocategoria"}
        </Button>
      </div>
    </>
  );
};

export default SubCategoryFormActions;