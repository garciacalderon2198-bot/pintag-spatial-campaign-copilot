type ProgressStep = {
  label: string;
  complete: boolean;
  current: boolean;
};

export function DemoProgress({ steps }: { steps: ProgressStep[] }) {
  return (
    <nav className="progress-rail" aria-label="Demo progress">
      <ol>
        {steps.map((step, index) => (
          <li
            key={step.label}
            className={`${step.complete ? "complete" : ""} ${step.current ? "current" : ""}`.trim()}
            aria-current={step.current ? "step" : undefined}
          >
            <span>{step.complete ? "✓" : index + 1}</span>
            <small>{step.label}</small>
          </li>
        ))}
      </ol>
    </nav>
  );
}
