import type { CSSProperties } from "react";
import type { ConnectionNodeData } from "@/lib/site";
import styles from "./ConnectionNode.module.css";

/**
 * Un nodo del sistema. La posición viaja como custom properties para poder
 * tener coordenadas distintas en desktop y mobile sin duplicar el DOM.
 */
export default function ConnectionNode({ node }: { node: ConnectionNodeData }) {
  const style = {
    "--x": `${node.desktop.x}%`,
    "--y": `${node.desktop.y}%`,
    "--xm": `${node.mobile.x}%`,
    "--ym": `${node.mobile.y}%`,
    "--dx": `${node.drift.x}px`,
    "--dy": `${node.drift.y}px`,
  } as CSSProperties;

  return (
    <div className={styles.anchor} style={style}>
      <span className={styles.label} data-node={node.id}>
        {node.label}
      </span>
    </div>
  );
}
