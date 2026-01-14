import TrainSearchPage from "~/pages/trains/trainSearchPage";
import { useParams, useNavigate, useSearchParams } from "react-router";

export default function TransportRoute() {
  const [search, setSearch] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  return (
    <TrainSearchPage
      city={params.city}
      from={search.get("from")}
      to={search.get("to")}
      time={search.get("time")}
    />
  );
}
