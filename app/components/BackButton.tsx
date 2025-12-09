import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function BackButton({ onClick, className = "" }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className={`flex items-center gap-2 p-2 text-sm sm:p-2.5 sm:text-base md:p-3 ${className}`}
    >
      <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      <span className="hidden sm:inline">Back</span>
    </Button>
  );
}

