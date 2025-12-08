import TrainsPage from "~/pages/trains/trains";
import { useParams, useNavigate, createSearchParams } from "react-router";

export default function TrainsRoute() {
  const encodeSearch = (from: string, to: string, time: string) => {
    let ps = createSearchParams({
      from: from,
      to: to,
      time: time,
    });
    return ps.toString();
  };
  const params = useParams();
  const navigate = useNavigate();

  return (
    <TrainsPage
      city={params.city}
      onSearch={(start, end, time) =>
        navigate({ pathname: "search", search: encodeSearch(start, end, time) })
      }
    />
  );
}
