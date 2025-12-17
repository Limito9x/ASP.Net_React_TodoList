import { Button } from "antd";
import Input from "antd/es/input/Input";
import { useState } from "react";

export default function LinkCard() {
    const [url, setUrl] = useState<string | null>(null);

  return (
    <>
        <Input
        placeholder="Enter URL to embed"
        onPressEnter={(e) => setUrl((e.target as HTMLInputElement).value)}
        style={{ marginBottom: 16 }}
      />
      {url ? (
        <Button type="link" href={url} target="_blank" rel="noopener noreferrer">
          Url: {url}
          </Button>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 16,
          }}
        >
          No URL provided.
        </div>
      )}
    </>
  );
}