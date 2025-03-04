import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface TooltipInfoProps {
  infoTexts: string[];
}

const TooltipInfo: React.FC<TooltipInfoProps> = ({ infoTexts }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-5 w-5 text-gray-500 cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <ul className="text-sm">
            {infoTexts.map((text, index) => (
              <li key={index}>• {text}</li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipInfo;
