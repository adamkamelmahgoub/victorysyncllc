
export default function Booker({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <iframe
      src="https://cal.com/victorysync/round-robin?theme=light"
      className="w-full h-[760px] border-0"
      allow="payment *; microphone *; camera *"
      title="Book with VictorySync"
    />
  );
}
