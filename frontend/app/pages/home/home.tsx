import { useNavigate } from "react-router";
import EmptyCity from "~/components/emptyCity";

export default function Index() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen flex flex-col items-center">
      <EmptyCity
        onLogin={() => navigate("/login")}
        onCitySelect={() => navigate("/city")}
      />
    </div>
  );
}
