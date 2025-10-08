import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

interface FormActionsProps {
  isLoading?: boolean;
  onCancel?: () => void;
  cancelText?: string;
  submitText?: string;
  loadingText?: string;
  showSeparator?: boolean;
  className?: string;
  disabled?: boolean;
}

const FormActions: FC<FormActionsProps> = ({
  isLoading = false,
  onCancel,
  cancelText = "Annulla",
  submitText = "Salva",
  loadingText = "Salvataggio...",
  showSeparator = true,
  className = "",
  disabled = false,
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
      {showSeparator && <Separator className="my-6" />}
      
      <div className={`flex justify-end gap-3 ${className}`}>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading || disabled}
        >
          {cancelText}
        </Button>
        <Button
          type="submit"
          disabled={isLoading || disabled}
          size="default"
        >
          {isLoading ? loadingText : submitText}
        </Button>
      </div>
    </>
  );
};

export default FormActions;