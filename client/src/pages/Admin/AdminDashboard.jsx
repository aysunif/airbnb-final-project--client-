import React, { useEffect, useState } from "react";
import { Tabs, message, Modal, Tag } from "antd";
import UserTable from "../../components/UserTable";
import ListingTable from "../../components/ListingTable";
import {
    getAllUsers,
    banUser,
    deleteUser,
    getAllListings,
    deleteListing,
    approveListing,
    getListingDetails,
} from "../../api/admin";

const { TabPane } = Tabs;

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [listings, setListings] = useState([]);
    const [selectedListing, setSelectedListing] = useState(null); 
    const [isModalVisible, setIsModalVisible] = useState(false); 

    useEffect(() => {
        fetchUsers();
        fetchListings();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response.data);
        } catch (error) {
            message.error("Failed to fetch users");
        }
    };

    const fetchListings = async () => {
        try {
            const response = await getAllListings();
            setListings(response.data);
        } catch (error) {
            message.error("Failed to fetch listings");
        }
    };

    const handleGetDetails = async (listingId) => {
        try {
            const response = await getListingDetails(listingId);
            setSelectedListing(response.data);
            setIsModalVisible(true);
        } catch (error) {
            message.error("Failed to fetch listing details");
        }
    };

    const handleBanUser = async (userId) => {
        try {
            await banUser(userId);
            message.success("User ban status updated");
            fetchUsers();
        } catch (error) {
            message.error("Failed to update ban status");
        }
    };

    const handleApproveListing = async (listingId) => {
        try {
            await approveListing(listingId);
            message.success("Listing approved successfully");
            fetchListings();
        } catch (error) {
            message.error("Failed to approve listing");
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
            message.success("User deleted successfully");
            fetchUsers();
        } catch (error) {
            message.error("Failed to delete user");
        }
    };

    const handleDeleteListing = async (listingId) => {
        try {
            await deleteListing(listingId);
            message.success("Listing deleted successfully");
            fetchListings();
        } catch (error) {
            message.error("Failed to delete listing");
        }
    };

    return (
        <div style={{ padding: "24px" }}>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Users" key="1">
                    <UserTable
                        users={users}
                        onBan={handleBanUser}
                        onDelete={handleDeleteUser}
                    />
                </TabPane>
                <TabPane tab="Listings" key="2">
                    <ListingTable
                        listings={listings}
                        onDelete={handleDeleteListing}
                        onApprove={handleApproveListing}
                        onDetails={handleGetDetails}
                    />
                </TabPane>
            </Tabs>

            <Modal
                title="Listing Details"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                {selectedListing && (
                    <div>
                        <p>
                            <strong>Title:</strong> {selectedListing.title}
                        </p>
                        <p>
                            <strong>Category:</strong> {selectedListing.category}
                        </p>
                        <p>
                            <strong>Type:</strong> {selectedListing.type}
                        </p>
                        <p>
                            <strong>Price:</strong> ${selectedListing.price}
                        </p>
                        <p>
                            <strong>Description:</strong> {selectedListing.description}
                        </p>
                        <p>
                            <strong>Highlight:</strong> {selectedListing.highlight}
                        </p>
                        <p>
                            <strong>Address:</strong>{" "}
                            {selectedListing.streetAddress}, {selectedListing.aptSuite && `${selectedListing.aptSuite}, `}
                            {selectedListing.city}, {selectedListing.province}, {selectedListing.country}
                        </p>
                        <p>
                            <strong>Guest Count:</strong> {selectedListing.guestCount}
                        </p>
                        <p>
                            <strong>Bedrooms:</strong> {selectedListing.bedroomCount}
                        </p>
                        <p>
                            <strong>Beds:</strong> {selectedListing.bedCount}
                        </p>
                        <p>
                            <strong>Bathrooms:</strong> {selectedListing.bathroomCount}
                        </p>
                        <p>
                            <strong>Amenities:</strong>{" "}
                            {selectedListing.amenities.length > 0 ? selectedListing.amenities.join(", ") : "No amenities listed"}
                        </p>
                        <p>
                            <strong>Status:</strong>{" "}
                            <Tag color={selectedListing.isApproved ? "green" : "red"}>
                                {selectedListing.isApproved ? "Approved" : "Pending"}
                            </Tag>
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminDashboard;