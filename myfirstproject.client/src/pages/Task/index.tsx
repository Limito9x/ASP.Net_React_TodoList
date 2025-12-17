import EmbeddedWeb from "../../components/Widgets/LinkCard";
import { useParams } from "react-router-dom";

export default function Task() {
    const { planId, taskId } = useParams<{ planId: string; taskId: string }>();
  return (
    <div>
      Task Page for Plan ID: {planId} and Task ID: {taskId}
      <EmbeddedWeb />
    </div>
  );
}
