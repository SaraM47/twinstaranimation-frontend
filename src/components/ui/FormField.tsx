type Props = {
    label: string;
    error?: string;
    children: React.ReactNode;
  };
  
  export default function FormField({ label, error, children }: Props) {
    return (
      <div>
        <label className="text-sm text-gray-700">{label}</label>
  
        <div
          className={`mt-1 ${
            error ? "border border-red-500 rounded-lg" : ""
          }`}
        >
          {children}
        </div>
  
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }