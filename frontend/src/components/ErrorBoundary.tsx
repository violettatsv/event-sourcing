import React from "react";
import { toast } from "react-toastify";

interface State {
  hasError: boolean;
}
interface Props {
  children?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo);
    toast.error(`Непредвиденная ошибка: ${error.message}`);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Что-то пошло не так.</h1>;
    }

    return this.props.children as React.ReactElement;
  }
}
