function Pagination({ pagination, onChangePage }) {
  // 點擊頁碼時，呼叫 onChangePage 函式，並傳入頁碼
  const handleClick = (e, page) => {
    e.preventDefault();
    onChangePage(page);
  };

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        {/* 如果沒有上一頁，就disabled */}
        <li className={`page-item ${!pagination.has_pre && "disabled"}`}>
          {/* 如果有上一頁，就呼叫 handleClick 函式，並傳入上一頁的頁碼 */}
          <a
            className="page-link"
            href="#"
            aria-label="Previous"
            onClick={(e) => handleClick(e, pagination.current_page - 1)}
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        {/* 顯示頁碼 */}
        {Array.from({ length: pagination.total_pages }, (_, index) => (
          <li
            className={`page-item ${
              pagination.current_page === index + 1 && "active"
            }`}
            key={`${index}_page`}
          >
            <a
              className="page-link"
              href="#"
              // 點擊頁碼時，呼叫 handleClick 函式，並傳入頁碼
              onClick={(e) => handleClick(e, index + 1)}
            >
              {index + 1}
            </a>
          </li>
        ))}

        <li className={`page-item ${!pagination.has_next && "disabled"}`}>
          <a
            className="page-link"
            href="#"
            aria-label="Next"
            onClick={(e) => handleClick(e, pagination.current_page + 1)}
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
export default Pagination;
