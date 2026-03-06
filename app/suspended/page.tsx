import SuspendedClient from "./SuspendedClient";

export const metadata = {
  title: 'Site Unavailable | 3 Layered',
  robots: 'noindex, nofollow',
};

export default function SuspendedPage() {
  return <SuspendedClient />;
}
