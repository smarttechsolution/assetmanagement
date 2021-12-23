import React, { ComponentProps, Ref } from "react";
import "./button.scss";

export interface LoadingButtonProps extends ComponentProps<"button"> {
  forwardedRef?: Ref<any>;
  loading?: boolean;
  text?: any;
  small?: any;
}

export default function Button(props: LoadingButtonProps) {
  const { forwardedRef, loading, text, children, ...args } = props;

  return (
    <button
      {...args}
      ref={forwardedRef}
      className={`${props.className} ${
        props.small ? " custom-btn-small" : "custom-btn"
      }`}
    >
      {children ? (
        loading ? (
          <div className={loading ? "loading" : ""}>
            <div>{children}</div>
            {loading && <div className="spinner"></div>}
          </div>
        ) : (
          children
        )
      ) : (
        <div className={loading ? "loading" : ""}>
          <div>{text}</div>
          {loading && <div className="spinner"></div>}
        </div>
      )}
    </button>
  );
}
