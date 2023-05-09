import { useCanvasSize } from "@/hooks/useCanvasSize";
import React from "react";

type Props = {
  xPos: number;
  yPos: number;
  id: number;
  height: number;
  width: number;
  type: string;
};

export const Reward = ({ xPos, yPos, height, width, type }: Props) => {
  const canvasSize = useCanvasSize();
  const displayRatio = canvasSize / 500;

  return (
    <svg
      style={{
        left: `${xPos * displayRatio}px`,
        top: `${yPos * displayRatio}px`,
        width: `${width * displayRatio}px`,
        height: `${height * displayRatio}px`,
      }}
      viewBox="0 0 110 111"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M54 0H46V2H36V5H26V10H21V15H16V20H11V25H6V35H3V45H0V55V65H3V75H6V85H11V90H16V95H21V100H26V105H36V108H46V111H54H56H64V108H74V105H84V100H89V95H94V90H99V85H104V75H107V65H110V55V45H107V35H104V25H99V20H94V15H89V10H84V5H74V2H64V0H56H54ZM84 10V15H89V20H94V25H99V35H102V45H105V55V65H102V75H99V85H94V90H89V95H84V100H74V103H64V106H56H54H46V103H36V100H26V95H21V90H16V85H11V75H8V65H5V55V45H8V35H11V25H16V20H21V15H26V10H36V7H46V5H54H56H64V7H74V10H84Z"
        fill="#8D722A"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M46 5H64V7H74V10H84V15H89V20H94V25H99V35H102V45H105V65H102V75H99V85H94V90H89V95H84V100H74V103H64V106H46V103H36V100H26V95H21V90H16V85H11V75H8V65H5V45H8V35H11V25H16V20H21V15H26V10H36V7H46V5Z"
        fill="#EEB931"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M79 15H69V20H79V25H84V35H89V40H94V35H89V25H84V20H79V15ZM94 45H99V50H94V45ZM26 90H31V95H41V90H31V85H26V75H21V70H16V75H21V85H26V90ZM11 65H16V60H11V65ZM60 60H65V65H60V60ZM50 50V60H60V50H50ZM50 50H45V45H50V50Z"
        fill="#FFEFC5"
      />
    </svg>
  );
};
