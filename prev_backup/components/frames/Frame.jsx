import classNames from "classnames";

const Frame = ({className, children}) => {
  return (
    <div className={classNames('flex-container', className)}>
      {children}
    </div>
  );
}

export default Frame;
