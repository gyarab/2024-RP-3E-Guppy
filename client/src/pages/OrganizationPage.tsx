import { useEffect, useState } from "react";
import { useGetOrganizationsQuery } from "../features/organization/organizationApi";
import OrganizationList from "../shared/ui/OrganizationList";
import Loader from "../shared/ui/Loader";
import { OrgnizationWithJoin } from "../shared/interfaces/Organization";
import useDebounce from "../shared/hooks/useDebounce";

function OrganizationPage() {
  const [organizations, setOrganizations] = useState<OrgnizationWithJoin[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const { data, isLoading } = useGetOrganizationsQuery({
    page: 1,
    limit: 10,
    searchType: searchType !== "all" ? searchType : undefined,
    query: debouncedSearchQuery || undefined,
  });

  useEffect(() => {
    if (data) {
      setOrganizations(data.organizations);
    }
  }, [data]);

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value);
  };

  return (
    <div className="container">
      {isLoading && <Loader />}
      <h2 className="section__title">Join Any Organization You Like!</h2>

      <div className="search-container">
        <div className="search-bar-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-bar"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-button"
                onClick={() => setSearchQuery("")}
              >
                ✖
              </button>
            )}
          </div>
          <div className="search-type-wrapper">
            <select
              value={searchType}
              onChange={handleSearchTypeChange}
              className="search-type-select"
            >
              <option value="all">All</option>
              <option value="name">Name</option>
              <option value="description">Description</option>
            </select>
          </div>
        </div>
      </div>

      <OrganizationList organizations={organizations} />
    </div>
  );
}

export default OrganizationPage;
