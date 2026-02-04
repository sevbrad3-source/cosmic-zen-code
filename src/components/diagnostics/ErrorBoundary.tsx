import React, { Component, ErrorInfo, ReactNode } from 'react';
import { diagnostics } from '@/lib/diagnostics';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log to diagnostics engine
    diagnostics.addComponentCrash({
      component: this.props.componentName || 'Unknown',
      error: error.message,
      stack: error.stack || '',
      componentStack: errorInfo.componentStack || '',
      timestamp: Date.now(),
    });

    // Also log as a regular error for visibility
    diagnostics.addLog({
      type: 'error',
      source: 'ErrorBoundary',
      message: `Component crash in ${this.props.componentName || 'Unknown'}: ${error.message}`,
      stack: error.stack,
      data: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center h-full bg-neutral-950 p-6 text-center">
          <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-6 max-w-lg">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-400 mb-2">Component Crashed</h2>
            <p className="text-sm text-neutral-400 mb-4">
              {this.props.componentName && (
                <span className="text-red-300 font-mono">{this.props.componentName}</span>
              )}
              {this.props.componentName && ' encountered an error.'}
            </p>
            <div className="bg-neutral-900 rounded p-3 mb-4 text-left overflow-x-auto">
              <p className="text-xs font-mono text-red-400 break-all">
                {this.state.error?.message}
              </p>
            </div>
            {this.state.error?.stack && (
              <details className="text-left mb-4">
                <summary className="text-xs text-neutral-500 cursor-pointer hover:text-neutral-300">
                  Stack Trace
                </summary>
                <pre className="mt-2 bg-neutral-900 rounded p-2 text-[10px] font-mono text-neutral-500 overflow-x-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            {this.state.errorInfo?.componentStack && (
              <details className="text-left mb-4">
                <summary className="text-xs text-neutral-500 cursor-pointer hover:text-neutral-300">
                  Component Stack
                </summary>
                <pre className="mt-2 bg-neutral-900 rounded p-2 text-[10px] font-mono text-neutral-500 overflow-x-auto max-h-40">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <Button
              onClick={this.handleReset}
              variant="outline"
              size="sm"
              className="border-red-900 text-red-400 hover:bg-red-950"
            >
              <RefreshCw className="w-3 h-3 mr-2" />
              Try Again
            </Button>
          </div>
          <p className="text-[10px] text-neutral-600 mt-4">
            Press Ctrl+Shift+D to view diagnostics
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary componentName={componentName}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

export default ErrorBoundary;
