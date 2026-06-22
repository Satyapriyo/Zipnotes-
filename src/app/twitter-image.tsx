// Reuses the same OG artwork for Twitter/X card previews.
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: "#020617",
                    padding: "64px",
                    fontFamily: "sans-serif",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: "linear-gradient(to right, #bef264, #a3e635, transparent)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: "-80px",
                        left: "-80px",
                        width: "400px",
                        height: "400px",
                        borderRadius: "50%",
                        background: "rgba(190,242,100,0.12)",
                        filter: "blur(80px)",
                    }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            background: "#bef264",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "26px",
                        }}
                    >
                        ⚡
                    </div>
                    <span
                        style={{
                            fontSize: "28px",
                            fontWeight: 700,
                            color: "#ffffff",
                            letterSpacing: "-0.5px",
                        }}
                    >
                        ZipNotes
                    </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <p
                        style={{
                            fontSize: "13px",
                            color: "#bef264",
                            margin: 0,
                            fontFamily: "monospace",
                            letterSpacing: "0.05em",
                        }}
                    >
                        write anywhere
                    </p>
                    <h1
                        style={{
                            fontSize: "64px",
                            fontWeight: 700,
                            color: "#ffffff",
                            lineHeight: 1.05,
                            margin: 0,
                            letterSpacing: "-1.5px",
                            maxWidth: "900px",
                        }}
                    >
                        Simple cloud notes that work where Notion is blocked.
                    </h1>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <span style={{ fontSize: "18px", color: "#64748b" }}>
                        zipnotes.online
                    </span>
                    <span
                        style={{
                            fontSize: "15px",
                            color: "#0f172a",
                            background: "#bef264",
                            borderRadius: "999px",
                            padding: "10px 24px",
                            fontWeight: 600,
                        }}
                    >
                        Free beta — 100 spots
                    </span>
                </div>
            </div>
        ),
        { ...size }
    );
}
