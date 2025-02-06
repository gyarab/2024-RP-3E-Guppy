import { useState } from "react";

import { useGetOrganizationsQuery } from "../features/organization/organizationApi";

import Loader from "../shared/ui/Loader";
import OrganizationList from "../shared/ui/OrganizationList";
import { FETCH_ORGS_LIMIT } from "../shared/constants/organization";

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useGetOrganizationsQuery({
    page: currentPage,
    limit: FETCH_ORGS_LIMIT,
  });

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (data && currentPage < Math.ceil(data.count / FETCH_ORGS_LIMIT)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="container">
        <Loader />
      </div>
    );
  }

  const organizations = data?.organizations || [];
  const totalPages = Math.ceil((data?.count || 0) / FETCH_ORGS_LIMIT);

  return (
    <div className="container">
      <main className="main">
        <h1 className="main__title">Organizations</h1>

        <OrganizationList organizations={organizations} />

        {/* TODO: Create a reusable <Pagination> component instead */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination__button"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  className={`pagination__button ${
                    pageNumber === currentPage ? "active" : ""
                  }`}
                  onClick={() => handlePageClick(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              className="pagination__button"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;
