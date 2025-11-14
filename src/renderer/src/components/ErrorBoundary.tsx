// src/renderer/src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.reload()
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-red-400">Something went wrong</h1>
                  <p className="text-slate-400 mt-1">
                    The application encountered an unexpected error
                  </p>
                </div>
              </div>

              {this.state.error && (
                <div className="bg-slate-900 rounded-lg p-4 mb-6">
                  <p className="font-mono text-sm text-red-300 mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-slate-400 text-sm hover:text-slate-300">
                        Stack trace
                      </summary>
                      <pre className="mt-2 text-xs text-slate-500 overflow-auto max-h-64">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <button
                onClick={this.handleReset}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Reload Application
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
