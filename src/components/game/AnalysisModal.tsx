import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain } from "lucide-react";

interface AnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    analysis: string;
    title: string;
}

export function AnalysisModal({ isOpen, onClose, analysis, title }: AnalysisModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-blue-400" />
                        AI Analysis: {title}
                    </DialogTitle>
                    <DialogDescription>
                        Strategic insights and evaluation
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                    <div className="space-y-4 py-4 text-gray-200">
                        {analysis.split('\n').map((paragraph, index) => (
                            <p key={index} className="leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}