import React, { useEffect, useState } from "react";
import { approveVendor, getAllUnverifiedVendors } from "utils/utils";
import { sendEmail } from "utils/email";
import "./Vendors.scss";
import { auth } from "utils/firebase";
import { useNavigate } from "react-router-dom";
import MapboxMarker from "components/Mapbox/MapBoxMarker";

function Vendors() {
  const [unverifiedVendors, setUnverifiedVendors] = useState([]);
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);
  const approvalTemplate = "template_85u4049";
  const rejectionTemplate = "template_31g6itq";

  useEffect(() => {
    const fetchUnverifiedVendors = async () => {
      try {
        const vendors = await getAllUnverifiedVendors();
        setUnverifiedVendors(vendors);
      } catch (error) {
        console.error("Error fetching unverified vendors:", error);
      }
    };
    fetchUnverifiedVendors();
  }, []);

  const handleApprovalAndEmail = async (vendor) => {
    try {
      // First, send the approval email
      sendEmail(vendor, approvalTemplate);

      // Then, approve the vendor
      await approveVendor(vendor.id);

      // Remove the approved vendor from the unverified vendors list
      setUnverifiedVendors((prevVendors) =>
        prevVendors.filter((v) => v.id !== vendor.id)
      );
    } catch (error) {
      console.error("Error approving and sending email:", error);
    }
  };

  const handleRejectionEmail = async (vendor) => {
    try {
      // Send the rejection email
      sendEmail(vendor, rejectionTemplate);

      // Remove the rejected vendor from the unverified vendors list
      setUnverifiedVendors((prevVendors) =>
        prevVendors.filter((v) => v.id !== vendor.id)
      );
    } catch (error) {
      console.error("Error sending rejection email:", error);
    }
  };

  const handleLogOut = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleOpenMap = () => {
    setShowMap(true);
  };

  const handleCloseMap = () => {
    setShowMap(false);
  };

  return (
    <div className="admin-vendors">
      <div className="header">
        <h1>Unverified Vendors</h1>
        <button onClick={handleLogOut}>Logout</button>
      </div>
      {unverifiedVendors && unverifiedVendors.length > 0 ? (
        <div className="card-container">
          {unverifiedVendors.map((vendor) => (
            <div className="vendor-card" key={vendor.id}>
              <div className="card-header">
                <h2>{vendor.displayName}</h2>
              </div>
              <div className="card-body">
                <p>Store Name: {vendor.idNumber}</p>
                <p>Phone Number: {vendor.phoneNumber}</p>
                <p>Store Image:</p>
                <img src={vendor.imageUrl} alt="Location" /> 
                <div>
                  <div className="vendor-map">
                    <button className="open-map" onClick={handleOpenMap}>
                      Open Map
                    </button>
                    {showMap && (
                      <div className="signup-modal">
                        <div className="signup-modal-content">
                          <MapboxMarker
                            latitude={vendor.latitude}
                            longitude={vendor.longitude}
                          />
                          <button
                            className="close-modal"
                            onClick={handleCloseMap}
                          >
                            Close Map
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button onClick={() => handleApprovalAndEmail(vendor)}>
                  Approve
                </button>
                <button onClick={() => handleRejectionEmail(vendor)}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h1>No Vendors Yet</h1>
      )}
    </div>
  );
}

export default Vendors;
