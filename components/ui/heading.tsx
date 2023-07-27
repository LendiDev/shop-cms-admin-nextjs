"use client";

interface HeadingProps {
  title: string;
  subtitle?: string;
  className?: React.ComponentProps<"div">["className"];
}

const Heading: React.FC<HeadingProps> = ({ title, subtitle, className }) => {
  return (
    <div className={className}>
      <h2 className="font-bold text-3xl tracking-tight">{title}</h2>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </div>
  );
};

export default Heading;
