import classNames from "classnames";

const Header = ({children}) => {
  return (
    <header className={classNames('flex-box', 'margin-top-15')}>
      <div className={classNames('header')}>
        {children}
      </div>
    </header>
  );
}

export default Header;
