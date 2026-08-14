import { Drafts } from "./components/drafts";
import { GitHub } from "./components/github";
import { Header } from "./components/header";
import { Tasks } from "./components/tasks";
import { Today } from "./components/today";

export const dynamic = "force-dynamic";

const Home = () => (
  <div className="flex min-h-screen w-screen flex-col p-6 gap-6 md:h-screen">
    <Header />
    <div className="flex flex-col gap-4 md:flex-row">
      <Drafts />
      <Today />
    </div>
    <Tasks />
    <GitHub />
  </div>
);

export default Home;
