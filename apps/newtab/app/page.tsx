import { Drafts } from "./components/drafts";
import { Header } from "./components/header";
import { Tasks } from "./components/tasks";
import { Today } from "./components/today";

export const dynamic = "force-dynamic";

const Home = () => (
  <div className="flex h-screen w-screen flex-col p-6 gap-6">
    <Header />
    <div className="flex flex-col gap-4 md:flex-row">
      <Drafts />
      <Today />
    </div>
    <Tasks />
  </div>
);

export default Home;
