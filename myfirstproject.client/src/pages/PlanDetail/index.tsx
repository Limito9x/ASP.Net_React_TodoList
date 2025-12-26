import { Tabs } from "antd";
import TaskPage from "./PlanPhaseList";
import Asset from "./PlanAsset";
import { useParams } from "react-router-dom";

export default function TaskIndexPage() {
  const { planId } = useParams<{ planId: string }>();

  const items = [
    {
      key: "tasks",
      label: "Tasks",
      children: <TaskPage planId={planId} />,
    },
    {
      key: "assets",
      label: "Assets",
      children: <Asset planId={planId!} />,
    },
  ];
  return <Tabs defaultActiveKey="tasks" items={items} />;
}
