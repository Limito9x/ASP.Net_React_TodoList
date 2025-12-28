import { Tabs } from "antd";
import PhaseRoutineTab from "./PhaseRoutine";
import PhaseSingleTaskTab from "./PhaseSingleTask";
import { useParams } from "react-router-dom";
import { phaseService } from "../../services/phaseService";
import { useQuery } from "@tanstack/react-query";

export default function PhasePage() {
  const { phaseId } = useParams<{ phaseId: string }>();
  const {
    data: phase,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["phase", phaseId],
    queryFn: () => phaseService.getPhaseById(phaseId!),
  });

  const goalsOptions =
    phase?.goals
      .filter((goal) => goal.id !== undefined)
      .map((goal) => ({
        label: goal.name,
        value: goal.id!,
      })) || [];

  const items = [
    {
      key: "single-tasks",
      label: "Single Tasks",
      children: (
        <PhaseSingleTaskTab phase={phase} goalsOptions={goalsOptions} phaseId={phaseId}/>
      ),
    },
    {
      key: "routine",
      label: "Routines",
      children: <PhaseRoutineTab phase={phase} goalsOptions={goalsOptions} phaseId={phaseId} />,
    },
  ];

  return (
    <>
      <h2>{phase?.title}</h2>
      <Tabs items={items} />
    </>
  );
}
