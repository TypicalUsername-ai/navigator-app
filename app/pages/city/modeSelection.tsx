import { useNavigate, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import TicketDrawer from "~/components/ticketDrawer";

export default function ModeSelectionPage() {
  const params = useParams();
  const buttonSize = "lg";
  const classes = "p-1 m-1 w-full max-w-64";
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-grow flex-col justify-around items-center">
      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-3xl">{params.city},</h1>
        <h1 className="font-semibold text-xl"> How are we traveling today? </h1>
      </div>
      <div>
        <Button
          onClick={() => navigate("parking")}
          size={buttonSize}
          className={classes}
        >
          Parking
        </Button>
        <Button
          onClick={() => navigate("transport")}
          size={buttonSize}
          className={classes}
        >
          City transport
        </Button>
        <Button
          onClick={() => navigate("trains")}
          size={buttonSize}
          className={classes}
        >
          Trains
        </Button>
      </div>
      <TicketDrawer />
    </div>
  );
}
