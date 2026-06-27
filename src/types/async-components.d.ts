import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Allow async components to be used as JSX elements
type AsyncComponent<T = any> = React.FC<T> | ((props: T) => Promise<React.ReactElement>);

declare module "react" {
  interface JSXElementConstructor {
    (props: any): React.ReactElement | Promise<React.ReactElement>;
  }
}

// Allow react-icons to be used as JSX components
declare module "react-icons/*" {
  const icon: React.FC<React.SVGAttributes<SVGElement>>;
  export default icon;
}
