// Minimal layout for the TV-screen reveal: no navbar, no footer, no marquee.
// Renders children inside an empty fragment so the reveal page can claim the
// full viewport. The ClientChrome `HIDE_HEADER_PREFIXES` entry handles the
// global chrome; this layout exists primarily to namespace metadata.

export const metadata = {
  title: "Fan Poll — Winner Reveal",
};

export default function RevealLayout({ children }) {
  return <>{children}</>;
}
