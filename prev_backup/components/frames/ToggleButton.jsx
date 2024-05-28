import classNames from "classnames";
import './ToggleButton.scss';

const ToggleButton = ({ isOn, toggleHandler }) => {
  return (
    <div className={classNames('flex-box', 'flex-content-right')} onClick={toggleHandler}>
      <div className={classNames('toggleButton-container')}>
        <div className={classNames('toggleButton-item')}>수정</div>
        <div className={classNames('toggleButton-item')}>읽기</div>
        <div className={classNames('toggleButton-circle')}>
          <div className={classNames('toggleButton-circle-item', {'toggleButton-circle-item-checked': isOn})}></div>
        </div>
      </div>
    </div>
  );
}

export default ToggleButton;
