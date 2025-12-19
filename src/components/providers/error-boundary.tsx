"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { analytics } from "@/lib/analytics"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Track error in analytics
    analytics.errorOccurred(
      error.name || "Unknown Error",
      error.message,
      errorInfo.componentStack?.split("\n")[0] || "Unknown",
      error.stack
    )

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: 600 }}>
              Something went wrong
            </h2>
            <p style={{ marginBottom: "24px", opacity: 0.7 }}>
              We've been notified and are working on a fix.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              style={{
                padding: "12px 24px",
                backgroundColor: "#7F56D9",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Reload Page
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}

