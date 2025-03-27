import { useState } from "react";

import { useGetOrganizationInfoQuery } from "../../features/organization/organizationApi";
import Loader from "./Loader";
import { skipToken } from "@reduxjs/toolkit/query";

function Aside() {
  const [copied, setCopied] = useState(false);

  const orgId = sessionStorage.getItem("orgId");

  const { data: orgInfo, isLoading } = useGetOrganizationInfoQuery(
    orgId ? Number(orgId) : skipToken
  );

  const handleCopy = () => {
    if (!orgInfo?.joinCode) return;
    navigator.clipboard.writeText(orgInfo.joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {isLoading && <Loader />}
      <aside className="aside">
        <h3 className="aside__title">{orgInfo?.name}</h3>
        <div className="aside__content">
          <div className="aside__item">
            <p className="aside__text">
              <strong>Description:</strong> {orgInfo?.description}
            </p>
            <p className="aside__text">
              <strong>Owner:</strong> @{orgInfo?.owner.name}
            </p>
            <p className="aside__text">
              <strong>Total Users:</strong> {orgInfo?.totalMembers}
            </p>
            <p className="aside__text">
              <strong>Total Posts:</strong> {orgInfo?.totalPosts}
            </p>
            <div className="join-code-container">
              <p className="aside__text">
                <strong>Join Code:</strong> {orgInfo?.joinCode}
              </p>
              <button className="copy-button" onClick={handleCopy}>
                {copied ? (
                  <img src="/icons/check.svg" alt="Check Icon" />
                ) : (
                  <img src="/icons/copy-icon.svg" alt="Clipboard Icon" />
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Aside;
