import React, { PropsWithChildren, useState } from "react";
import styles from "./Button.module.css";

type Props = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
};

export const Button = ({
  children,
  onClick,
  disabled = false,
  className,
}: PropsWithChildren<Props>) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    if (disabled) return;
    setIsPressed(true);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    setIsPressed(false);
    onClick?.(e);
  };
  return (
    <button
      className={`${styles.button} ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ cursor: disabled ? "auto" : "pointer" }}
    >
      <p
        className={styles.text}
        style={{
          top: isPressed ? "52%" : "45%",
          color: disabled ? "#5A1757" : "white",
        }}
      >
        {children}
      </p>
      {isPressed ? (
        <svg
          width="260"
          height="60"
          viewBox="0 0 260 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="260" height="60" fill="#8C4A89" />
          <rect x="15" y="9" width="240" height="45" fill="#C876C4" />
          <rect x="230" y="13" width="21" height="5" fill="#5A1757" />
          <rect
            x="246"
            y="32"
            width="14"
            height="5"
            transform="rotate(-90 246 32)"
            fill="#5A1757"
          />
          <rect
            x="246"
            y="41"
            width="5"
            height="5"
            transform="rotate(-90 246 41)"
            fill="#5A1757"
          />
          <rect
            x="19"
            y="50"
            width="14"
            height="5"
            transform="rotate(-90 19 50)"
            fill="#5A1757"
          />
          <rect x="24" y="45" width="9" height="5" fill="#5A1757" />
          <path d="M0 0H260L255 9H15L0 0Z" fill="#C876C4" />
        </svg>
      ) : (
        <svg
          className={styles.svg}
          width="260"
          height="60"
          viewBox="0 0 260 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="260" height="60" fill="#5A1757" />
          <rect x="4" y="4" width="240" height="45" fill="#8C4A89" />
          {!disabled && (
            <>
              <rect x="219" y="7" width="21" height="5" fill="#FAD2F8" />
              <rect
                x="235"
                y="26"
                width="14"
                height="5"
                transform="rotate(-90 235 26)"
                fill="#FAD2F8"
              />
              <rect
                x="235"
                y="35"
                width="5"
                height="5"
                transform="rotate(-90 235 35)"
                fill="#FAD2F8"
              />
              <rect
                x="8"
                y="46"
                width="14"
                height="5"
                transform="rotate(-90 8 46)"
                fill="#FAD2F8"
              />
              <rect x="13" y="41" width="9" height="5" fill="#FAD2F8" />
            </>
          )}

          <path d="M0 0H260L244 4H4L0 0Z" fill="#C876C4" />
        </svg>
      )}
    </button>
  );
};
