import axios from 'axios';
import './assets/style.css';
import * as bootstrap from 'bootstrap';
import { useEffect, useRef, useState } from 'react';
import ProductModal from './components/ProductModal';
import Pagination from './components/Pagination';
import Login from './views/Login';
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
//宣告原api產品資料的屬性 提供後續使用
const INITAL_TEMPLATE_DATA = {
  id: '',
  title: '',
  category: '',
  origin_price: '',
  price: '',
  unit: '',
  description: '',
  content: '',
  is_enabled: false,
  imageUrl: '',
  imagesUrl: [],
  tags: [],
};

//建立表單元件
function App() {
  const [isAuth, setIsAuth] = useState(false);
  //產品列表
  const [products, setProducts] = useState([]);
  //產品資料模板
  const [templateProduct, setTemplateProduct] = useState(INITAL_TEMPLATE_DATA);
  //modal類型 新增 編輯 刪除
  const [modalType, setModalType] = useState('');
  //分頁
  const [pagination, setPagination] = useState({});

  //modal元件參考
  const productModalRef = useRef(null);

  //取得產品列表
  const getProducts = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      //  console.log('產品列表', response.data.products);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error(error.response);
    }
  };

  //1.登入狀態檢查
  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('hexToken='))
      ?.split('=')[1];
    //取得token後設定預設headers
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
    }
    //初始化 Modal
    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false,
    });

    const checkLogin = async () => {
      try {
        //確認是否登入
        const response = await axios.post(`${API_BASE}/api/user/check`);
        console.log(response.data);
        setIsAuth(true);
        //取得產品列表
        getProducts();
      } catch (error) {
        console.log(error.response?.data.message);
      }
    };
    checkLogin();
  }, []);

  //bootstrap打開 Modal用show方法
  //設定編輯按鈕資料與開啟產品列表為空陣列
  const openModal = (type, product) => {
    setModalType(type);
    setTemplateProduct({
      ...INITAL_TEMPLATE_DATA,
      ...product,
    });
    productModalRef.current.show();
  };
  const closeModal = () => {
    productModalRef.current.hide();
  };

  return (
    <>
      {!isAuth ? (
        <Login getProducts={getProducts} setIsAuth={setIsAuth} />
      ) : (
        <div className="container">
          <h2>產品列表</h2>
          <div className="text-end mt-4">
            <button
              type="button"
              //綁定開啟 Modal 事件
              className="btn btn-primary"
              onClick={() => openModal('create', INITAL_TEMPLATE_DATA)}
            >
              建立新的產品
            </button>
          </div>

          <table className="table table-hover">
            <thead>
              <tr className="text-center">
                <th scope="col">分類</th>
                <th scope="col" className="text-success">
                  產品名稱
                </th>
                <th scope="col" className="text-success">
                  原價
                </th>
                <th scope="col" className="text-success">
                  售價
                </th>
                <th scope="col" className="text-success">
                  是否啟用
                </th>
                <th scope="col" className="text-success">
                  編輯
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr className="text-center" key={product.id}>
                  <td>{product.category}</td>
                  <td>{product.title}</td>
                  <td>{product.origin_price}</td>
                  <td>{product.price}</td>
                  {/* 當前條件運算式會在 product.is_enabled 為 true 時，啟用顯示綠色 */}
                  <td className={`${product.is_enabled && 'text-success'}`}>
                    {product.is_enabled ? '啟用' : '未啟用'}
                  </td>
                  <td>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic example"
                    >
                      {/* 綁定開啟 Modal 事件並傳入當前產品資料 */}
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openModal('edit', product)}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => openModal('delete', product)}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination pagination={pagination} onChangePage={getProducts} />
        </div>
      )}

      <ProductModal
        modalType={modalType}
        templateProduct={templateProduct}
        closeModal={closeModal}
        getProducts={getProducts}
      />
    </>
  );
}

export default App;
