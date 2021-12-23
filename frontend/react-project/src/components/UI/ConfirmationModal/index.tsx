import React from "react";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Modal from "reactstrap/lib/Modal";
import Button from "components/UI/Forms/Buttons";
import { confirmationMessage } from "i18n/i18n";
import { useTranslation } from "react-i18next";

interface IProps {
  text?: string;
  open: boolean;
  handleModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirmClick: () => void;
  loading?: boolean;
}

function ConfirmationModal(props: IProps) {
  const { t } = useTranslation();
  const { text, open, loading, handleModal, handleConfirmClick } = props;
  return (
    <Modal isOpen={open} toggle={() => handleModal(false)} className="" centered={true}>
      <div className="modal-header">
        <div className="d-flex w-100">
          <div className="flex-grow-1">
            <h5 className="mt-2 mb-4 text-primary">{t('home:confirmation')}</h5>

            <h5 className="des">{text || confirmationMessage()}</h5>
          </div>
        </div>
      </div>

      <ModalFooter>
        <Button className="btn custom-btn-outlined" onClick={() => handleModal(false)}>
        {t('home:cancel')}
        </Button>
        <button className="btn custom-btn" onClick={() => handleConfirmClick()}>
          {loading ? <></> : t('home:confirm')}
        </button>
      </ModalFooter>
    </Modal>
  );
}

export default ConfirmationModal;
