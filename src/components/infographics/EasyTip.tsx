import type { ReactNode } from "react";

export default function EasyTip({
  title = "쉽게 말하면",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="info-tip">
      <p className="info-tip-title">{title}</p>
      <div className="info-tip-body">{children}</div>
    </div>
  );
}
