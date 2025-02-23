import React, { useEffect, useState } from "react";
import { Tabs, message, Modal, Tag, Grid } from "antd";
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
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "../../assets/styles/AdminDashboard.module.scss";
import { useSelector } from "react-redux";
const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [listings, setListings] = useState([]);
    const [selectedListing, setSelectedListing] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();
    const screens = useBreakpoint(); 
    const user = useSelector((state) => state.user);

    useEffect(() => {
        if (user?.role === 'user') {
            navigate('/')
        }
    }, [])

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
        <>
         <Helmet>
                <title>Airbnb | Admin Dashboard</title>
                <meta name="description" content="admin dashboard page" />
              </Helmet>
        <div className={styles.container}>
            <Tabs defaultActiveKey="1" className={styles.tabs}>
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
                width={screens.md ? "800px" : "90%"} 
            >
                {selectedListing && (
                    <div className={styles.modalContent}>
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
                            <strong>Address:</strong> {selectedListing.streetAddress},{" "}
                            {selectedListing.aptSuite && `${selectedListing.aptSuite}, `}
                            {selectedListing.city}, {selectedListing.province},{" "}
                            {selectedListing.country}
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
                            {selectedListing.amenities.length > 0
                                ? selectedListing.amenities.join(", ")
                                : "No amenities listed"}
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
        </>
    );
};

export default AdminDashboard;