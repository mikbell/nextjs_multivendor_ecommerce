"use client";

import { FC } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, TrendingUp, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormProgressProps } from "../types";
import { getProgressMessage, getProgressColor, getProgressBadge } from "../utils";
import { PROGRESS_THRESHOLDS } from "../constants";

export const FormProgress: FC<FormProgressProps> = ({
	formProgress,
	isEditMode,
}) => {
	const getProgressIcon = (progress: number) => {
		if (progress >= PROGRESS_THRESHOLDS.EXCELLENT) return <CheckCircle className="h-5 w-5 text-green-600" />;
		if (progress >= PROGRESS_THRESHOLDS.GOOD) return <Zap className="h-5 w-5 text-yellow-600" />;
		if (progress >= PROGRESS_THRESHOLDS.FAIR) return <TrendingUp className="h-5 w-5 text-blue-600" />;
		if (progress >= PROGRESS_THRESHOLDS.POOR) return <Target className="h-5 w-5 text-orange-600" />;
		return <AlertCircle className="h-5 w-5 text-red-600" />;
	};

	const getSuggestions = (progress: number) => {
		const suggestions = [];
		if (progress < PROGRESS_THRESHOLDS.MINIMAL) suggestions.push("Inserisci il nome della categoria");
		if (progress < PROGRESS_THRESHOLDS.POOR) suggestions.push("Aggiungi una descrizione dettagliata");
		if (progress < PROGRESS_THRESHOLDS.FAIR) suggestions.push("Carica un'immagine rappresentativa");
		if (progress < PROGRESS_THRESHOLDS.GOOD) suggestions.push("Controlla slug e URL");
		if (progress < PROGRESS_THRESHOLDS.EXCELLENT) suggestions.push("Verifica tutte le impostazioni");
		return suggestions;
	};

	const badge = getProgressBadge(formProgress);
	const suggestions = getSuggestions(formProgress);

	return (
		<div className="bg-background/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6 hover:shadow-xl transition-all duration-300">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-3">
					{getProgressIcon(formProgress)}
					<div>
						<h3 className="text-lg font-bold text-foreground">
							{isEditMode ? "Modifica Categoria" : "Progresso Creazione"}
						</h3>
						<p className="text-sm text-muted-foreground">
							{getProgressMessage(formProgress)}
						</p>
					</div>
				</div>
				<Badge className={cn("px-3 py-1", badge.class)}>
					{badge.text}
				</Badge>
			</div>

			<div className="space-y-3">
				<div className="flex justify-between items-center">
					<span className="text-sm font-medium text-muted-foreground">
						Completamento
					</span>
					<span className="text-sm font-bold text-foreground">
						{formProgress}%
					</span>
				</div>
				
				<div className="relative">
					<Progress 
						value={formProgress} 
						className="h-3 bg-muted"
					/>
					<div 
						className={cn(
							"absolute top-0 left-0 h-3 rounded-full transition-all duration-500",
							getProgressColor(formProgress)
						)}
						style={{ width: `${formProgress}%` }}
					/>
				</div>

				{/* Progress milestones */}
				<div className="flex justify-between text-xs text-muted-foreground mt-2">
					<span className={formProgress >= PROGRESS_THRESHOLDS.MINIMAL ? "text-primary font-medium" : ""}>
						Base
					</span>
					<span className={formProgress >= PROGRESS_THRESHOLDS.POOR ? "text-primary font-medium" : ""}>
						Contenuto
					</span>
					<span className={formProgress >= PROGRESS_THRESHOLDS.FAIR ? "text-primary font-medium" : ""}>
						Media
					</span>
					<span className={formProgress >= PROGRESS_THRESHOLDS.GOOD ? "text-primary font-medium" : ""}>
						Optimal
					</span>
					<span className={formProgress >= PROGRESS_THRESHOLDS.EXCELLENT ? "text-primary font-medium" : ""}>
						Pronto
					</span>
				</div>

				{suggestions.length > 0 && (
					<div className="flex items-start gap-2 mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
						<AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
						<div className="text-sm text-blue-800">
							<p className="font-medium mb-1">Prossimi passi suggeriti:</p>
							<ul className="text-xs space-y-0.5 text-blue-700">
								{suggestions.map((suggestion, index) => (
									<li key={index}>• {suggestion}</li>
								))}
							</ul>
						</div>
					</div>
				)}

				{formProgress >= PROGRESS_THRESHOLDS.EXCELLENT && (
					<div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
						<div className="flex items-start gap-3">
							<CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
							<div>
								<p className="text-sm font-medium text-green-800 mb-1">
									Perfetto! Categoria completa
								</p>
								<p className="text-xs text-green-700">
									La categoria è ottimizzata e pronta per essere salvata. Tutti i campi sono stati compilati correttamente.
								</p>
							</div>
						</div>
					</div>
				)}

				{formProgress >= PROGRESS_THRESHOLDS.GOOD && formProgress < PROGRESS_THRESHOLDS.EXCELLENT && (
					<div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
						<div className="flex items-center gap-2">
							<Zap className="h-4 w-4 text-yellow-600" />
							<p className="text-sm font-medium text-yellow-800">
								Quasi perfetta! Completa gli ultimi dettagli.
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
