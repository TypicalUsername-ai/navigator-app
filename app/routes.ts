import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"), // Home page
  route("welcome", "routes/welcome.tsx"), //onboarding / welcome page
  ...prefix(":city", [
    index("routes/city.tsx"), // transport mdoe selection
    route("parking", "routes/parking.tsx"), // parking page
    route("transport", "routes/transport.tsx"), // public transport page
    route("transport/search", "routes/transportSearch.tsx"), // search page (maybe for both transport and trains)
    route("trains", "routes/trains.tsx"), // train selection page
  ]),
] satisfies RouteConfig;
