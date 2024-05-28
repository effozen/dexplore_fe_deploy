export default function ImageButton({imageSource, imageName = 'img', children="텍스트"}) {
  return (
    <li>
      <span>
        <button><img src={imageSource} alt={imageName}/></button>
        <div>{children}</div>
      </span>
    </li>
  );
}