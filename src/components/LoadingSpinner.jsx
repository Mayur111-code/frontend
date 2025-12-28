import { memo } from "react";

const LoadingSpinner = memo(({ size = "h-8 w-8", className = "" }) => (
  <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${size} ${className}`}></div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;