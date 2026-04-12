import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('App crashed:', error);
  }

  render() {
    if (this.state.hasError) {
      return <section className="panel">页面出现错误，请刷新后重试。</section>;
    }
    return this.props.children;
  }
}
