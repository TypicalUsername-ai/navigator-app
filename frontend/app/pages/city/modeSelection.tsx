import { useNavigate, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import TicketDrawer from "~/components/ticketDrawer";
import BackButton from "~/components/BackButton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export default function ModeSelectionPage() {
  const params = useParams();
  const buttonSize = "lg";
  const classes = "p-1 m-1 w-full max-w-64";
  const navigate = useNavigate();
  return (
    <div className="relative flex h-screen flex-grow flex-col items-center justify-around">
      <div className="absolute top-4 left-4 z-10">
        <BackButton onClick={() => navigate("/city")} />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">{params.city},</h1>
        <h1 className="text-xl font-semibold"> How are we traveling today? </h1>
      </div>
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => navigate("parking")}
              size={buttonSize}
              className={classes}
            >
              Parking
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            See available parking spaces and pay parking tickets
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => navigate("transport")}
              size={buttonSize}
              className={classes}
            >
              City transport
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Look for buses and trams in {params.city} and buy transport tickets
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => navigate("trains")}
              size={buttonSize}
              className={classes}
            >
              Trains
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Search train connections and get train tickets
          </TooltipContent>
        </Tooltip>
      </div>
      <TicketDrawer />
    </div>
  );
}
