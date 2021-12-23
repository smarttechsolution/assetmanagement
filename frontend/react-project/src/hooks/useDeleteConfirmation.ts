import React from 'react'


const useDeleteConfirmation = () => {
    const [editId, setEditId] = React.useState<any>(null);
    const [modal, setModal] = React.useState(false);

    const toggleModal = () => {
        setModal(!modal)
    }

    const handleDeleteClick = (id) => {
        setModal(true);
        setEditId(id);
    };

    const resetDeleteData = () => {
        setEditId(null);
        setModal(false);
    };

    return {
        editId,
        modal,
        toggleModal,
        handleDeleteClick,
        resetDeleteData
    }
}

export default useDeleteConfirmation
