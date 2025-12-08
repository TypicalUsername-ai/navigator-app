import TransportSearchPage from "~/pages/transport/transportSearchPage";
import { useParams, useNavigate, useSearchParams } from "react-router";

export default function TransportRoute() {
  const [search, setSearch] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  return (
    <TransportSearchPage
      city={params.city}
      from={search.get("from")}
      to={search.get("to")}
      time={search.get("time")}
    />
  );
}
