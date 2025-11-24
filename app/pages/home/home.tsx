import { useNavigate } from "react-router";
import EmptyCity from "~/components/emptyCity";

export default function Index() {
  const navigate = useNavigate();
  return (
    <div>
      <EmptyCity
        onLogin={() => navigate("/login")}
        onCitySelect={() => navigate("/city")}
      />
    </div>
  );
}
