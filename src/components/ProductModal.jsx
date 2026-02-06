import { useState, useEffect } from 'react';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal({ modalType, templateProduct, closeModal, getProducts }) {
  const [tempData, setTempData] = useState(templateProduct);

  useEffect(() => {
    setTempData(templateProduct);
  }, [templateProduct]);

  const TAG_OPTIONS = ['新品', '熱銷', '限時'];

  //modal輸入變更
  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempData((preData) => ({
      ...preData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  //modal多圖輸入變更
  const handleModalImageChange = (index, value) => {
    setTempData((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage[index] = value;
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  const handleAddImage = () => {
    setTempData((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage.push('');
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  const handleRemoveImage = () => {
    setTempData((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage.pop();
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  //新增或更新產品
  const upateProduct = async (id) => {
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = 'post';
    if (modalType === 'edit') {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
      method = 'put';
    }
    //新增產品做整理並送出資料
    const productData = {
      data: {
        ...tempData,
        //確保數字格式正確與圖片陣列不含空字串
        origin_price: Number(tempData.origin_price),
        price: Number(tempData.price),
        //轉換布林值為數字 1 0
        is_enabled: tempData.is_enabled ? 1 : 0,
        //防呆處理圖片空陣列
        imagesUrl: [...tempData.imagesUrl.filter((url) => url !== '')],
      },
    };
    try {
      const response = await axios[method](url, productData);

      response.data;
      getProducts();
      closeModal();
    } catch (error) {
      console.error(error.response);
    }
  };

  //刪除產品
  const delProduct = async (id) => {
    try {
      let response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${id}`,
      );
      console.log(response.data);
      getProducts();
      closeModal();
    } catch (error) {
      console.error(error.response);
    }
  };

  //上傳圖片
  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log('沒有檔案');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file-to-upload', file);
      const response = await axios.post(
        `${API_BASE}/api/${API_PATH}/admin/upload`,
        formData,
      );
      setTempData((pre) => {
        return {
          ...pre,
          imageUrl: response.data.imageUrl,
        };
      });
    } catch (error) {
      console.error(error.response);
    }
  };

  return (
    <div
      className="modal fade"
      id="productModal"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div
            className={`modal-header bg-${modalType === 'delete' ? 'danger' : 'dark'} text-white`}
          >
            <h5 id="productModalLabel" className="modal-title">
              <span>
                {modalType === 'delete'
                  ? '刪除'
                  : modalType === 'edit'
                    ? '編輯'
                    : '新增'}
                產品
              </span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {modalType === 'delete' ? (
              <p className="fs-4 text-center">
                確定要刪除
                <span className="text-danger">{tempData.title}</span>嗎？
              </p>
            ) : (
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-2">
                    <div className="mb-3">
                      <label htmlFor="fileUpload" className="form-label">
                        上傳圖片
                      </label>
                      <input
                        type="file"
                        id="fileUpload"
                        name="fileUpload"
                        accept=".jpg,.png,.jpeg"
                        className="form-control"
                        onChange={(e) => uploadImage(e)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址
                      </label>
                      <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        value={tempData.imageUrl}
                        onChange={handleModalInputChange}
                      />
                    </div>
                    {/* 先判斷是否有圖片網址，有的話就顯示圖片 */}
                    {tempData.imageUrl && (
                      <img
                        className="img-fluid"
                        src={tempData.imageUrl}
                        alt="主圖"
                      />
                    )}
                  </div>
                  <div>
                    {tempData.imagesUrl.map((url, index) => (
                      <div key={index}>
                        <label htmlFor="imageUrl" className="form-label">
                          輸入圖片網址
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`圖片網址${index + 1}`}
                          value={url}
                          onChange={(e) =>
                            handleModalImageChange(index, e.target.value)
                          }
                        />
                        {url && (
                          <img
                            className="img-fluid"
                            src={url}
                            // alt={`副圖${index + 1}`}
                          />
                        )}
                      </div>
                    ))}
                    {tempData.imagesUrl.length < 5 &&
                      tempData.imagesUrl[tempData.imagesUrl.length - 1] !==
                        '' && (
                        <button
                          className="btn btn-outline-primary btn-sm d-block w-100 mt-3 "
                          type="button"
                          onClick={() => handleAddImage()}
                        >
                          新增圖片
                        </button>
                      )}
                  </div>
                  <div className="mt-2">
                    {tempData.imagesUrl.length >= 1 && (
                      <button
                        className="btn btn-outline-danger btn-sm d-block w-100"
                        type="button"
                        onClick={() => handleRemoveImage()}
                      >
                        刪除圖片
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      value={tempData.title}
                      onChange={(e) => handleModalInputChange(e)}
                    />
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="category" className="form-label">
                        分類
                      </label>
                      <input
                        name="category"
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                        value={tempData.category}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">
                        單位
                      </label>
                      <input
                        name="unit"
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                        value={tempData.unit}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                        value={tempData.origin_price}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        name="price"
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                        value={tempData.price}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                  </div>
                  <hr />

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                      value={tempData.description}
                      onChange={(e) => handleModalInputChange(e)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      name="content"
                      id="content"
                      className="form-control"
                      placeholder="請輸入說明內容"
                      value={tempData.content}
                      onChange={(e) => handleModalInputChange(e)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">商品標籤</label>

                    <div className="d-flex gap-3">
                      {/* 商品標籤 */}
                      {TAG_OPTIONS.map((tag) => (
                        <div className="form-check" key={tag}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`tag-${tag}`}
                            //如果 tags 裡有值checkbox打勾
                            checked={tempData.tags.includes(tag)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              //如果 checked為true，將tag加到tags裡
                              //如果 checked為false，將tag移出tags裡
                              setTempData((prev) => ({
                                ...prev,
                                tags: checked
                                  ? [...prev.tags, tag]
                                  : prev.tags.filter((t) => t !== tag),
                              }));
                              // console.log(tempData.tags);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`tag-${tag}`}
                          >
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-check text-start">
                      <input
                        name="is_enabled"
                        id="is_enabled"
                        className="form-check-input"
                        type="checkbox"
                        checked={tempData.is_enabled}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                      <label className="form-check-label " htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            {modalType === 'delete' ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => delProduct(tempData.id)}
              >
                刪除
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => closeModal()}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => upateProduct(tempData.id)}
                >
                  確認
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductModal;
