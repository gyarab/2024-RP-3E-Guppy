import { useState, useEffect } from "react";
import Loader from "../shared/ui/Loader";
import OrganizationList from "../shared/ui/OrganizationList";
import { useGetOrganizationsQuery } from "../features/organization/organizationApi";
import { Organization } from "../shared/interfaces/Organization";

function HomePage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // Items per page

  // Fetch organizations and total count
  const { data, isLoading, isError, error } = useGetOrganizationsQuery({
    page: currentPage,
    limit,
  });

  // Handle previous page click
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Handle next page click
  const handleNextPage = () => {
    if (data && currentPage < Math.ceil(data.count / limit)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Handle page number click
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Effect to update organizations when the page changes
  useEffect(() => {
    if (data?.organizations) {
      setOrganizations((prevOrganizations) => [
        ...prevOrganizations,
        ...data.organizations,
      ]);
    }
  }, [data]);

  // Early return for loading or error states
  if (isLoading) {
    return (
      <div className="container">
        <Loader />
      </div>
    );
  }

  const totalPages = Math.ceil((data?.count || 0) / limit);

  return (
    <div className="container">
      <main className="main">
        <h1 className="main__title">Welcome to the Home Page</h1>

        {/* Display the organization list if data is available */}
        {organizations.length > 0 ? (
          <OrganizationList organizations={organizations} />
        ) : (
          <p>No organizations found.</p>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination__button"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {/* Display page numbers */}
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
