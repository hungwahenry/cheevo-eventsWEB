import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "cheevo for organisers — sell tickets, get paid, move on"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "96px",
          background: "#0a0a0a",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 64,
            height: 8,
            borderRadius: 4,
            background: "#f15a22",
            marginBottom: 40,
          }}
        />
        <div
          style={{
            fontSize: 120,
            fontWeight: 800,
            letterSpacing: "-0.05em",
            color: "#ffffff",
          }}
        >
          cheevo
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 500,
            color: "#a1a1aa",
            marginTop: 16,
          }}
        >
          Sell tickets, get paid, move on.
        </div>
      </div>
    ),
    { ...size }
  )
}
