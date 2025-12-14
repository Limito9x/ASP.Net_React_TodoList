import FileUploader from "../../components/FileUploader";
import FileList from "../../components/FileList";

export default function Asset({ planId }: { planId: string }) {
  return (
    <>
      <div style={{ padding: "24px" }}>
        <h1 style={{ marginBottom: 24 }}>My Assets</h1>
        <FileUploader planId={planId} onSuccess={() => {}} />
        <FileList planId={planId} />
      </div>
    </>
  );
}
