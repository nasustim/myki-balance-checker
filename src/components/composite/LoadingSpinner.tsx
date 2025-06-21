interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  message?: string;
}

export default function LoadingSpinner({
  size = 'md',
  variant = 'primary',
  message,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-green-600',
    white: 'text-white',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} ${colorClasses[variant]} animate-nfc-scan`}>
          <svg
            className="h-full w-full"
            viewBox="0 0 24 24"
            fill="none"
            aria-label="Loading spinner"
          >
            <title>Loading</title>
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="60 40"
              className="animate-spin"
            />
          </svg>
        </div>

        {/* Inner NFC icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className={`${size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-8 w-8'} ${colorClasses[variant]} animate-pulse-soft`}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-label="NFC icon"
          >
            <title>NFC</title>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>
      </div>

      {message && (
        <p
          className={`animate-pulse-soft font-medium text-sm ${
            variant === 'white' ? 'text-white' : 'text-gray-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
