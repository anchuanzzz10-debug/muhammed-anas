import { ImageResponse } from "next/og";
import { services, site } from "@/content/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0A0A0A",
          color: "#F4F4F5",
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(0,123,167,0.45), transparent 45%), radial-gradient(circle at 90% 90%, rgba(255,45,149,0.35), transparent 45%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: "#A1A1AA" }}>{site.initials}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 110, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{site.name}</div>
          <div style={{ display: "flex", fontSize: 36, color: "#2AA6D6" }}>{site.jobTitle}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {services.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  fontSize: 22,
                  padding: "8px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#E4E4E7",
                }}
              >
                {s.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
