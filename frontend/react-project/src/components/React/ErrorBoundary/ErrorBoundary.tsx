import React, { ErrorInfo } from 'react';
import './ErrorBoundary.scss';

interface IState {
    /** Flag to indicate if error captured or not */
    hasError: boolean;
}

class ErrorBoundary extends React.Component<{}, IState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            hasError: false
        }

        this.refreshPage = this.refreshPage.bind(this);
    }

    // Learn more why used at https://reactjs.org/docs/error-boundaries.html
    static getDerivedStateFromError(): IState {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        if(process.env.NODE_ENV === "development"){
            console.log({ error: error, errorInfo: info });
        }
    }

    refreshPage() {
        window.location.reload();
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary--container">
                    <div className="error-boundary--content">

                        <h1 className="error-boundary--header">Something went wrong!</h1>
                        <summary className="error-boundary--summary">
                            <p>Oops, looks like there is some problem we are facing. Please check in later.</p>
                        </summary>

                        <div className="error-boundary--button">
                            <button className="btn btn-warning text-white" onClick={this.refreshPage}>Refresh Page</button>
                        </div>
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}
export default ErrorBoundary;
