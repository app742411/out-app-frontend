import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import GiftCardStats from "../../components/GiftCards/GiftCardStats";
import GiftCardListComp from "../../components/GiftCards/GiftCardListComp";
import CreateGiftCardModal from "../../components/GiftCards/CreateGiftCardModal";
import EditGiftCardModal from "../../components/GiftCards/EditGiftCardModal";
import GiftCardDetailsModal from "../../components/GiftCards/GiftCardDetailsModal";
import UserWalletModal from "../../components/GiftCards/UserWalletModal";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import { getAllGiftCards, deleteGiftCard } from "../../api/giftCardApi";
import useDebounce from "../../hooks/useDebounce";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

export default function GiftCardManage() {
  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [targetType, setTargetType] = useState("");
  const [status, setStatus] = useState("");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editCard, setEditCard] = useState(null);
  const [detailsCardId, setDetailsCardId] = useState(null);
  const [walletUserId, setWalletUserId] = useState(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchGiftCards = async (page = currentPage, isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const res = await getAllGiftCards({
        page,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch,
        targetType,
        status,
      });

      // Handle diverse response shapes gracefully
      let cards = [];
      let total = 0;

      if (Array.isArray(res)) {
        cards = res;
        total = res.length;
      } else if (res && Array.isArray(res.data)) {
        cards = res.data;
        total = res.totalCount || res.total || res.count || res.data.length;
      } else if (res && res.data && Array.isArray(res.data.giftCards)) {
        cards = res.data.giftCards;
        total = res.data.totalCount || res.data.total || res.data.giftCards.length;
      } else if (res && Array.isArray(res.giftCards)) {
        cards = res.giftCards;
        total = res.totalCount || res.total || res.giftCards.length;
      }

      setGiftCards(cards);
      setTotalCount(total);
      setCurrentPage(page);
      setTotalPages(Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)));
    } catch (error) {
      if (!isBackground) {
        toast.error(error?.message || "Failed to load gift cards");
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchGiftCards(1);
  }, [debouncedSearch, targetType, status]);

  const handlePageChange = (newPage) => {
    fetchGiftCards(newPage);
  };

  const handleDeleteConfirm = async () => {
    if (!cardToDelete?._id) return;
    try {
      await deleteGiftCard(cardToDelete._id);
      toast.success("Gift Card deleted successfully!");
      setIsDeleteOpen(false);
      setCardToDelete(null);
      fetchGiftCards(currentPage);
    } catch (error) {
      toast.error(error?.message || "Failed to delete gift card");
    }
  };

  const handleOpenWallet = (uid = null) => {
    setWalletUserId(uid);
    setIsWalletOpen(true);
  };

  return (
    <>
      <PageMeta title="Gift Card Management" />
      <PageBreadcrumb pageTitle="Gift Cards" />

      {/* Top Metric Cards */}
      <GiftCardStats giftCards={giftCards} totalCount={totalCount} />

      {/* Gift Cards List Component */}
      <div className="w-full">
        <GiftCardListComp
          giftCards={giftCards}
          loading={loading}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          search={search}
          setSearch={setSearch}
          targetType={targetType}
          setTargetType={setTargetType}
          status={status}
          setStatus={setStatus}
          onOpenCreate={() => setIsCreateOpen(true)}
          onOpenEdit={(card) => setEditCard(card)}
          onOpenDetails={(id) => setDetailsCardId(id)}
          onOpenWallet={(uid) => handleOpenWallet(uid)}
          onConfirmDelete={(card) => {
            setCardToDelete(card);
            setIsDeleteOpen(true);
          }}
          onRefresh={() => fetchGiftCards(currentPage, true)}
        />
      </div>

      {/* Create Modal */}
      <CreateGiftCardModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => fetchGiftCards(1)}
      />

      {/* Edit Modal */}
      <EditGiftCardModal
        isOpen={Boolean(editCard)}
        giftCard={editCard}
        onClose={() => setEditCard(null)}
        onSuccess={() => fetchGiftCards(currentPage, true)}
      />

      {/* Full Details Modal */}
      <GiftCardDetailsModal
        isOpen={Boolean(detailsCardId)}
        cardId={detailsCardId}
        onClose={() => setDetailsCardId(null)}
        onEdit={(card) => {
          setDetailsCardId(null);
          setEditCard(card);
        }}
        onOpenWallet={(uid) => {
          setDetailsCardId(null);
          handleOpenWallet(uid);
        }}
      />

      {/* User Wallet & Ledger Modal */}
      <UserWalletModal
        isOpen={isWalletOpen}
        userId={walletUserId}
        onClose={() => {
          setIsWalletOpen(false);
          setWalletUserId(null);
        }}
      />

      {/* Soft Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setCardToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Gift Card"
        message={`Are you sure you want to delete gift card "${cardToDelete?.code || "voucher"}"? It will be soft-deleted and removed from active circulation.`}
      />
    </>
  );
}
