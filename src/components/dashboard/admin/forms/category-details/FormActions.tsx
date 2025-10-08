import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Save, X, Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FormActionsProps } from "./types";

const FormActions: FC<FormActionsProps> = ({ 
  isLoading = false,
  data,
  onCancel,
  onSubmit 
}) => {
  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const isEditMode = Boolean(data?.id);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/dashboard/admin/categories");
    }
  };

  const handleCancelClick = () => {
    // Show confirmation dialog only if not loading
    if (!isLoading) {
      setShowCancelDialog(true);
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    handleCancel();
  };

  return (
    <div className="sticky bottom-0 z-20 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Left side - Form info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isLoading 
                  ? 'bg-yellow-500 animate-pulse' 
                  : 'bg-green-500'
              }`} />
              <span className="text-sm text-muted-foreground">
                {isLoading ? (
                  "Salvataggio in corso..."
                ) : isEditMode ? (
                  "Modifica categoria esistente"
                ) : (
                  "Creazione nuova categoria"
                )}
              </span>
            </div>
            {data?.name && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-full">
                <span className="text-xs font-medium text-muted-foreground truncate max-w-48">
                  {data.name}
                </span>
              </div>
            )}
          </div>
          
          {/* Right side - Actions */}
          <div className="flex items-center gap-3">
            {/* Cancel Button with Confirmation */}
            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelClick}
                  disabled={isLoading}
                  className="flex items-center gap-2 hover:bg-destructive/10 hover:border-destructive/20"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Annulla</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Conferma annullamento
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Sei sicuro di voler annullare? {isEditMode ? "Le modifiche non salvate andranno perse." : "I dati inseriti andranno persi."}
                    <br />
                    <span className="font-medium mt-2 inline-block">Questa azione non può essere annullata.</span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Continua modifica</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={confirmCancel}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Sì, annulla
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            {/* Save/Update Button */}
            <Button
              type="button"
              onClick={(e) => onSubmit?.(e)}
              disabled={isLoading}
              size="lg"
              className="font-semibold px-6 sm:px-8 flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Salvataggio...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>
                    {isEditMode ? "Aggiorna categoria" : "Crea categoria"}
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Loading progress indicator */}
        {isLoading && (
          <div className="mt-4">
            <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {isEditMode ? "Aggiornamento categoria in corso..." : "Creazione categoria in corso..."}
            </p>
          </div>
        )}
        
        {/* Quick tips */}
        {!isLoading && (
          <div className="mt-4 flex items-center justify-center">
            <p className="text-xs text-muted-foreground text-center flex items-center gap-1">
              <span>💡</span>
              <span className="hidden sm:inline">
                {isEditMode 
                  ? "Le modifiche verranno applicate immediatamente dopo il salvataggio"
                  : "Assicurati di aver compilato tutti i campi essenziali prima di salvare"
                }
              </span>
              <span className="sm:hidden">
                {isEditMode ? "Modifica salvata istantaneamente" : "Controlla i campi essenziali"}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormActions;