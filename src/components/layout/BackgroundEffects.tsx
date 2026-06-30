export const BackgroundEffects = ({ animated = false }: { animated?: boolean }) => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none bg-section -z-10">

      {/* Orange glow — top left */}
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-primary-500/10 dark:bg-primary-500/20 blur-3xl" />

      {/* Blue glow — bottom right */}
      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-secondary-400/10 dark:bg-secondary-400/20 blur-3xl" />

      {animated && (
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-primary-500/10 dark:bg-primary-500/20 blur-3xl animate-pulse" />
      )}

    </div>
  );
};