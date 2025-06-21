import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    console.error("Error caught in ErrorBoundary:", error);
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log error to an error reporting service
    console.error("Error caught by boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="text-center py-10 px-4">
          <h2 className="text-2xl text-red-600 font-bold mb-2">Oops! Something went wrong.</h2>
          <p className="text-gray-700">Please refresh the page or try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;