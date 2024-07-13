import { IconProps } from "react-feather";

export const Icons = {
  gamepad: ({ ...props }: IconProps) => (
    <svg
      className="fill-white h-5"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-testid="SportsEsportsIcon"
    >
      <path d="m21.58 16.09-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91M11 11H9v2H8v-2H6v-1h2V8h1v2h2zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1"></path>
    </svg>
  ),
  refresh: ({ ...props }: IconProps) => (
    <svg
      className="h-6 w-6 fill-blue-600"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-testid="RefreshIcon"
    >
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"></path>
    </svg>
  ),
};
