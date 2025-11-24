import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";

export default function ModeSelectionPage() {
  const buttonSize = "lg";
  const classes = "p-1 m-1 w-full max-w-64";
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center">
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
  );
}
