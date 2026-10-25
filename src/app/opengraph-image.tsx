import { ImageResponse } from "next/og";
import { services, site } from "@/content/site";
import { monogram } from "@/components/ui/Logo";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logo = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
    <defs>
      <linearGradient id="r" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#007BA7"/><stop offset="1" stop-color="#FF2D95"/></linearGradient>
      <linearGradient id="g" x1="6" x2="34" y1="0" y2="0" gradientUnits="userSpaceOnUse"><stop offset=".5" stop-color="#fff"/><stop offset=".5" stop-color="#1A9BCB"/><stop offset="1" stop-color="#FF2D95"/></linearGradient>
      <clipPath id="c"><rect width="40" height="${monogram.baseline}"/></clipPath>
    </defs>
    <circle cx="20" cy="20" r="20" fill="url(#r)"/>
    <circle cx="20" cy="20" r="19" fill="#0A0A0A"/>
    <g fill="none" stroke="url(#g)" stroke-width="2.75" stroke-miterlimit="4" transform="translate(20 20) scale(.78) translate(-20 -20)">
      <path d="${monogram.stroke}" clip-path="url(#c)"/>
      <path d="${monogram.crossbar}"/>
    </g>
  </svg>`,
)}`;

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
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={logo} width={72} height={72} />
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
