import classNames from "classnames";
import Frame from "./Frame";

const DataForm = () => {
  return (
    <Frame>
      <form method="post" enctype="multipart/form-data" className={classNames('flex-box-column')}>
        <label for="image-file">
          <div class="btn-upload">파일 업로드하기</div>
        </label>
        <input type="file" name="imageFile" id="image-file" />

      </form>
    </Frame>
  );
}

export default DataForm;