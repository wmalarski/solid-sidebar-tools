import type { Component, ComponentProps } from "solid-js";

export const PocketKnifeIcon: Component<ComponentProps<"svg">> = (props) => {
  return (
    <svg
      fill="none"
      height="24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M3 2v1c0 1 2 1 2 2S3 6 3 7s2 1 2 2-2 1-2 2 2 1 2 2" />
      <path d="M18 6h.01" />
      <path d="M6 18h.01" />
      <path d="M20.83 8.83a4 4 0 0 0-5.66-5.66l-12 12a4 4 0 1 0 5.66 5.66Z" />
      <path d="M18 11.66V22a4 4 0 0 0 4-4V6" />
    </svg>
  );
};
